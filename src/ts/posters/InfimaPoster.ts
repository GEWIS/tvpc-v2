import BasePoster from './BasePoster.js';

export default class InfimaPoster extends BasePoster {
  private parsedInfima: string;

  public constructor(timeout: number) {
    super('InfimaPoster', timeout, 'InfimaPoster', 'full');
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

  async preLoad(): Promise<void> {
    this.parsedInfima = '';

    try {
      const query = await this.getInfima();
      const text = JSON.parse(query);
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
