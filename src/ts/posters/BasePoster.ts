export default abstract class BasePoster {
  /** The number of seconds that this poster should be shown */
  timeout: number;

  /** The label that should be shown in the footer, if the footer is set to 'full' */
  label: string;

  /** Whether the full footer should be shown, or only a minimal one */
  footer: 'full' | 'minimal';

  abstract draw(contentBox: HTMLElement): void;
}
