import selectTickUrl from '../assets/sounds/select-tick.wav';
import switchSoundUrl from '../assets/sounds/switch-sound.wav';
import jumpSoundUrl from '../assets/sounds/jump.wav';
import victorySoundUrl from '../assets/sounds/jingle-win.wav';

export type SoundUrl = string;

export enum SoundNames {
    JUMP = "jump",
    SELECT = "selectTick",
    SWITCH = "switchSound",
    VICTORY = "victory",
}

export interface ISounds {
    [SoundNames.JUMP]: SoundUrl;
    [SoundNames.SELECT]: SoundUrl;
    [SoundNames.SWITCH]: SoundUrl;
    [SoundNames.VICTORY]: SoundUrl;
    [index: string]: SoundUrl;
}

export const sounds: ISounds = {
    [SoundNames.JUMP]: jumpSoundUrl,
    [SoundNames.SELECT]: selectTickUrl,
    [SoundNames.SWITCH]: switchSoundUrl,
    [SoundNames.VICTORY]: victorySoundUrl
}
