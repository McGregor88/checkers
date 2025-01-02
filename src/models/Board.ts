import _ from 'lodash';
import { toABS } from '../lib/utils';
import { Colors } from '../types/colors';
import { IPieces } from '../types/pieces';
import { Square } from './Square';
import { Figure } from './figures/Figure';
import { Checker } from './figures/Checker';

export class Board {
    private readonly _maxSquaresInRow: number = 8;
    private readonly lostBlackPieces: Figure[] = [];
    private readonly lostWhitePieces: Figure[] = [];
    readonly squares: Square[][] = [];

    /**
     * Initializes the game board by creating a 2D array of Square objects.
     * 
     * This method populates the `squares` property of the Board class with a grid of Square objects.
     * Each Square is assigned a color (black or white) based on its position on the board,
     * following the standard checkerboard pattern.
     * 
     * The board size is determined by the `_maxSquaresInRow` property, typically set to 8 for a standard checkers board.
     * 
     * @returns {void} This method does not return a value, but modifies the `squares` property of the class.
     */
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

    /**
     * Sets up the initial pieces on the game board.
     * 
     * This method initializes the game by placing the checker pieces in their starting positions.
     * It calls the private method `_setUpCheckers()` to handle the actual placement of the pieces.
     * 
     * @returns {void} This method does not return a value, but modifies the board state.
     */
    public setUpPieces(): void { 
        this._setUpCheckers();
    }

    /**
     * Creates and returns a shallow copy of the current board.
     * 
     * This method uses Lodash's clone function to create a new Board object
     * that is a shallow copy of the current instance. This can be useful
     * for creating temporary board states or for undo/redo functionality.
     * 
     * @returns {Board} A new Board object that is a shallow copy of the current board.
     */
    public getCopyBoard(): Board { 
        return _.clone(this);
    }

    /**
     * Highlights pieces of a specific color on the board.
     * 
     * This method first removes any existing highlights, then highlights
     * all available squares that contain pieces of the specified color.
     * If no color is provided, the method will simply unhighlight all pieces.
     * 
     * @param color - The color of the pieces to highlight. Should be a value from the Colors enum.
     * @returns {void} This method does not return a value, but modifies the board state.
     */
    public highlightPieces(color: Colors): void {
        this._unHighlightPieces();
        if (!color) return;
        this._getAvailableSquaresWithPieces(color).forEach((el: Square) => el.availableWithFigure = true);
    }

    /**
     * Retrieves all empty squares on the dark squares of the board.
     * 
     * This method filters through all the dark squares on the board and returns
     * an array of Square objects that are currently empty (i.e., not occupied by any piece).
     * 
     * @returns {Square[]} An array of Square objects representing all empty dark squares on the board.
     */
    public getEmptySquares(): Square[] {
        return _.filter(this._getDarkSquares().flat(), (el: Square) => el.isEmpty());
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

    public getPiecesDiagonally(item: Square, target: Square, color: Colors): IPieces {
        const nearestSquares: Square[] = this.getNearestSquares(item, target, toABS(target.x, item.x));
        return {
            enemyPieces: nearestSquares.filter((el: Square) => el?.figure && el.figure.color !== color),
            friendlyPieces: nearestSquares.filter((el: Square) => el?.figure && el.figure.color === color)
        };
    }

    public hasRequiredSquares(squares: Square[], target: Square | null): boolean {
        return squares.findIndex((el: Square) => target?.figure?.mustJump(el)) !== -1;
    }

    public highlightSquares(selectedEl: Square | null): void {
        const me: Board = this;
        const figure: Figure | null = selectedEl?.figure || null;
        const emptySquares: Square[] = me.getEmptySquares();
        const hasRequiredSquares: boolean = me.hasRequiredSquares(emptySquares, selectedEl);
    
        for (let i = 0; i < emptySquares.length; i++) {
            const target: Square = emptySquares[i];
            const availableForMovement: boolean = hasRequiredSquares ? 
                !!figure?.mustJump(target) 
            : 
                !!figure?.canMove(target);

            target.availableForMovement = availableForMovement;

            if (hasRequiredSquares && availableForMovement && selectedEl && figure) {
                const nearestSquares: Square[] | [] = me.getNearestSquares(
                    selectedEl, 
                    target, 
                    figure.isDame ? toABS(target.x, selectedEl.x) : 1
                ) || [];
                const targetsToHighlight: Square[] | [] = _.filter(
                    nearestSquares, 
                    (el: Square) => el.isEmpty() && !figure?.mustJump(el) && figure?.canMove(el)
                );

                targetsToHighlight.forEach((target: Square) => {
                    if (!target.highlighted) target.highlighted = true;
                });
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
                square.availableWithFigure = false;
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

                if (!item.availableWithFigure && item?.figure?.canMove(target) && index === -1) {
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
