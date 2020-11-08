import axios from 'axios'

export async function getTrains(): Promise<object> {
  return new Promise(async resolve => {
    const config = {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.NS_KEY,
      }
    }

    const departures = (await axios.get('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures' +
      '?station=EHV&maxJourneys=40', config)).data.payload.departures;
    let result = [];

    for (let i = 0; i < departures.length; i++) {
      let delay: number = 0;
      if (departures[i].plannedDateTime !== departures[i].actualDateTime) {
        // @ts-ignore
        delay = (new Date(departures[i].actualDateTime) - new Date(departures[i].plannedDateTime)).getMinutes();
      }

      let routeStations: string[] = [];
      for (let j = 0; j < departures[i].routeStations.length; j++) {
        routeStations.push(departures[i].routeStations[j].mediumName)
      }

      result.push({
        direction: departures[i].direction,
        plannedDateTime: departures[i].plannedDateTime,
        delay: delay,
        trainType: departures[i].product.categoryCode,
        operator: departures[i].product.operatorCode,
        cancelled: departures[i].cancelled,
        routeStations: routeStations,
        messages: departures[i].messages
      })
    }

    resolve(result);
  });
}
