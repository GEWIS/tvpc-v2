import Clicker from './ts/Clicker.js';

const clock = document.getElementById('tvpc-time');
const click = new Clicker('Hello world!');
clock.onclick = () => {
  click.print();
};
