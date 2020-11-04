import BasePoster from './BasePoster.js';

export default class LogoPoster extends BasePoster {
  public constructor(timeout: number) {
    super('LogoPoster', timeout, '', 'full');
  }

  preLoad(): void {}

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article>
        <img class="logo center" src="./src/img/Full_Logo_Colour.png">
    </article>
    `;
  }
}
