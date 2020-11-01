export default class Poster {
  /** The name of the poster */
  name: string;

  /** The label that needs to be shown underneath the poster */
  label: string;

  /** The type of poster */
  type: 'infima' | 'image' | 'logo';

  /** The date at which the poster has to be pulled from the screens */
  due: Date | undefined;

  /** How long this poster should be shown on screen */
  timeout: number;

  /** If the poster is an image or video, the source of this visual */
  source: string | undefined;
}
