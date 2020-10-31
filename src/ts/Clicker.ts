export default class Clicker {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  print(): void {
    console.log(this.name);
  }
}
