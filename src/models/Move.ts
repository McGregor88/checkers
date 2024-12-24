import { v4 as uuidv4 } from 'uuid';
import { ICoordinates } from "../types/coordinates";
import { Player } from './Player';

export class Move {
    readonly id: string;
    readonly from: ICoordinates;
    readonly to: ICoordinates;
    readonly player: Player | null;

    constructor(player: Player, from: ICoordinates, to: ICoordinates) {
        this.id = uuidv4();
        this.player = player;
        this.from = from;
        this.to = to;
    }
};