import { Colors } from '../types/colors';

export class Player {
    readonly color: Colors;

    constructor(color: Colors) {
        this.color = color;
    }
}
