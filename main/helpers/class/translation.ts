export default class Translation {
  id: number;
  name: string;
  url: string;

  constructor(
      id: number,
      name: string,
      url: string,
  ) {
      this.id = id;
      this.name = name;
      this.url = url;
  }
}
