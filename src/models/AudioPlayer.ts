import { ISounds, SoundUrl, SoundNames } from "../types/sounds";

export class AudioPlayer {
    private _sounds = new Map<SoundNames, HTMLAudioElement>();

    constructor(sounds: ISounds) {
        for (const [key, value] of Object.entries(sounds)) {
            this._addSound(key as SoundNames, value);
        }
    }

    public play(soundName: SoundNames): void {
        const audio: HTMLAudioElement | undefined = this._getAudioByName(soundName);
        if (!audio) return;

        if (!audio.paused) {
            audio.load();
        }

        audio.play();
    }

    private _addSound(soundName: SoundNames, url: SoundUrl): void {
        this._sounds.set(soundName, new Audio(url));
    }

    private _getAudioByName(name: SoundNames): HTMLAudioElement | undefined {
        return this._sounds.get(name);
    }
}