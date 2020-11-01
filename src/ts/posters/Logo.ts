import BasePoster from './BasePoster.js';

export default class Logo extends BasePoster {
  public constructor(timeout: number) {
    super('Logo', timeout, '', 'full');
  }

  public draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article>
        <img class="logo center">
    </article>
    `;
  }
}
