import { Square } from "../models/Square";

export interface IPieces {
    enemyPieces: Square[] | [];
    friendlyPieces: Square[] | [];
}
