import {MovieDetailsModel} from "./movie-details.model";

export interface TvModel {
  tvsResult: Array<MovieDetailsModel>;
  tvsCount: number;
  tvsTotalPages: number;
}
