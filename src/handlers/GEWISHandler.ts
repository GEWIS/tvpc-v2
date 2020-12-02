import axios from 'axios'

import {_settings} from './SettingsHandler';

export async function getPhoto(posterId: number): Promise<object> {
  const config = {
    headers: {
      'X-Auth-Token': process.env.GEWIS_KEY,
    }
  }

  return new Promise(async (resolve, reject) => {
    let result = {label: '', sourceUrl: ''};

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
