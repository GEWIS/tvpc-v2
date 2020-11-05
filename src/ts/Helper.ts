export function delay(ms: number) {
  return new Promise( (resolve) => setTimeout(resolve, ms) );
}

export async function doXMLHttpRequest(location: string, token: string | undefined): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', location, true);

    if (token) {
      xhr.setRequestHeader('X-Auth-Token', token);
    }

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
