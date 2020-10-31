import Carousel from './ts/Carousel.js';

const clock = document.getElementById('tvpc-time');
const carousel = Carousel.getInstance();
clock.onclick = () => {
  carousel.drawPoster();
};
