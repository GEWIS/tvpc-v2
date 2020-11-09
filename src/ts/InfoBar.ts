import {delay} from './Helper.js';

export default class InfoBar {
  private static instance: InfoBar;

  private infoBar: HTMLElement;
  private progressBar: HTMLElement;
  private currentSize: 'full' | 'minimal';

  private constructor() {
    this.infoBar = document.getElementById('tvpc-bottom-bar');
    // The top progress bar is drawn by default (while the bottom is not), so we select it here by default
    this.progressBar = document.getElementById('tvpc-progress-bar-top-inner');
  }

  public static getInstance() {
    if (!InfoBar.instance) {
      InfoBar.instance = new InfoBar();
    }
    return InfoBar.instance;
  }

  /**
   * Switch the progress bar to a different size layout
   * @param {string} action - The current action that is happening with the progress bar (starting or stopping)
   * @param {string} newSize - The size of the upcoming poster
   */
  private async switchProgressBar(action: 'start' | 'stop', newSize: 'full' | 'minimal'): Promise<void> {
    if (this.currentSize != newSize) {
      switch (newSize) {
        case 'full':
          if (action === 'start') {
            document.getElementById('tvpc-bottom-bar').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            document.getElementById('tvpc-gewis-logo').style.visibility = '';
            document.getElementById('tvpc-explanation').style.visibility = '';
            this.progressBar = document.getElementById('tvpc-progress-bar-top-inner');
            this.currentSize = 'full';
            await delay(20);
          }
          break;

        case 'minimal':
          if (action === 'stop') {
            document.getElementById('tvpc-bottom-bar').style.backgroundColor = '';
            document.getElementById('tvpc-gewis-logo').style.visibility = 'hidden';
            document.getElementById('tvpc-explanation').style.visibility = 'hidden';
            this.progressBar = document.getElementById('tvpc-progress-bar-bottom-inner');
            this.currentSize = 'minimal';
            await delay(20);
          }
          break;
      }
    }
  }

  /**
   * Reset the progress bar, not depending on the current progression of the transition.
   * Not dependent on whether the bar is located on top of bottom
   * @param {string} newSize - The size of the footer with the upcoming poster
   */
  public async resetProgressBar(newSize: 'full' | 'minimal'): Promise<void> {
    const bars = document.getElementsByClassName('tvpc-progress-bar-inner') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < bars.length; i++) {
      bars[i].style.transition = '';
      bars[i].style.transform = 'translateX(-100%)';
      // Give the browser some time to adjust
    }
    await delay(20);

    await this.switchProgressBar('stop', newSize);
  }

  /**
   * Start the progess bar, either the bottom or the top one, depending on which one is currently drawn.
   * @param {number} time - Time in seconds how long the progress bar should take to complete
   * @param {string} newSize - The size of the footer with the upcoming poster
   */
  public async startProgressBar(time: number, newSize: 'full' | 'minimal'): Promise<void> {
    await this.switchProgressBar('start', newSize);

    this.progressBar.style.transition = `transform ${time}s cubic-bezier(0.2, 0, 0.8, 1)`;
    this.progressBar.style.transform = 'translateX(0)';
  }
}
