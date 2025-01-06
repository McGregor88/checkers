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

    /**
     * Retrieves the list of lost enemy pieces for a given player color.
     * 
     * @param playerColor - The color of the player. Should be a value from the Colors enum or undefined.
     * @returns {Figure[]} An array of Figure objects representing the lost enemy pieces. 
     *          Returns an empty array if playerColor is undefined.
     */
    public getLostEnemyPieces(playerColor: Colors | undefined): Figure[] | [] {
        if (!playerColor) return [];
        return playerColor === Colors.WHITE ? this.lostBlackPieces : this.lostWhitePieces;
    }

    /**
     * Calculates and returns the nearest squares between two given squares on the board.
     * 
     * @param from - The starting Square object.
     * @param target - The target Square object.
     * @param absX - The absolute difference in x-coordinates between the starting and target squares.
     * @returns {Square[]} An array of Square objects representing the nearest squares between the starting and target squares.
     */
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

    /**
     * Retrieves pieces diagonally between two squares, categorized as enemy and friendly pieces.
     * 
     * @param item - The starting Square object.
     * @param target - The target Square object.
     * @param color - The color of the current player's pieces.
     * @returns {IPieces} An object of type IPieces containing arrays of enemy and friendly pieces found diagonally between the two squares.
     */
    public getPiecesDiagonally(item: Square, target: Square, color: Colors): IPieces {
        const nearestSquares: Square[] = this.getNearestSquares(item, target, toABS(target.x, item.x));
        return {
            enemyPieces: nearestSquares.filter((el: Square) => el?.figure && el.figure.color !== color),
            friendlyPieces: nearestSquares.filter((el: Square) => el?.figure && el.figure.color === color)
        };
    }

    /**
     * Checks if there are any squares that require a jump move for the given target.
     * 
     * @param squares - An array of Square objects to check.
     * @param target - The target Square object, which may contain a figure that must jump.
     * @returns {boolean} A boolean indicating whether there are any squares that require a jump move.
     */
    public hasRequiredSquares(squares: Square[], target: Square | null): boolean {
        return squares.findIndex((el: Square) => target?.figure?.mustJump(el)) !== -1;
    }

    /**
     * Highlights available squares for movement based on the selected square and game rules.
     * 
     * @param selectedEl - The currently selected Square object, or null if no square is selected.
     */
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

    /**
     * Removes the figure from the given square.
     * 
     * @param square - The Square object from which to remove the figure.
     */
    public removeFigureFromSquare(square: Square): void {
        square.figure = null;
    }

    /**
     * Captures an enemy piece by adding it to the list of lost figures and removing it from its square.
     * 
     * @param figure - The Figure object to be captured, or null if no figure is to be captured.
     */
    public captureEnemyPiece(figure: Figure | null): void {
        if (!figure) return;
        this._addLostFigure(figure);
        this.removeFigureFromSquare(figure.square);
    }

    /**
     * Checks if a figure should be promoted to a dame and updates its status accordingly.
     * 
     * @param figure - The Figure object to check for promotion.
     */
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

    /**
     * Sets up the initial checker pieces on the game board.
     * 
     * This method initializes the game by placing the checker pieces in their starting positions.
     * It creates black and white checkers alternately on the dark squares of the first three rows
     * for each player. The method uses the board's dimensions and calculates the appropriate
     * positions for each checker piece.
     * 
     * @remarks
     * This is a private method and should only be called internally by the Board class.
     * 
     * @returns {void} This method does not return a value, but modifies the board state
     * by adding Checker objects to the appropriate squares.
     */
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

    /**
     * Retrieves a specific Square object from the board based on its coordinates.
     * 
     * @param x - The x-coordinate (column) of the desired square on the board.
     * @param y - The y-coordinate (row) of the desired square on the board.
     * @returns {Square} The Square object at the specified coordinates.
     */
    private _getSquare(x: number, y: number): Square {
        return this.squares[y][x];
    }

    /**
     * Removes highlighting from all dark squares on the board.
     * 
     * This method iterates through all dark squares on the board and sets their
     * 'availableWithFigure' and 'highlighted' properties to false. This is typically
     * used to clear any previous highlighting before applying new highlights.
     */
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

    /**
     * Retrieves all dark squares from the game board.
     * 
     * This method filters through the board's squares and collects all squares
     * that have a black color, organizing them into a 2D array where each inner
     * array represents a row of dark squares.
     * 
     * @returns {Square[][]} A 2D array of Square objects, where each inner array
     *                       contains the dark squares from a single row of the board.
     */
    private _getDarkSquares(): Square[][] {
        const darkSquares: Square[][] = [];
        for (let i = 0; i < this.squares.length; i++) {
            const row: Square[] = _.filter(this.squares[i], (square: Square) => square.color === Colors.BLACK);
            darkSquares.push(row);
        }
        return darkSquares;
    }

    /**
     * Retrieves available squares with pieces of a specified color that can make a move.
     * 
     * This method first checks for any required jump moves. If there are required jumps,
     * it returns those squares. Otherwise, it returns squares with pieces that can make
     * regular moves.
     *
     * @param color - The color of the pieces to check for available moves.
     * @returns {Square[]} An array of Square objects representing available squares with pieces
     *          that can make a move. If there are required jumps, only those squares
     *          are returned; otherwise, all squares with possible moves are returned.
     */
    private _getAvailableSquaresWithPieces(color: Colors): Square[] {
        const me: Board = this;
        const emptySquares: Square[] = me.getEmptySquares();
        const squaresWithPieces: Square[] = me._getSquaresWithPiecesByColor(color);
        const requiredSquares: Square[] | [] = me._getRequiredSquaresForJump(squaresWithPieces, emptySquares);
    
        return requiredSquares.length ? requiredSquares : me._getSquaresForMovement(squaresWithPieces, emptySquares);
    }

    /**
     * Retrieves all squares containing pieces of a specified color.
     * 
     * @param color - The color of the pieces to search for (from the Colors enum).
     * @returns {Square[]} An array of Square objects that contain pieces of the specified color.
     */
    private _getSquaresWithPiecesByColor(color: Colors): Square[] {
        return _.filter(this._getDarkSquares().flat(), (square: Square) => square?.figure?.color === color);
    }

    /**
     * Identifies squares with pieces that are required to make a jump move.
     * 
     * @param squaresWithPieces - An array of Square objects that contain pieces.
     * @param targets - An array of Square objects representing potential target squares.
     * @returns An array of Square objects with pieces that must make a jump move,
     *          or an empty array if no jumps are required.
     */
    private _getRequiredSquaresForJump(squaresWithPieces: Square[], targets: Square[]): Square[] | [] {
        return _.filter(squaresWithPieces, (square: Square) => this.hasRequiredSquares(targets, square));
    }

    /**
     * Identifies squares with pieces that can make a valid move.
     * 
     * This method iterates through squares containing pieces and potential target squares,
     * checking for valid moves. It returns an array of unique squares that have pieces
     * capable of making a move.
     *
     * @param squaresWithPieces - An array of Square objects containing pieces to check for possible moves.
     * @param targets - An array of Square objects representing potential target squares for moves.
     * @returns {Square[]} An array of Square objects representing squares with pieces that can make a valid move.
     */
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

    /**
     * Adds a captured figure to the appropriate list of lost pieces.
     * 
     * This method determines the color of the captured figure and adds it to either
     * the list of lost black pieces or lost white pieces accordingly.
     *
     * @param figure - The Figure object representing the captured piece to be added to the lost pieces list.
     */
    private _addLostFigure(figure: Figure): void {
        figure?.color === Colors.BLACK ? 
            this.lostBlackPieces.push(figure) 
        : 
            this.lostWhitePieces.push(figure);
    }
}
