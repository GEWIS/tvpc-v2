import axios from 'axios'

import {_settings} from './SettingsHandler';

interface WebTimeObj {
  date: string;
  timezone_type: number;
  timezone: string;
}

export interface Activity {
  id: number;
  name: string;
  nameEn: string;
  beginTime: WebTimeObj;
  endTime: WebTimeObj;
  subscriptionDeadline?: WebTimeObj;
  location: string;
  locationEn: string;
  costs: string;
  costsEn: string;
  description: string;
  descriptionEn: string;
  canSignUp: boolean;
  isFood: boolean;
  isMyFuture: boolean;
}

export interface ActivityFull extends Activity {
  displaySubscribedNumber: boolean;
  fields: string[];
  requireGEFLITST: boolean;
  attendees: string[];
  LocationEn: string;
}

export async function getPhoto(posterId: number): Promise<object> {
  const config = {
    headers: {
      'X-Auth-Token': process.env.GEWIS_KEY,
    }
  }

  return new Promise(async (resolve, reject) => {
    const result = {label: '', sourceUrl: ''};

    const poster = _settings.posters[posterId];
    if (poster.type !== 'photo') {
      reject('Given slide number is not a photo poster')
    }

    const albumId = poster.source[Math.floor(Math.random() * poster.source.length)];
    const returnObj = (await axios.get(`https://gewis.nl/api/photo/album/${albumId}`, config)).data;

    result.label = returnObj.album.name;
    const nrOfPhotos = returnObj.photos.length;
    const photo = returnObj.photos[Math.floor(Math.random() * nrOfPhotos)];
    result.sourceUrl = '/data/' + photo.path;

    resolve(result);
  });
}

export async function getActivities(posterId: number): Promise<Activity[]> {
  const config = {
    headers: {
      'X-Auth-Token': process.env.GEWIS_KEY,
    }
  }

  return new Promise(async (resolve, reject) => {
    const poster = _settings.posters[posterId];
    if (poster.type !== 'agenda') {
      reject('Given slide number is not an agenda poster')
    }

    const fullActivities: ActivityFull[] = (await axios.get('https://gewis.nl/api/activity/list', config)).data;
    const activities: Activity[] = fullActivities.filter((a) => a.isFood === false)
      .map((a) => ({
        id: a.id,
        name: a.name,
        nameEn: a.nameEn,
        beginTime: a.beginTime,
        endTime: a.endTime,
        subscriptionDeadline: a.subscriptionDeadline,
        location: a.location,
        locationEn: a.LocationEn,
        costs: a.costs,
        costsEn: a.costsEn,
        description: a.description,
        descriptionEn: a.descriptionEn,
        canSignUp: a.canSignUp,
        isMyFuture: a.isMyFuture,
        isFood: a.isFood,
      }))

    resolve(activities);
  });
}

export async function getInfima(posterId: number): Promise<string> {
  const config = {
    headers: {
      'X-Auth-Token': process.env.GEWIS_KEY,
    }
  }

  return new Promise(async (resolve, reject) => {
    const poster = _settings.posters[posterId];
    if (poster.type !== 'infima') {
      reject('Given slide number is not an infima poster')
    }

    // TODO: Implement new infima API endpoint
    reject('There is currently no functioning infima API. If you want to help fix this, contact the Supremum committee :)')
  });
}
