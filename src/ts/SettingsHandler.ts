import Settings from './entities/Settings.js';
import {doXMLHttpRequest} from './Helper.js';

export class SettingsHandler {
  private static _localSettingsFile = './settings.txt'
  private static _vvzSettingsFile = 'https://gewis.nl/~vvz/tvpc/settings.txt';
  private static _tokenFile = './api-token.txt'
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
    return await doXMLHttpRequest(location, undefined);
  }

  /**
   * Parse the settings string from the input file
   * @param {string} settingsString - The string that has been pulled from the TXT files
   * @param {string} apiToken - The API token read from the token file
   * @return {Settings} - Settings object which contains the settings
   */
  private static parseSettings(settingsString: string, apiToken: string): Settings {
    const parsedSettings = JSON.parse(settingsString);
    parsedSettings.token = apiToken;
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
    const apiToken = await this.getTXTFileContents(this._tokenFile);
    this._settings = this.parseSettings(settingsString, apiToken);
  }
}

export default SettingsHandler;
