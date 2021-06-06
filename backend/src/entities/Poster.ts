export enum PosterTypes {
  agenda = 'agenda',
  infima = 'infima',
  image = 'image',
  logo = 'logo',
  external = 'external',
  poster = 'poster',
  photo = 'photo',
  video = 'video',
}

export interface Poster {
  name: string;
  label: string;
  type: PosterTypes;
  due: Date;
  timeout: number;
  footer: string;
  source: string[] | undefined;
}
