import blackFigure from '../../assets/figures/checker_black.png';
import whiteFigure from '../../assets/figures/checker_white.png';

import { toABS } from '../../lib/utils';
import { Colors } from '../../types/colors';
import { IPieces } from '../../types/pieces';
import { FigureNames } from '../../types/figureNames';
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

    public mustJump(target: Square): boolean {
        if (!super.mustJump(target)) return false;
        return this.isDame ? this._mustJumpAsDame(target) : this._mustJumpAsChecker(target);
    }

    public canMove(target: Square): boolean {
        if (!super.canMove(target)) return false;
        return this.isDame ? this._canMoveAsDame(target) : this._canMoveAsChecker(target);
    }

    private _mustJumpAsDame(target: Square): boolean {
        const pieces: IPieces | undefined = this.board?.getPiecesDiagonally(this.square, target, this.color);
        if (!pieces) return false;

        if (pieces.enemyPieces.length === 1 && !pieces.friendlyPieces.length) {
            return true;
        } else {
            return false;
        }
    }

    private _canMoveAsDame(target: Square): boolean {
        const pieces: IPieces | undefined = this.board?.getPiecesDiagonally(this.square, target, this.color);
        if (!pieces) return false;

        if (pieces.friendlyPieces.length || pieces.enemyPieces.length > 1) return false;
        return true;
    }

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