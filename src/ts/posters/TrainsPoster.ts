import BasePoster from './BasePoster.js';
import {doXMLHttpRequest, parseTimeToString} from '../Helper.js';
import {DepartureMessage, Train} from '../entities/Train.js';

export default class TrainsPoster extends BasePoster {
  private departures: Train[] = [];
  constructor(timeout: number) {
    super('Train Departures', timeout, 'Train departures', 'full');
  }

  private async requestDepartures(): Promise<string> {
    return await doXMLHttpRequest('api/trains', true);
  }

  private parseStations(stations: string[]): string {
    // If there are no stations, return an empty string
    if (stations.length === 0) {
      return '';
    }

    // Start with the first station
    let result = `via ${stations[0]}`;
    // For all following stations...
    for (let i = 1; i < stations.length; i++) {
      // If this is the final station, finish with "and"
      if (i + 1 === stations.length) {
        result += ` and ${stations[i]}`;
      // Do a comma otherwise
      } else {
        result += `, ${stations[i]}`;
      }
    }

    return result;
  }

  async preLoad(): Promise<void> {
    const rawDepartures = await this.requestDepartures();
    this.departures = JSON.parse(rawDepartures) as Train[];

    // The datetime JSON is not automatically parsed, so this has to be done manually.
    // If we do it now, it saves us time during drawing
    for (let i = 0; i < this.departures.length; i++) {
      this.departures[i].plannedDateTime = new Date(this.departures[i].plannedDateTime);
    }
  }

  draw(contentBox: HTMLElement): void {
    // Get the date rounded to minutes. We use this to calculate the time between now and departure
    const now = new Date(Math.round(new Date().getTime() / 60000 ) * 60000);

    // The first piece of HTML code, which includes the animation.
    const pre = `
      <article class="tvpc-ns">
        <table style="
          animation-name: tvpc-ns-scroll; 
          animation-delay: 3s; 
          animation-iteration-count: infinite; 
          animation-timing-function: linear;
          animation-duration: ${Math.max(this.departures.length, this.timeout - 2)}s;">
          <tbody>
            <tr>
              <td colspan="4" class="tvpc-ns-header">
                <img src="./src/img/train.svg">
                Departures from Eindhoven Centraal
                <img src="./src/img/train.svg" style="transform: scaleX(-1);"> 
              </td>
            </tr>`;

    // Some variables that we use during the printing of the HTML code
    let inner = '';
    let departTime: string;
    let relativeDepartTime: number;
    // For each departure..
    this.departures.forEach((dep: Train) => {
      // Rewrite the departure Date object to a time string
      departTime = parseTimeToString(dep.plannedDateTime);
      // Calculate the amount of minutes between train departure and now
      relativeDepartTime = (dep.plannedDateTime.valueOf() - now.valueOf()) / 60000 + dep.delay;

      // Print a very nice table row with all information about this train
      inner += `
      <tr class="${dep.cancelled ? 'tvpc-ns-cancelled' : '' }">
        <td class="tvpc-ns-departure"><div>${departTime}<div></td>
        <td class="tvpc-ns-delay"><div>${dep.delay === 0 ? '' : '+' + dep.delay.toString()}</div></td>
        <td class="tvpc-ns-relative-time"><div>(in ${relativeDepartTime}m)</div></td>
        <td class="tvpc-ns-destination"><div>
          <div class="tvpc-ns-direction">${dep.direction}</div>
          <div class="tvpc-ns-info"><img src="./src/img/${dep.operator}.svg" alt="${dep.operator}"
          > <i>${dep.trainType}</i> ${this.parseStations(dep.routeStations)}`;
      // Here is a very nice intermezzo for the messages that are provided by the NS
      dep.messages.forEach((messageObj: DepartureMessage) => {
        // If we have the message "Rijdt niet", the train is cancelled so we translate this manually
        if (messageObj.message === 'Rijdt niet') {
          inner += '<br><span style="color: red">CANCELLED</span>';
        // Otherwise, just add the message to the HTML
        } else if (messageObj.message.startsWith('Rijdt niet')) {
          inner += `<br><span style="color: red">CANCELLED</span>: ${messageObj.message}`;
        } else {
          inner += `<br>${messageObj.message}`;
        }
      });
      // End this row of the table with its closing tags
      inner += `
            </div>
          </div>
        </td>
      </tr>`;
    });

    // We have to end the table as well
    const post = `
          </tbody>
        </table>
      </article>
    `;

    // Print it to the HTML code!
    contentBox.innerHTML = pre + inner + post;
  }
}
