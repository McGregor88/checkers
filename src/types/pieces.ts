import { Square } from "../models/Square";

export enum FigureNames {
    FIGURE = "Фигура",
    CHECKER = "Шашка"
}
export interface IPieces {
    enemyPieces: Square[] | [];
    friendlyPieces: Square[] | [];
}
