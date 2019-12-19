import {MovieDetailsModel} from './movie-details.model';

export interface MoviesModel {
  moviesResult: Array<MovieDetailsModel>;
  moviesCount: number;
  moviesTotalPages: number;
}
