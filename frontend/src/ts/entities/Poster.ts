import {PosterTypes} from './PosterTypes';

export default class Poster {
  /** The name of the poster */
  name: string;

  /** The label that needs to be shown underneath the poster */
  label: string;

  /** The type of poster */
  type: PosterTypes;

  /** How long this poster should be shown on screen */
  timeout: number;

  /** Whether the footer should contain the logo and label (full) or not (minimal) */
  footer: 'full' | 'minimal';

  /** If the poster is an image or video, the source of this visual */
  source: string[];
}


