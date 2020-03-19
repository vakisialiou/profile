import LoadingItems from './LoadingItems'
import { AudioLoader } from 'three'

export default class LoadingAudio extends LoadingItems {
  constructor() {
    super(AudioLoader)

  }

  /**
   *
   * @param {string} name
   * @returns {AudioBuffer|?|
   */
  getAudioBuffer(name) {
    return this.getItem(name)
  }
}