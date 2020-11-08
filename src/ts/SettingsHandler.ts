import Settings from './entities/Settings.js';
import {doXMLHttpRequest} from './Helper.js';

export class SettingsHandler {
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
    return await doXMLHttpRequest(location);
  }

  /**
   * Parse the settings string from the input file
   * @param {string} settingsString - The string that has been pulled from the TXT files
   * @return {Settings} - Settings object which contains the settings
   */
  private static parseSettings(settingsString: string): Settings {
    const parsedSettings = JSON.parse(settingsString);

    // TODO: Remove posters whose due dates have passed
    return parsedSettings as Settings;
  }

  /**
   * Initialize this SettingsHandler class, to actually save the settings
   */
  public static async initialize(): Promise<void> {
    const settingsString = await this.getTXTFileContents('http://localhost:3000/api/settings');
    this._settings = this.parseSettings(settingsString);
    console.log(this._settings);
  }
}

export default SettingsHandler;
