export interface MovieExtendedDetailsModel {
  poster_path: string;
  original_title?: string;
  name?: string;
  overview: string;
  genres: Array<{id: number; name: string}>;
  release_date?: Date;
  first_air_date?: Date;
  tagline: string;
  imdb_id: string;
  imdb_link?: string;
  runtime?: number;
  episode_run_time?: Array<number>;
  production_countries?: Array<{iso_3166_1?: string; name: string}>;
  spoken_languages?: Array<{iso_639_1?: string, name: string}>;
  origin_country?: Array<string>;
  languages?: Array<string>;
}
