import ImagePoster from './ImagePoster.js';
import {doXMLHttpRequest} from '../Helper.js';

export default class PhotoPoster extends ImagePoster {
  private galleries: string[];

  public constructor(timeout: number, galleries: string[]) {
    super('Photo', timeout, undefined, 'full', undefined);
    this.galleries = galleries;
  }

  private async requestImage(albumId: string): Promise<string> {
    return await doXMLHttpRequest(`https://gewis.nl/api/photo/album/${albumId}`);
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
