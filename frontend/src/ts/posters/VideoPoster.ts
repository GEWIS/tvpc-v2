import {doXMLHttpRequest} from '../Helper.js';
import BasePoster from './BasePoster.js';

export default class VideoPoster extends BasePoster {
  private readonly sourceUrls: string[];
  private videoBlob: Blob;
  private shouldUseBaseUrl = false;

  public constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal',
      sourceUrls: string[], baseUrl = true) {
    super(name, timeout, label, footer);
    this.sourceUrls = sourceUrls;
    this.shouldUseBaseUrl = baseUrl;
  }

  async preLoad(): Promise<void> {
    // Choose a random poster from the list of posters.
    // Of course, there could be only one poster in the list. Then the choice is easy
    const chosenPoster = this.sourceUrls[Math.floor(Math.random() * this.sourceUrls.length)];

    console.log('send GET request for video blob');
    this.videoBlob = await doXMLHttpRequest(chosenPoster, 'blob', true);
    console.log(this.videoBlob);
  }

  draw(contentBox: HTMLElement): void {
    // Create a URL for the video
    const urlCreator = window.URL || window.webkitURL;
    const videoUrl = urlCreator.createObjectURL(this.videoBlob);

    // Add the HTML code
    contentBox.innerHTML = `
    <article class="tvpc-video">
        <video id="tvpc-video-${this.name}" muted loop width="100%" height="100%">
            <source src="${videoUrl}" type="video/mp4">
        </video>
    </article>`;

    // Start the video
    const video = <HTMLVideoElement>document.getElementById(`tvpc-video-${this.name}`);
    video.play();
  }
}
