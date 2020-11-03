import BasePoster from './BasePoster.js';

export default class Infima extends BasePoster {
  public constructor(timeout: number) {
    super('Infima', timeout, 'Infima', 'full');
  };

  private getInfima(): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './src/php/infima.php');

      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(`${this.status}: ${this.statusText}`));
        }
      };

      xhr.onerror = function() {
        reject(new Error(`${this.status}: ${this.statusText}`));
      };

      xhr.send();
    });
  }

  public async draw(contentBox: HTMLElement): Promise<void> {
    let result = '';

    try {
      const query = await this.getInfima();
      const text = JSON.parse(query);
      const parts = text.split('"');

      if (parts.length <= 1) {
        result = text;
      } else {
        let i = 0;
        while (i < parts.length - 1) {
          result += `<span class="infima-speaker">${parts[i]}</span><br>`;
          if (i + 1 < parts.length - 1) {
            result += `<span class="infima-quote">"${parts[i + 1]}"</span><br>`;
          }
          i += 2;
        }
      }
    // If somehow something fails, return just an empty string
    } catch (error) {
      result = '';
    }

    contentBox.innerHTML = `
      <article class="infima">
        <div class="container">
          <div class="vertical-line vertical-center">
            ${result}
          </div>
        </div>
      </article>`;
  }
}
