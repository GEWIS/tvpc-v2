import Settings from './entities/Settings';
import { doXMLHttpRequest } from './Helper';
import LayoutHandler from './LayoutHandler';

export class SettingsHandler {
  private static _settings: Settings;
  private static initialized = false;
  private static layoutHandler: LayoutHandler;

  private static currentScreenEffect = '';

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

    return parsedSettings as Settings;
  }

  private static async updateSettings(): Promise<Settings> {
    const settings = await doXMLHttpRequest('api/settings', 'json', true) as Settings;

    if (settings.screenEffect != this.currentScreenEffect) {
      if (settings.screenEffect === 'snow') {
        this.layoutHandler.enableSnow();
      } else {
        this.layoutHandler.removeScreenEffects();
      }
      this.currentScreenEffect = settings.screenEffect;
    }

    console.log(settings);
    return settings;
  }

  /*
  Right now, the initialize() and checkForUpdate() functions do basically the same.
  However, these functions have been split to allow for easy adapting for future
  functionality
   */

  /**
   * Initialize this SettingsHandler class. This function can only be called once, because
   * it also sets the initialized and lastUpdate variables. When the settings need to be
   * updated, use the checkForUpdate() function.
   * @param {LayoutHandler} layoutHandler
   */
  public static async initialize(layoutHandler: LayoutHandler): Promise<void> {
    if (!this.initialized) {
      this.layoutHandler = layoutHandler;
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
