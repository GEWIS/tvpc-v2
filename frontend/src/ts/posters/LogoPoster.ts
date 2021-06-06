import BasePoster from './BasePoster';

export default class LogoPoster extends BasePoster {
  public constructor(timeout: number) {
    super('LogoPoster', timeout, '', 'full');
  }

  preLoad(): void {
    // do nothing.
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
    <article>
        <img class="logo center" src="./resources/img/Full_Logo_Colour.png">
    </article>
    `;
  }
}
