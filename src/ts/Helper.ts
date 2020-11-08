const baseUrl = 'http://localhost:3000';

export function delay(ms: number) {
  return new Promise( (resolve) => setTimeout(resolve, ms) );
}

export async function doXMLHttpRequest(location: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    console.log(location);
    xhr.open('GET', location);

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
