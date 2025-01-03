import { ISounds, SoundUrl, SoundNames } from "../types/sounds";

export class AudioPlayer {
    private _sounds = new Map<SoundNames, HTMLAudioElement>();

    constructor(sounds: ISounds) {
        for (const [key, value] of Object.entries(sounds)) {
            this._addSound(key as SoundNames, value);
        }
    }

    /**
     * Plays the specified sound.
     *
     * @param soundName - The name of the sound to play.
     *
     * @remarks
     * This function retrieves the audio element associated with the given sound name,
     * checks if it's currently playing, and either plays it from the start or reloads it.
     */
    public play(soundName: SoundNames): void {
        const audio: HTMLAudioElement | undefined = this._getAudioByName(soundName);
        if (!audio) return;

        if (!audio.paused) {
            audio.load();
        }

        audio.play();
    }

    /**
     * Adds a new sound to the internal sound collection.
     *
     * @param soundName - The name of the sound to be added. This serves as a key for later retrieval.
     * @param url - The URL or path to the audio file.
     *
     * @remarks
     * This method creates a new Audio object with the provided URL and associates it with the given sound name.
     * The sound is then stored in the internal Map for future use.
     */
    private _addSound(soundName: SoundNames, url: SoundUrl): void {
        this._sounds.set(soundName, new Audio(url));
    }

    /**
     * Retrieves the audio element associated with the specified sound name.
     *
     * @param name - The name of the sound to retrieve.
     * @returns {HTMLAudioElement} The HTMLAudioElement associated with the given sound name, or undefined if not found.
     */
    private _getAudioByName(name: SoundNames): HTMLAudioElement | undefined {
        return this._sounds.get(name);
    }
}
