import Carousel from './ts/Carousel.js';
import SettingsHandler from './ts/SettingsHandler.js';

async function init() {
  await SettingsHandler.initialize();
}

init();

const clock = document.getElementById('tvpc-time');
const carousel = Carousel.getInstance();
clock.onclick = () => {
  carousel.drawPoster();
};
