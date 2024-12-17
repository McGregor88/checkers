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

    public addFigures(): void {
        this.addCheckers();
    }

    public getSquare(x: number, y: number): Square {
        return this.squares[y][x];
    }

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

    public getCopyBoard(): Board {
        const newBoard = new Board();
        // TODO: Попробавить lodash с функцией deepCopy использовать
        newBoard.squares = this.squares;
        newBoard.lostBlackFigures = this.lostBlackFigures;
        newBoard.lostWhiteFigures = this.lostWhiteFigures;
        return newBoard;
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

    public moveFigureFromSelectedSquare(selectedSquare: Square, targetSquare: Square): void {
        const figure = selectedSquare.figure;
        if (!figure || !figure?.canMove(targetSquare)) return;

        const nearestSquare: Square = this.getNearestSquare(selectedSquare, targetSquare);
        const figureColor: Colors = figure.color;

        targetSquare.figure = figure;
        targetSquare.figure.square = targetSquare;
        this.removeFigureFromSquare(selectedSquare);

        // Если перепрыгиваем вражескую фигуру, то забираем ее
        if (nearestSquare.x !== targetSquare.x && nearestSquare.y !== targetSquare.y && nearestSquare.figure) {
            this.addLostFigure(nearestSquare.figure)
            this.removeFigureFromSquare(nearestSquare);
        }

        // Если черная или белая фигура достигли края то она становится дамкой
        if ((
            (figureColor === Colors.WHITE && targetSquare.y === 0) || 
            (figureColor === Colors.BLACK && targetSquare.y === 7)) && 
            !figure.isDame
        ) {
            targetSquare.figure.isDame = true;
        }
    }

    private addLostFigure(figure: Figure): void {
        figure?.color === Colors.BLACK ? 
            this.lostBlackFigures.push(figure) 
        : 
            this.lostWhiteFigures.push(figure);
    }

    private removeFigureFromSquare(square: Square): void {
        square.figure = null;
    }

    private addCheckers(): void {
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
}
