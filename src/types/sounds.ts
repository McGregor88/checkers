import selectTick from '../assets/sounds/select-tick.wav';
import switchSound from '../assets/sounds/switch-sound.wav';
import jump from '../assets/sounds/jump.wav';
import victory from '../assets/sounds/jingle-win.wav';

export type SoundUrl = string;

export enum SoundNames {
    JUMP = "jump",
    SELECT_TICK = "selectTick",
    SWITCH = "switchSound",
    VICTORY = "victory",
}

export interface ISounds {
    [SoundNames.JUMP]: SoundUrl;
    [SoundNames.SELECT_TICK]: SoundUrl;
    [SoundNames.SWITCH]: SoundUrl;
    [SoundNames.VICTORY]: SoundUrl;
    [index: string]: SoundUrl;
}

export const sounds: ISounds = {
    [SoundNames.JUMP]: jump,
    [SoundNames.SELECT_TICK]: selectTick,
    [SoundNames.SWITCH]: switchSound,
    [SoundNames.VICTORY]: victory
}
