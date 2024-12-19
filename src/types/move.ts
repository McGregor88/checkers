import { Player } from "../models/Player";

interface ICoordinates {
    x: number;
    y: number;
}

export interface IMove {
    id: string;
    player: Player | null;
    from: ICoordinates;
    to: ICoordinates;
}