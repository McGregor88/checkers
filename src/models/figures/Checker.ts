import blackFigure from '../../assets/figures/checker_black.png';
import whiteFigure from '../../assets/figures/checker_white.png';

import { Colors } from '../../types/colors';
import { IPieces } from '../../types/pieces';
import { FigureNames } from '../../types/pieces';
import { Figure } from './Figure';
import { Board } from '../Board';
import { Square } from '../Square';

export class Checker extends Figure {
    private readonly _maxStep: number;

    constructor(board: Board, color: Colors, square: Square) {
        super(board, color, square);
        this.board = board;
        this.logo = color === Colors.WHITE ? whiteFigure : blackFigure;
        this.name = FigureNames.CHECKER;
        this._maxStep = 2;
    }

    /**
     * Determines if the checker must perform a jump move to the target square.
     * This method first checks if a jump is possible using the base class logic,
     * then delegates to specific logic for dame (king) or regular checker pieces.
     *
     * @param target - The square to which the checker might jump.
     * @returns {boolean} True if the checker must jump to the target square, false otherwise.
     */
    public mustJump(target: Square): boolean {
        if (!super.mustJump(target)) return false;
        return this.isDame ? this._mustJumpAsDame(target) : this._mustJumpAsChecker(target);
    }

    /**
     * Determines if the checker can move to the specified target square.
     * This method first checks if the move is valid using the base class logic,
     * then delegates to specific logic for dame (king) or regular checker pieces.
     *
     * @param target - The square to which the checker might move.
     * @returns {boolean} True if the checker can move to the target square, false otherwise.
     */
    public canMove(target: Square): boolean {
        if (!super.canMove(target)) return false;
        return this.isDame ? this._canMoveAsDame(target) : this._canMoveAsChecker(target);
    }

    /**
     * Determines if the dame checker must perform a jump move to the target square.
     *
     * @param target - The square to which the dame checker might jump.
     * @returns {boolean} True if the dame checker must jump to the target square, false otherwise.
     *          The method checks if there is exactly one enemy piece and no friendly pieces
     *          between the current square and the target square.
     */
    private _mustJumpAsDame(target: Square): boolean {
        const pieces: IPieces | undefined = this.board?.getPiecesDiagonally(this.square, target, this.color);
        if (pieces && pieces.enemyPieces.length === 1 && !pieces.friendlyPieces.length) {
            return true;
        }
        return false;
    }

    /**
     * Determines if the dame checker can move to the specified target square.
     * 
     * @param target - The square to which the dame checker might move.
     * @returns {boolean} A boolean indicating whether the dame can move to the target square.
     *          Returns true if there are no friendly pieces and at most one enemy piece
     *          in the path to the target square. Returns false otherwise, or if the board
     *          or pieces information is unavailable.
     */
    private _canMoveAsDame(target: Square): boolean {
        const pieces: IPieces | undefined = this.board?.getPiecesDiagonally(this.square, target, this.color);
        if (!pieces || pieces.friendlyPieces.length || pieces.enemyPieces.length > 1) {
            return false;
        }
        return true;
    }

    /**
     * Determines if a regular checker must perform a jump move to the target square.
     * 
     * @param target - The square to which the checker might jump.
     * @returns {boolean} A boolean indicating whether the checker must jump to the target square.
     *          Returns true if there is an enemy piece in the nearest square towards the target
     *          and the target is within the maximum allowed step distance.
     *          Returns false if the target is too far or if there's no enemy piece to jump over.
     */
    private _mustJumpAsChecker(target: Square): boolean {
        const nearestSquares: Square[] | [] = this.board?.getNearestSquares(this.square, target, 1) || [];
        if (this.square.isTooFar(target, this._maxStep)) return false;

        const nearestSquare: Square | undefined = nearestSquares[0];
        if (
            nearestSquare && 
            !nearestSquare.isEqualTo(target) &&
            nearestSquare.hasEnemyPiece(this.color)
        ) {
            return true;
        }
        return false;
    }

    /**
     * Determines if a regular checker can move to the specified target square.
     * 
     * @param target - The square to which the checker might move.
     * @returns {boolean} A boolean indicating whether the checker can move to the target square.
     *          Returns false if:
     *          - The target is too far (beyond the maximum step).
     *          - The move is a jump, but the nearest square is empty or contains a friendly piece.
     *          - The move is a single step, but in the wrong direction based on the checker's color.
     *          Returns true if none of the above conditions are met.
     */
    private _canMoveAsChecker(target: Square): boolean {
        const { y } = this.square;
        if (this.square.isTooFar(target, this._maxStep)) return false;

        if (target.y + this._maxStep === y || target.y - this._maxStep === y) {
            const nearestSquare: Square | undefined = this.board?.getNearestSquares(this.square, target, 1)[0];
            if (nearestSquare?.isEmpty() || nearestSquare?.figure?.color === this.color) {
                return false;
            }
        }

        if (target.y + 1 === y || target.y - 1 === y) {
            if (
                (this.color === Colors.WHITE && target.y > y) || 
                (this.color === Colors.BLACK && target.y < y)
            ) {
                return false;
            }
        }
        return true;
    }
}
