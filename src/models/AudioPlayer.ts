import { SoundNames } from "../types/soundNames";

export class AudioPlayer {
    private _sounds = new Map();

    constructor(sounds: any) {
        for (const name in sounds) {
            this._addSound(name, sounds[name]);
        }
    }

    public play(soundName: SoundNames): void {
        const audio = this._getAudioByName(soundName);
        if (!soundName || !audio) return;

        if (!audio.paused) {
            audio.reload();
        }
        audio.play();
    }

    private _addSound(soundName: SoundNames | string, soundSrc: string): void {
        this._sounds.set(soundName, new Audio(soundSrc));
    }

    private _getAudioByName(name: string) {
        return this._sounds.get(name);
    }
}