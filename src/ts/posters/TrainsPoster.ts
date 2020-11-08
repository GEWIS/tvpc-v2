import BasePoster from './BasePoster.js';
import {doXMLHttpRequest, parseTimeToString} from '../Helper.js';
import {Train} from '../entities/Train.js';

export default class TrainsPoster extends BasePoster {
  private departures: Train[] = [];
  constructor(timeout: number) {
    super('Train Departures', timeout, 'Train departures', 'full');
  }

  private async requestActivities(): Promise<string> {
    return await doXMLHttpRequest('http://localhost:3000/api/trains');
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
      if (i + i === stations.length) {
        result += ` and ${stations[i]}`;
      // Do a comma otherwise
      } else {
        result += `, ${stations[i]}`;
      }
    }

    return result;
  }

  async preLoad(): Promise<void> {
    const rawDepartures = await this.requestActivities();
    this.departures = JSON.parse(rawDepartures) as Train[];

    for (let i = 0; i < this.departures.length; i++) {
      this.departures[i].plannedDateTime = new Date(this.departures[i].plannedDateTime);
    }
  }

  draw(contentBox: HTMLElement): void {
    const pre = `
      <article class="tvpc-ns">
        <table>
          <tbody>
            <tr>
              <td class="tvpc-ns-header">
                <img src="./src/img/train.svg">
                Departures from Eindhoven Centraal
                <img src="./src/img/train.svg" style="transform: scaleX(-1);"> 
              </td>
            </tr>`;

    let inner = '';
    let departTime: string;
    this.departures.forEach((dep: Train) => {
      departTime = parseTimeToString(dep.plannedDateTime);

      inner += `
      <tr>
        <td class="tvpc-ns-departure">${departTime}</td>
        <td class="tvpc-ns-delay">${dep.delay === 0 ? '' : dep.delay.toString()}</td>
        <td class="tvpc-ns-destination">
          <div class="tvpc-ns-direction">${dep.direction}</div>
          <div class="tvpc-ns-info">${dep.operator} ${dep.trainType} ${this.parseStations(dep.routeStations)}</div>`;
      dep.messages.forEach((messageObj: object) => {
        // @ts-ignore
        inner += `<br>${messageObj.message}`;
      });
      inner += `
        </td>
      </tr>`;
    });

    const post = `
          </tbody>
        </table>
      </article>
    `;

    contentBox.innerHTML = pre + inner + post;
    return;

    contentBox.innerHTML = `
    <article class="ns">
    <table class="marquee-up" style="height: 1928px;"><div class="js-marquee-wrapper" style="margin-top: 0px; animation: 32.4222s linear 1s infinite normal none running marqueeAnimation-2605894;"><div class="js-marquee" style="margin-right: 0px; float: none; margin-bottom: 50px;">
<tbody><tr><td colspan="3" style="text-align: center; font-size: 2em; background-color: #003082; color: rgba(254, 201, 23, 1); width: 100vw;">
<img src="./img/train.svg" style="height: 1em; vertical-align: text-bottom; margin-bottom: 9px;">
Departures from Eindhoven Centraal
<img src="./img/train.svg" style="height: 1em; vertical-align: text-bottom; margin-bottom: 9px; transform: scaleX(-1);">
</td></tr>             <tr>
                <td class="departure">15:17</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Roosendaal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Schiphol Airport and Rotterdam C.<br>Stopt ook in Bijlmer ArenA</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:19</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Venlo</div>
<div class="info">
Intercityvia
Helmond<br>Stopt ook in Deurne, Horst-Sevenum, Blerick</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:21</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Tilburg Universiteit</div>
<div class="info">
Sprintervia
Boxtel and Tilburg</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:27</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Amsterdam Centraal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C. and Amstel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:27</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Weert</div>
<div class="info">
Intercityvia
<br>Stopt ook in Geldrop, Heeze, Maarheeze</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:36</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Alkmaar</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Amstel and Amsterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:36</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">'s-Hertogenbosch</div>
<div class="info">
Sprintervia
Boxtel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:43</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Den Haag Centraal</div>
<div class="info">
Intercityvia
Tilburg, Breda, Dordrecht and Rotterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:47</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Roosendaal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Schiphol Airport and Rotterdam C.<br>Stopt ook in Bijlmer ArenA</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:49</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Venlo</div>
<div class="info">
Intercityvia
Helmond<br>Stopt ook in Deurne, Horst-Sevenum, Blerick</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:51</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Tilburg Universiteit</div>
<div class="info">
Sprintervia
Boxtel and Tilburg</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:57</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Amsterdam Centraal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C. and Amstel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:57</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Weert</div>
<div class="info">
Intercityvia
<br>Stopt ook in Geldrop, Heeze, Maarheeze</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:05</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Deurne</div>
<div class="info">
Sprintervia
Helmond</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:06</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Alkmaar</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Amstel and Amsterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:06</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">'s-Hertogenbosch</div>
<div class="info">
Sprintervia
Boxtel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:13</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Den Haag Centraal</div>
<div class="info">
Intercityvia
Tilburg, Breda, Dordrecht and Rotterdam C.</div>
                </td>
            </tr>
            </tbody></div><div class="js-marquee" style="margin-right: 0px; float: none; margin-bottom: 0px;">
<tbody><tr><td colspan="3" style="text-align: center; font-size: 2em; background-color: #003082; color: rgba(254, 201, 23, 1); width: 100vw;">
<img src="/~avico/stijl-tvpc/img/train.svg" style="height: 1em; vertical-align: text-bottom; margin-bottom: 9px;">
Departures from Eindhoven Centraal
<img src="/~avico/stijl-tvpc/img/train.svg" style="height: 1em; vertical-align: text-bottom; margin-bottom: 9px; transform: scaleX(-1);">
</td></tr>             <tr>
                <td class="departure">15:17</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Roosendaal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Schiphol Airport and Rotterdam C.<br>Stopt ook in Bijlmer ArenA</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:19</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Venlo</div>
<div class="info">
Intercityvia
Helmond<br>Stopt ook in Deurne, Horst-Sevenum, Blerick</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:21</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Tilburg Universiteit</div>
<div class="info">
Sprintervia
Boxtel and Tilburg</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:27</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Amsterdam Centraal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C. and Amstel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:27</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Weert</div>
<div class="info">
Intercityvia
<br>Stopt ook in Geldrop, Heeze, Maarheeze</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:36</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Alkmaar</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Amstel and Amsterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:36</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">'s-Hertogenbosch</div>
<div class="info">
Sprintervia
Boxtel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:43</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Den Haag Centraal</div>
<div class="info">
Intercityvia
Tilburg, Breda, Dordrecht and Rotterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:47</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Roosendaal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Schiphol Airport and Rotterdam C.<br>Stopt ook in Bijlmer ArenA</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:49</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Venlo</div>
<div class="info">
Intercityvia
Helmond<br>Stopt ook in Deurne, Horst-Sevenum, Blerick</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:51</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Tilburg Universiteit</div>
<div class="info">
Sprintervia
Boxtel and Tilburg</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:57</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Amsterdam Centraal</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C. and Amstel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">15:57</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Weert</div>
<div class="info">
Intercityvia
<br>Stopt ook in Geldrop, Heeze, Maarheeze</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:05</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Deurne</div>
<div class="info">
Sprintervia
Helmond</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:06</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Alkmaar</div>
<div class="info">
Intercityvia
's-Hertogenbosch, Utrecht C., Amstel and Amsterdam C.</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:06</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">'s-Hertogenbosch</div>
<div class="info">
Sprintervia
Boxtel</div>
                </td>
            </tr>
                    <tr>
                <td class="departure">16:13</td>
                <td class="delay"></td>
                <td class="destination">
                    <div class="direction">Den Haag Centraal</div>
<div class="info">
Intercityvia
Tilburg, Breda, Dordrecht and Rotterdam C.</div>
                </td>
            </tr>
            </tbody></div><style>@-webkit-keyframes marqueeAnimation-2605894  { 100%  {margin-top:-1974px}}</style></div></table>
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.marquee/1.4.0/jquery.marquee.min.js"></script>
<script>
$( "#tvpc-content" ).on("posterfadein" , function() {
setTimeout( function() {
jQuery('.marquee-up').marquee('destroy'); //Iets met een gigantisch geheugengebruik
jQuery('.marquee-up').marquee({
  duplicated: true,
  direction: "up",
  //duration: 19000,
  speed: 18, //lower value --> higher speed (according to the docs this is pixels/second)
  gap: 50,
  delayBeforeStart: 1000,
  startVisible: true,
});
}, 100);
});
</script>
</article>
    `;
  }
}
