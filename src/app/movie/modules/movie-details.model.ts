export interface MovieDetailsModel {
  id: number;
  name?: string;
  title?: string;
  genre_ids: Array<number>;
  type: string;
  release_date?: Date;
  first_air_date?: Date;
  poster_path: string;
  genres?: string;
}
