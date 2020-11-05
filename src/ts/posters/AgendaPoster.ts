import BasePoster from './BasePoster.js';
import {SettingsHandler as sh} from '../SettingsHandler.js';
import {doXMLHttpRequest} from '../Helper';

export default class AgendaPoster extends BasePoster {
  public constructor(timeout: number) {
    super('Agenda', timeout, 'Upcoming activities', 'full');
  }

  private async requestActivities(): Promise<string> {
    return await doXMLHttpRequest('https://gewis.nl/api/activity/list', sh.settings.token);
  }

  public async preLoad(): Promise<void> {
    const rawActivities = await this.requestActivities();
    console.log(rawActivities);
  }

  public draw(contentBox: HTMLElement): void {

  }
}
