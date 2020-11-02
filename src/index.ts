import SettingsHandler from './ts/SettingsHandler.js';
import Carousel from './ts/Carousel.js';
import InfoBar from './ts/InfoBar.js';
import Clock from './ts/Clock.js';

async function init() {
  const contentElement = document.getElementById('tvpc-content');
  const clockElement = document.getElementById('tvpc-time');

  await SettingsHandler.initialize();
  const infoBar = InfoBar.getInstance();
  const clock = new Clock(clockElement);
  clock.startClock();
  const carousel = Carousel.getInstance(infoBar, contentElement);
  carousel.drawPoster();
  clockElement.onclick = () => {
    carousel.forceNextPoster();
  };
  console.log('READY!');
}

init();
