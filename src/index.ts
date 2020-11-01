import SettingsHandler from './ts/SettingsHandler.js';
import Carousel from './ts/Carousel.js';
import InfoBar from './ts/InfoBar.js';

async function init() {
  await SettingsHandler.initialize();
  const clock = document.getElementById('tvpc-time');
  const infoBar = InfoBar.getInstance();
  const carousel = Carousel.getInstance(infoBar);
  clock.onclick = () => {
    carousel.drawPoster();
  };
  console.log('READY!');
}

init();
