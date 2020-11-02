import {delay} from './Helper.js';

export default class InfoBar {
  private static instance: InfoBar;

  private infoBar: HTMLElement;

  private constructor() {
    this.infoBar = document.getElementById('tvpc-bottom-bar');
  }

  public static getInstance() {
    if (!InfoBar.instance) {
      InfoBar.instance = new InfoBar();
    }
    return InfoBar.instance;
  }

  /**
   * Reset the progress bar, not depending on the current progression of the transition.
   * Not dependent on whether the bar is located on top of bottom
   */
  public async resetProgressBar(): Promise<void> {
    const progressBar = document.getElementById('tvpc-progress-bar-inner');
    progressBar.style.transition = '';
    // Give the browser some time to adjust
    await delay(20);
    progressBar.style.transform = 'translateX(-100%)';
    // Give the browser some time to adjust
    await delay(20);
  }

  /**
   * Start the progess bar, either the bottom or the top one, depending on which one is currently drawn.
   * @param {number} time - Time in seconds how long the progress bar should take to complete
   */
  public async startProgressBar(time: number): Promise<void> {
    const progressBar = document.getElementById('tvpc-progress-bar-inner');
    progressBar.style.transition = `transform ${time}s ease`;
    progressBar.style.transform = 'translateX(0)';
  }
}
