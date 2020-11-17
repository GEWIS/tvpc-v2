import Settings from './entities/Settings.js';
import {doXMLHttpRequest} from './Helper.js';

export class SettingsHandler {
  private static _settings: Settings;
  private static initialized = false;

  static get settings(): Settings {
    return this._settings;
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

  private static async updateSettings(): Promise<Settings> {
    const settingsString = await doXMLHttpRequest('api/settings', true);
    const settings = this.parseSettings(settingsString);
    console.log(settings);
    return settings;
  }

  /*
  Right now, the initialize() and checkForUpdate() functions do basically the same.
  However, for future reference these functions have been split to allow for easy
  adapting for future functionality
   */

  /**
   * Initialize this SettingsHandler class. This function can only be called once, because
   * it also sets the initialized and lastUpdate variables. When the settings need to be
   * updated, use the checkForUpdate() function.
   */
  public static async initialize(): Promise<void> {
    if (!this.initialized) {
      this._settings = await this.updateSettings();
      this.initialized = true;
    } else {
      throw new Error('Settings have already been initialized');
    }
  }

  /**
   * If enough time has passed, get the most current settings object from the backend
   */
  public static async checkForUpdate(): Promise<void> {
    if (!this.initialized) {
      throw new Error('Please initialize the SettingsHandler first');
    }

    this._settings = await this.updateSettings();
  }
}

export default SettingsHandler;
