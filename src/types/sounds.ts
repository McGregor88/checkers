import selectTick from '../assets/sounds/select-tick.wav';
import switchSound from '../assets/sounds/switch-sound.wav';
import jump from '../assets/sounds/jump.wav';
import victory from '../assets/sounds/jingle-win.wav';

export enum SoundNames {
    JUMP = "jump",
    SELECT_TICK = "selectTick",
    SWITCH = "switchSound",
    VICTORY = "victory",
}

interface ISounds {
    [SoundNames.JUMP]: string;
    [SoundNames.SELECT_TICK]: string;
    [SoundNames.SWITCH]: string;
    [SoundNames.VICTORY]: string;
    [index: string]: string;
}

export const sounds: ISounds = {
    [SoundNames.JUMP]: jump,
    [SoundNames.SELECT_TICK]: selectTick,
    [SoundNames.SWITCH]: switchSound,
    [SoundNames.VICTORY]: victory
}