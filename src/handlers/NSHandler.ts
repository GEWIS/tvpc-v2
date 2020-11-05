import axios from 'axios'

export async function getTrains(): Promise<object> {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.NS_KEY,
      }
    }

    return axios.get('https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=EHV&maxJourneys=40', config)
      .then(response => { resolve(response.data) })
      .catch(error => { reject(error.status) });
  });
}
