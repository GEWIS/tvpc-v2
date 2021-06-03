import BasePoster from './BasePoster.js';
import {doXMLHttpRequest} from '../Helper.js';
import Activity from '../entities/Activity.js';

export default class AgendaPoster extends BasePoster {
  private readonly posterNr: number;
  private activities: Activity[] = [];
  private monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public constructor(timeout: number, posterNr: number) {
    super('Agenda', timeout, 'Upcoming activities', 'full');
    this.posterNr = posterNr;
  }

  public async preLoad(): Promise<void> {
    // Get the raw activities object
    const activities = await doXMLHttpRequest(`api/activities?id=${this.posterNr}`, 'json', true);

    // Loop over all activities
    for (let i = 0; i < activities.length; i++) {
      // If we have saved four activities to display, we stop the loop
      if (this.activities.length >= 4) {
        break;
      }

      // If this activity is a food list, skip this activity
      if (activities[i].isFood) {
        continue;
      }

      // Date strings are not automatically parsed, so we should do that manually
      activities[i].beginTime.date = new Date(activities[i].beginTime.date);

      this.activities.push(activities[i]);
    }
  }

  public draw(contentBox: HTMLElement): void {
    const pre = `
    <article class="agenda">
        <h1 class="title"> <i class="fas fa-calendar-day"></i> Upcoming Events</h1>
        <ul>`;

    let inner = '';
    let cancelled = false;
    for (let i = 0; i < this.activities.length; i++) {
      if (this.activities[i].nameEn.includes('[CANCELLED]') || this.activities[i].nameEn.includes('- CANCELLED')) {
        cancelled = true;
        this.activities[i].nameEn = this.activities[i].nameEn.slice(0, -11);
      } else {
        cancelled = false;
      }

      inner += `
        <li>
            <span class="fa-stack">
                    <i class="fas fa-circle fa-stack-2x"></i>
                    <span class="fa-stack-1x calendar-text">
                        <strong class="day">${this.activities[i].beginTime.date.getDate()}</strong>
                        <span class="month">${this.monthNames[this.activities[i].beginTime.date.getMonth()]}</span>
                    </span>
            </span>
                <h2 class="activity-name ${cancelled ? 'strike' : 'nostrike'}">${this.activities[i].nameEn}</h2>`;
      if (this.activities[i].isMyFuture) {
        inner += `<img class="myfuture" src="./src/img/myfuture_white.png">`;
      }
      inner += `</li>`;
    }

    const post = `
        </ul>
    </article>`;

    contentBox.innerHTML = pre + inner + post;
  }
}
