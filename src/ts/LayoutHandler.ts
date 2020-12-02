import InfoBar from './InfoBar.js';

export default class LayoutHandler {
  private static instance: LayoutHandler;

  private infoBar: InfoBar;

  private constructor() {
  }

  public static getInstance() {
    if (!LayoutHandler.instance) {
      LayoutHandler.instance = new LayoutHandler();
    }
    return LayoutHandler.instance;
  }

  public init(infoBar: InfoBar) {
    this.infoBar = infoBar;
  }

  /**
   * Enable a snow screen effect by adding div elements and adding the css class to the HTML document
   */
  public enableSnow(): void {
    const screenEffects = document.getElementById('screen-effects');
    screenEffects.innerHTML = '';
    for (let i = 0; i < 200; i++) {
      screenEffects.innerHTML += `<div class="snow"></div>`;
    }

    const cssFile = <HTMLLinkElement> document.getElementById('screen-effects-css');
    cssFile.href = 'src/css/snow.css';
  }

  /**
   * Remove all screen effects
   */
  public removeScreenEffects(): void {
    // Empty the screen-effects div element
    const screenEffects = document.getElementById('screen-effects');
    screenEffects.innerHTML = '';

    // Remove the link to the loaded css file
    const cssFile = <HTMLLinkElement> document.getElementById('screen-effects-css');
    cssFile.href = '';
  }
}
