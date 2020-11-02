import Settings from './entities/Settings.js';

export class SettingsHandler {
  private static _localSettingsFile = './settings.txt'
  private static _vvzSettingsFile = 'https://gewis.nl/~vvz/tvpc/settings.txt';
  private static _settings: Settings;

  static get settings(): Settings {
    return this._settings;
  }

  /**
   * Function to perform a GET request on a file
   * @param {string} location - HTTP(s) location of the file
   * @return {string} the unparsed contents of the TXT file
   * @return {Error} something went wrong with getting the file
   */
  private static async getTXTFileContents(location: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', location);

      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`${this.status}: ${this.statusText}`));
        }
      };

      xhr.onerror = function() {
        reject(new Error(`${this.status}: ${this.statusText}`));
      };

      xhr.send();
    });
  }

  /**
   * Parse the settings string from the input file
   * @param {string} settingsString - The string that has been pulled from the TXT files
   * @return {Settings} - Settings object which contains the settings
   */
  private static parseSettings(settingsString: string): Settings {
    const parsedSettings = JSON.parse(settingsString);
    // TODO: Fix backend so it returns posters instead of pages
    if (!parsedSettings.posters) {
      Object.defineProperty(parsedSettings, 'posters',
          Object.getOwnPropertyDescriptor(parsedSettings, 'pages'));
      delete parsedSettings['pages'];
    }

    // TODO: Remove posters whose due dates have passed
    return parsedSettings as Settings;
  }

  /**
   * Initialize this SettingsHandler class, to actually save the settings
   */
  public static async initialize(): Promise<void> {
    let settingsString: string;
    // try {
    // settingsString = await this.getTXTFileContents(this._vvzSettingsFile);
    // } catch (error) {
    settingsString = await this.getTXTFileContents(this._localSettingsFile);
    // }
    this._settings = this.parseSettings(settingsString);
  }
}

export default SettingsHandler;
