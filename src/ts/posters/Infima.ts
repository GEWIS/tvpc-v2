import BasePoster from './BasePoster.js';

export default class Infima extends BasePoster {
  public constructor(timeout: number) {
    super('Infima', timeout, 'Infima', 'full');
  };

  public draw(contentBox: HTMLElement): void {
    const infimum = 'This is a test';
    contentBox.innerHTML = `
      <article class="infima">
        <div class="container">
          <div class="vertical-line vertical-center">
            ${infimum}
          </div>
        </div>
      </article>`;
  }
}
