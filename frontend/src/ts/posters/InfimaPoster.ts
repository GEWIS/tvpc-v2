import BasePoster from './BasePoster.js';
import {doXMLHttpRequest} from '../Helper.js';

export default class InfimaPoster extends BasePoster {
  private readonly posterNr: number;
  private parsedInfima: string;

  public constructor(timeout: number, posterNr: number) {
    super('InfimaPoster', timeout, '', 'full');
    this.posterNr = posterNr;
  }

  async preLoad(): Promise<void> {
    this.parsedInfima = '';

    try {
      const text = await doXMLHttpRequest(`api/infima?id=${this.posterNr}`, 'json', true);
      const parts = text.split('"');

      if (parts.length <= 1) {
        this.parsedInfima = text;
      } else {
        let i = 0;
        while (i < parts.length - 1) {
          this.parsedInfima += `<span class="infima-speaker">${parts[i]}</span><br>`;
          if (i + 1 < parts.length - 1) {
            this.parsedInfima += `<span class="infima-quote">"${parts[i + 1]}"</span><br>`;
          }
          i += 2;
        }
      }
      // If somehow something fails, return just an empty string
    } catch (error) {
      this.parsedInfima = '';
    }
  }

  draw(contentBox: HTMLElement): void {
    contentBox.innerHTML = `
      <article class="infima">
        <div class="container">
          <div class="vertical-line vertical-center">
            ${this.parsedInfima}
          </div>
        </div>
      </article>`;
  }
}
