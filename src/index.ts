import SettingsHandler from './ts/SettingsHandler.js';
import Carousel from './ts/Carousel.js';
import InfoBar from './ts/InfoBar.js';
import Clock from './ts/Clock.js';

async function init() {
  await SettingsHandler.initialize();
  const clockElement = document.getElementById('tvpc-time');
  const infoBar = InfoBar.getInstance();
  const clock = new Clock(clockElement);
  clock.startClock();
  const carousel = Carousel.getInstance(infoBar);
  clockElement.onclick = () => {
    carousel.drawPoster();
  };
  console.log('READY!');
}

init();
