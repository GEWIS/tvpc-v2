import ImagePoster from './ImagePoster.js';
import {SettingsHandler as sh} from '../SettingsHandler.js';

export default class PhotoPoster extends ImagePoster {
  private galleries: string[];

  public constructor(timeout: number, galleries: string[]) {
    super('Photo', timeout, undefined, 'full', undefined);
    this.galleries = galleries;
  }

  private async requestImage(albumId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://gewis.nl/api/photo/album/${albumId}`, true);
      xhr.setRequestHeader('X-Auth-Token', sh.settings.token);

      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`${this.status}: ${this.statusText}`));
        }
      };

      xhr.onerror = function() {
        reject(new Error(`${this.status}: ${this.statusText}`));
      };

      xhr.send();
    });
  }

  public async preLoad(): Promise<void> {
    const albumId = this.galleries[Math.floor(Math.random() * this.galleries.length)];
    const json = await this.requestImage(albumId);
    const result = JSON.parse(json);

    this.label = result.album.name;
    const nrOfPhotos = result.photos.length;
    const photo = result.photos[Math.floor(Math.random() * nrOfPhotos)];
    this.sourceUrl = '/data/' + photo.path;

    super.preLoad();
  }

  /*
   * Function draw() is inherited from ImagePoster
   */
}
