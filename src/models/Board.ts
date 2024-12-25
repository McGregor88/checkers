import _ from 'lodash';

import { toABS } from '../lib/utils';
import { Colors } from '../types/colors';
import { Square } from './Square';
import { Figure } from './figures/Figure';
import { Checker } from './figures/Checker';

export class Board {
    private readonly _maxSquaresInRow: number = 8;
    private readonly lostBlackPieces: Figure[] = [];
    private readonly lostWhitePieces: Figure[] = [];
    readonly squares: Square[][] = [];

    public initSquares(): void {
        for (let i = 0; i < this._maxSquaresInRow; i++) {
            const row: Square[] = [];
            for (let j = 0; j < this._maxSquaresInRow; j++) {
                const color: Colors = (i + j) % 2 !== 0 ? Colors.BLACK : Colors.WHITE;
                row.push(new Square(j, i, color, null));
            }
            this.squares.push(row);
        }
    }

    public setUpPieces(): void {
        this._setUpCheckers();
    }

    public getCopyBoard(): Board {
        return _.clone(this);
    }

    public getEmptySquares(): Square[] {
        const emptySquares: Square[] = [];
        const darkSquares: Square[][] = this._getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square = row[j];
                square.isEmpty() && emptySquares.push(square);
            }
        }

        return emptySquares;
    }

    public getNearestSquares(from: Square, target: Square, absX: number): Square[] {
        const nearestSquares: Square[] = [];

        if (absX > 0) {
            for (let i = 1; i <= absX; i++) {
                const x: number = target.x < from.x ? from.x - i : from.x + i;
                const y: number = target.y < from.y ? from.y - i : from.y + i;
                nearestSquares.push(this._getSquare(x, y));
            }
        }
    
        return nearestSquares;
    }

    public getLostEnemyPieces(playerColor: Colors | undefined): Figure[] | [] {
        if (!playerColor) return [];
        return playerColor === Colors.WHITE ? this.lostBlackPieces : this.lostWhitePieces;
    }

    public hasRequiredSquares(squares: Square[], target: Square | null): boolean {
        return squares.findIndex((square: Square) => target?.figure?.mustJump(square)) !== -1;
    }

    public highlightSquares(selectedSquare: Square | null): void {
        const figure: Figure | null = selectedSquare?.figure || null;
        const emptySquares: Square[] = this.getEmptySquares();
        const hasRequiredSquares: boolean = this.hasRequiredSquares(emptySquares, selectedSquare);
    
        for (let i = 0; i < emptySquares.length; i++) {
            const target: Square = emptySquares[i];
            const availableForSelection: boolean = hasRequiredSquares 
            ? 
                !!figure?.mustJump(target) 
            : 
                !!figure?.canMove(target);

            target.availableForSelection = availableForSelection;
            if (hasRequiredSquares && availableForSelection && selectedSquare && figure) {
                const nearestSquares: Square[] | [] = this.getNearestSquares(
                    selectedSquare, 
                    target, 
                    figure.isDame ? toABS(target.x, selectedSquare.x) : 1
                ) || [];
                const highlightedTargets: Square[] | [] = nearestSquares.filter(
                    (square: Square) => square.isEmpty() && !figure?.mustJump(square) && figure?.canMove(square)
                );

                if (highlightedTargets.length) {
                    highlightedTargets.forEach((target: Square) => {
                        if (!target.highlighted) target.highlighted = true;
                    });
                }
            }
        }
    }

    public highlightPieces(color: Colors | null): void {
        this._unHighlightPieces();
        if (!color) return;
        this._getAvailableSquaresForMoving(color).forEach((el: Square) => el.availableForMoving = true);
    }

    public removeFigureFromSquare(square: Square): void {
        square.figure = null;
    }

    public captureEnemyPiece(figure: Figure | null): void {
        if (!figure) return;
        this._addLostFigure(figure);
        this.removeFigureFromSquare(figure.square);
    }

    public checkFigureForDame(figure: Figure): void {
        const figureColor: Colors = figure.color;
    
        if ((
            (figureColor === Colors.WHITE && figure.square.y === 0) || 
            (figureColor === Colors.BLACK && figure.square.y === 7)) && 
            !figure.isDame
        ) {
            figure.isDame = true;
        }
    }

    private _setUpCheckers(): void {
        const MAX_CHECKERS_IN_ROW: number = this._maxSquaresInRow / 2;
        let offset: number = 1;
        let x: number = 1;
        let y: number = 0;

        for (let i = 0; i < MAX_CHECKERS_IN_ROW * 3; i++) {
            if (i && i % MAX_CHECKERS_IN_ROW === 0) { 
                y += 1; 
                offset = Number(y % 2 === 0);
            }
            x = (i * 2) - (this._maxSquaresInRow * y) + offset;

            new Checker(this, Colors.BLACK, this._getSquare(x, y));
            new Checker(this, Colors.WHITE, this._getSquare(
                this._maxSquaresInRow - (x + 1), this._maxSquaresInRow - (y + 1)
            ));
        }
    }

    private _getSquare(x: number, y: number): Square {
        return this.squares[y][x];
    }

    private _getDarkSquares(): Square[][] {
        const darkSquares: Square[][] = [];
        for (let i = 0; i < this.squares.length; i++) {
            const row: Square[] = this.squares[i].filter(square => square.color === Colors.BLACK);
            darkSquares.push(row);
        }
        return darkSquares;
    }

    private _getSquaresWithFigureByColor(color: Colors): Square[] {
        const squaresWithFigure: Square[] = [];
        const darkSquares: Square[][] = this._getDarkSquares();

        for (let i = 0; i < darkSquares.length; i++) {
            const row = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square: Square = row[j];
                if (square?.figure?.color === color) {
                    squaresWithFigure.push(square);
                }
            }
        }
    
        return squaresWithFigure;
    }

    private _getPossibleSquaresByColor(squares: Square[], color: Colors): Square[] {
        const possibleSquaresForMoving: Square[] = [];
        const squaresWithPieces: Square[] = this._getSquaresWithFigureByColor(color);
    
        for (let i = 0; i < squaresWithPieces.length; i++) {
            const item: Square = squaresWithPieces[i];
            
            for (let j = 0; j < squares.length; j++) {
                const target: Square = squares[j];
                const index: number = possibleSquaresForMoving.findIndex(
                    (square: Square) => square.x === item.x && square.y === item.y
                );

                if (!item.availableForMoving && item?.figure?.canMove(target) && index === -1) {
                    possibleSquaresForMoving.push(item);
                }
            }
        }
        
        return possibleSquaresForMoving;
    }

    private _getAvailableSquaresForMoving(color: Colors): Square[] {
        const emptySquares: Square[] = this.getEmptySquares();
        const possibleSquaresForMoving: Square[] = this._getPossibleSquaresByColor(emptySquares, color);
        const requiredSquares: Array<Square> = [];

        // Проходимся циклом по ячейкам с фигурами
        for (let i = 0; i < possibleSquaresForMoving.length; i++) {
            const availableSquare: Square = possibleSquaresForMoving[i];
            // Пройдемся по пустым ячейкам
            for (let j = 0; j < emptySquares.length; j++) {
                const target: Square = emptySquares[j];
                const index: number = requiredSquares.findIndex(
                    (square: Square) => square.x === availableSquare.x && square.y === availableSquare.y
                );
                // Проверим, что фигура должна прыгать и то что этой ячейке нет в массиве
                if (availableSquare?.figure?.mustJump(target) && index === -1) {
                    requiredSquares.push(availableSquare);
                }
            }
        }

        return requiredSquares.length ? requiredSquares : possibleSquaresForMoving;
    }

    private _unHighlightPieces(): void {
        const darkSquares: Square[][] = this._getDarkSquares();
        for (let i = 0; i < darkSquares.length; i++) {
            const row: Square[] = darkSquares[i];
            for (let j = 0; j < row.length; j++) {
                const square: Square = row[j];
                square.availableForMoving = false;
                square.highlighted = false;
            }
        }
    }

    private _addLostFigure(figure: Figure): void {
        figure?.color === Colors.BLACK ? 
            this.lostBlackPieces.push(figure) 
        : 
            this.lostWhitePieces.push(figure);
    }
}
