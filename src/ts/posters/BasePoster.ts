export default abstract class BasePoster {
  name: string;

  /** The number of seconds that this poster should be shown */
  timeout: number;

  /** The label that should be shown in the footer, if the footer is set to 'full' */
  label: string;

  /** Whether the full footer should be shown, or only a minimal one */
  footer: 'full' | 'minimal';

  abstract draw(contentBox: HTMLElement): void;

  protected constructor(name: string, timeout: number, label: string, footer: 'full' | 'minimal') {
    this.name = name;
    this.timeout = timeout;
    this.label = label;
    this.footer = footer;
  }
}
