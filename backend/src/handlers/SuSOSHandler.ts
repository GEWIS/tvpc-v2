import axios from 'axios';

export async function borrelModeEnabled(): Promise<boolean> {
  return new Promise(async (resolve) => {
    const borrelId = (await axios.get('https://gewis.nl/susos/getcurrentborrelid.php')).data as number;
    if (borrelId >= 0) resolve(true);
    resolve(false);
  })
}
