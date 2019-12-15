export interface MovieDetailsModel {
  id: number;
  title: string;
  genre_ids: Array<number>;
  release_date: Date;
  poster_path: string;
}
