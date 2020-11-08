import BasePoster from './BasePoster.js';
import {doXMLHttpRequest} from '../Helper.js';

export default class AgendaPoster extends BasePoster {
  public constructor(timeout: number) {
    super('Agenda', timeout, 'Upcoming activities', 'full');
  }

  private async requestActivities(): Promise<string> {
    return await doXMLHttpRequest('/api/activity');
  }

  public async preLoad(): Promise<void> {
    // const rawActivities = await this.requestActivities();
    // console.log(rawActivities);
  }

  public draw(contentBox: HTMLElement): void {

  }
}
