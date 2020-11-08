import {parseTimeToString} from './Helper.js';

export default class Clock {
  private clock: HTMLElement;
  private loop: number;

  /**
   * Create a Clock object
   * @param {HTMLElement} clockElement - HTML Element where the clock should be put in
   */
  public constructor(clockElement: HTMLElement) {
    this.clock = clockElement;
  }

  /**
   * Start the clock in the clock object
   */
  public startClock() {
    this.updateClock();
  }

  /**
   * Stop the clock in the clock object
   */
  public stopClock() {
    clearTimeout(this.loop);
  }

  /**
   * Update the clock element. Loops itself every 500ms
   */
  private updateClock() {
    const today = new Date();

    this.clock.innerHTML = parseTimeToString(today);
    this.loop = setTimeout(this.updateClock.bind(this), 500);
  }
}
