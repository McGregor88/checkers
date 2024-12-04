import { Square } from './Square';
import { Colors } from './Colors';
import { Checker } from './figures/Checker';

export class Board {
    squares: Square[][] = [];
    maxSquaresInRow: number = 8;

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

    public getDarkSquares() {
        //pass
    }

    public getCopyBoard(): Board {
        const newBoard = new Board();
        newBoard.squares = this.squares;
        return newBoard;
    }

    public highlightSquares(selectedSquare: Square | null): void {
        for (let i = 0; i < this.squares.length; i++) {
            const row = this.squares[i];
            for (let j = 0; j < row.length; j++) {
                const target = row[j];
                target.availableForSelection = !!selectedSquare?.figure?.canMove(target);
            }
        } 
    }

    public highlightFigures(): void {
        //pass
    }

    public moveFigureFromSelectedSquare(selectedSquare: Square, targetSquare: Square): void {
        const figure = selectedSquare.figure;
        if (!figure || !figure?.canMove(targetSquare)) return;

        const nearestSquare: Square = this.getNearestSquare(selectedSquare, targetSquare);

        targetSquare.figure = figure;
        targetSquare.figure.square = targetSquare;
        this.removeFigureFromSquare(selectedSquare);

        if (nearestSquare.x !== targetSquare.x && nearestSquare.y !== targetSquare.y) {
            this.removeFigureFromSquare(nearestSquare);
        }
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
}
