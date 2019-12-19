import {MovieDetailsModel} from './movie-details.model';

export interface MoviesModel {
  results: Array<MovieDetailsModel>;
  count: number;
  total_pages: number;
  page: number;
  clear: boolean;
}
