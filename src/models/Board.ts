import { Square } from './Square';
import { Colors } from './Colors';
import { Figure } from './figures/Figure';
import { Checker } from './figures/Checker';

export class Board {
    readonly maxSquaresInRow: number = 8;
    squares: Square[][] = [];
    lostBlackFigures: Figure[] = [];
    lostWhiteFigures: Figure[] = [];

    public initSquares(): void {
        for (let i = 0; i < this.maxSquaresInRow; i++) {
            const row: Square[] = [];
            for (let j = 0; j < this.maxSquaresInRow; j++) {
                const color: Colors = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
                row.push(new Square(j, i, color, null));
            }
            this.squares.push(row);
        }
    }

    public setUpFigures(): void {
        this.setUpCheckers();
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        // TODO: Попробавить lodash с функцией deepCopy использовать
        newBoard.squares = this.squares;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        return newBoard;
    }

    public getSquare(x: number, y: number): Square {
        return this.squares[y][x];
    }

    public getNearestSquares(startingSquare: Square, target: Square, absX: number): Square[] {
        const nearestSquares: Square[] = [];

        if (absX > 0) {
            for (let i = 1; i <= absX; i++) {
                const x: number = target.x < startingSquare.x ? startingSquare.x - (i) : startingSquare.x + (i);
                const y: number = target.y < startingSquare.y ? startingSquare.y - (i) : startingSquare.y + (i);
                nearestSquares.push(this.getSquare(x, y));
            }
        }
    
        return nearestSquares;
    }

    //TODO: Скорее всего это не пригодится
    public getNearestSquare(startingSquare: Square, targetSquare: Square): Square {
        const x: number = targetSquare.x < startingSquare.x ? startingSquare.x - 1 : startingSquare.x + 1;
        const y: number = targetSquare.y < startingSquare.y ? startingSquare.y - 1 : startingSquare.y + 1;
        return this.getSquare(x, y);
    }

    public getDarkSquares(): Square[][] {
        const darkSquares: Square[][] = [];
        for (let i = 0; i < this.squares.length; i++) {
            const row = this.squares[i].filter(square => square.color === Colors.BLACK);
            darkSquares.push(row);
        }
        return darkSquares;
    }

    public getSquaresWithFigureByColor(color: Colors): Square[] {
        const squaresWithFigure: Square[] = [];
        const darkSquares: Square[][] = this.getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square = row[j];
                if (square?.figure?.color === color) {
                    squaresWithFigure.push(square);
                }
            }
        }
    
        return squaresWithFigure;
    }

    public getEmptySquares(): Square[] {
        const emptySquares: Square[] = [];
        const darkSquares: Square[][] = this.getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square = row[j];
                square.isEmpty() && emptySquares.push(square);
            }
        }

        return emptySquares;
    }

    // TODO: Перенести
    public getAbsX(x1: number, x2: number): number {
        return Math.abs(x1 - x2);
    }

    public highlightSquares(selectedSquare: Square | null): void {
        const darkSquares: Square[][] = this.getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.availableForSelection = !!selectedSquare?.figure?.canMove(target);
            }
        }
    }

    public highlightFigures(color: Colors | null): void {
        if (!color) return;
        this.unHighlightSquares();
        const squaresWithFigure: Square[] = this.getSquaresWithFigureByColor(color);
        const emptySquares: Square[] = this.getEmptySquares();

        for (let i = 0; i < squaresWithFigure.length; i++) {
            const squareWithFigure = squaresWithFigure[i];
            
            for (let j = 0; j < emptySquares.length; j++) {
                const target = emptySquares[j];
                if (!squareWithFigure.availableForMoving && squareWithFigure?.figure?.canMove(target)) {
                    squareWithFigure.availableForMoving = true;
                }
            }
        }
    }

    public moveFigureFromSelectedSquare(selectedSquare: Square, target: Square): void {
        const figure = selectedSquare.figure;
        if (!figure || !figure?.canMove(target)) return;

        const absX: number = this.getAbsX(target.x, selectedSquare.x);
        const nearestSquares: Square[] = this.getNearestSquares(selectedSquare, target, figure.isDame ? absX : 1);
        const attackedTarget: Square | undefined = nearestSquares.find(square => square?.figure);

        target.figure = figure;
        target.figure.square = target;
        this.removeFigureFromSquare(selectedSquare);
        // Если перепрыгиваем вражескую фигуру, то забираем ее
        if (attackedTarget && attackedTarget.x !== target.x && attackedTarget.y !== target.y && attackedTarget.figure) {
            this.captureEnemyPiece(attackedTarget.figure);
        }
        // Проверим фигуру на дамку
        this.checkFigureForDame(figure);
    }

    private setUpCheckers(): void {
        const MAX_CHECKERS_IN_ROW: number = this.maxSquaresInRow / 2;
        let offset: number = 1;
        let x: number = 1;
        let y: number = 0;

        for (let i = 0; i < MAX_CHECKERS_IN_ROW * 3; i++) {
            if (i && i % MAX_CHECKERS_IN_ROW === 0) { 
                y += 1; 
                offset = Number(y % 2 === 0);
            }
            x = (i * 2) - (this.maxSquaresInRow * y) + offset;

            new Checker(this, Colors.BLACK, this.getSquare(x, y));
            new Checker(this, Colors.WHITE, this.getSquare(this.maxSquaresInRow - (x + 1), this.maxSquaresInRow - (y + 1)));
        }
    }

    private unHighlightSquares() {
        const darkSquares: Square[][] = this.getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square = row[j];
                square.availableForMoving = false;
            }
        }
    }

    private removeFigureFromSquare(square: Square): void {
        square.figure = null;
    }

    private captureEnemyPiece(figure: Figure | null): void {
        if (!figure) return;
        this.addLostFigure(figure);
        this.removeFigureFromSquare(figure.square);
    }

    private addLostFigure(figure: Figure): void {
        figure?.color === Colors.BLACK ? 
            this.lostBlackFigures.push(figure) 
        : 
            this.lostWhiteFigures.push(figure);
    }

    private checkFigureForDame(figure: Figure): void {
        const figureColor: Colors = figure.color;
    
        if ((
            (figureColor === Colors.WHITE && figure.square.y === 0) || 
            (figureColor === Colors.BLACK && figure.square.y === 7)) && 
            !figure.isDame
        ) {
            figure.isDame = true;
        }
    }
}
