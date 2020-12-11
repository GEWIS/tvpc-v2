export const baseUrl = 'https://tvpc.gewis.nl/';

export function delay(ms: number) {
  return new Promise( (resolve) => setTimeout(resolve, ms) );
}

export async function doXMLHttpRequest(location: string, responseType: XMLHttpRequestResponseType,
    useBaseUrl: boolean = false): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let url;
    if (useBaseUrl) {
      url = baseUrl + location;
    } else {
      url = location;
    }

    xhr.open('GET', url);
    xhr.responseType = responseType;

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


export function parseTimeToString(time: Date) {
  let hours: string;
  let minutes: string;
  if (time.getHours() < 10) {
    hours = '0' + time.getHours().toString();
  } else {
    hours = time.getHours().toString();
  }
  if (time.getMinutes() < 10) {
    minutes = '0' + time.getMinutes().toString();
  } else {
    minutes = time.getMinutes().toString();
  }
  return hours + ':' + minutes;
}
