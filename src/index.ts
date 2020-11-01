import SettingsHandler from './ts/SettingsHandler.js';
import Carousel from './ts/Carousel.js';

async function init() {
  await SettingsHandler.initialize();
  const clock = document.getElementById('tvpc-time');
  const carousel = Carousel.getInstance();
  clock.onclick = () => {
    carousel.drawPoster();
  };
  console.log('READY!');
}

init();
