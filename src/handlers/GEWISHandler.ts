import axios from 'axios'

const config = {
  headers: {
    'X-Auth-Token': process.env.GEWIS_KEY,
  }
}

export async function getPhoto(): Promise<object> {
  return new Promise((resolve, reject) => {
    axios.get('https://gewis.nl/api/photo/album')
  });
}
