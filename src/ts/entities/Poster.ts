export default class Poster {
  /** The name of the poster */
  name: string;

  /** The label that needs to be shown underneath the poster */
  label: string;

  /** The type of poster */
  type: 'infima' | 'image' | 'logo' | 'external' | 'poster';

  /** The date at which the poster has to be pulled from the screens */
  due: Date | undefined;

  /** How long this poster should be shown on screen */
  timeout: number;

  /** Whether the footer should contain the logo and label (full) or not (minimal) */
  footer: 'full' | 'minimal';

  /** If the poster is an image or video, the source of this visual */
  source: string | undefined;

  /** LEGACY format, only here for backwards compatibility */
  posters: string[] | undefined;
}
