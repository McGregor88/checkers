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

    public highlightPieces(color: Colors): void {
        this._unHighlightPieces();
        if (!color) return;
        this._getAvailableSquaresWithPieces(color).forEach((el: Square) => el.availableForMoving = true);
    }

    public getEmptySquares(): Square[] {
        return _.filter(this._getDarkSquares().flat(), (square: Square) => square.isEmpty());
    }

    public getLostEnemyPieces(playerColor: Colors | undefined): Figure[] | [] {
        if (!playerColor) return [];
        return playerColor === Colors.WHITE ? this.lostBlackPieces : this.lostWhitePieces;
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

    public hasRequiredSquares(squares: Square[], target: Square | null): boolean {
        return squares.findIndex((square: Square) => target?.figure?.mustJump(square)) !== -1;
    }

    public highlightSquares(selectedSquare: Square | null): void {
        const figure: Figure | null = selectedSquare?.figure || null;
        const emptySquares: Square[] = this.getEmptySquares();
        const hasRequiredSquares: boolean = this.hasRequiredSquares(emptySquares, selectedSquare);
    
        for (let i = 0; i < emptySquares.length; i++) {
            const target: Square = emptySquares[i];
            const availableForSelection: boolean = hasRequiredSquares ? 
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

    private _getDarkSquares(): Square[][] {
        const darkSquares: Square[][] = [];
        for (let i = 0; i < this.squares.length; i++) {
            const row: Square[] = _.filter(this.squares[i], (square: Square) => square.color === Colors.BLACK);
            darkSquares.push(row);
        }
        return darkSquares;
    }

    private _getAvailableSquaresWithPieces(color: Colors): Square[] {
        const me: Board = this;
        const emptySquares: Square[] = me.getEmptySquares();
        const squaresWithPieces: Square[] = me._getSquaresWithPiecesByColor(color);
        const requiredSquares: Square[] | [] = me._getRequiredSquaresForJump(squaresWithPieces, emptySquares);
        return requiredSquares.length ? requiredSquares : me._getSquaresForMovement(squaresWithPieces, emptySquares);
    }

    private _getSquaresWithPiecesByColor(color: Colors): Square[] {
        return _.filter(this._getDarkSquares().flat(), (square: Square) => square?.figure?.color === color);
    }

    private _getRequiredSquaresForJump(squaresWithPieces: Square[], targets: Square[]): Square[] | [] {
        return _.filter(squaresWithPieces, (square: Square) => this.hasRequiredSquares(targets, square));
    }

    private _getSquaresForMovement(squaresWithPieces: Square[], targets: Square[]): Square[] {
        const availableSquares: Square[] = [];
        for (let i = 0; i < squaresWithPieces.length; i++) {
            const item: Square = squaresWithPieces[i];
            for (let j = 0; j < targets.length; j++) {
                const target: Square = targets[j];
                const index: number = _.findIndex(availableSquares, (el: Square) => el.isEqualTo(item));

                if (!item.availableForMoving && item?.figure?.canMove(target) && index === -1) {
                    availableSquares.push(item);
                }
            }
        }
        
        return availableSquares;
    }

    private _addLostFigure(figure: Figure): void {
        figure?.color === Colors.BLACK ? 
            this.lostBlackPieces.push(figure) 
        : 
            this.lostWhitePieces.push(figure);
    }
}
