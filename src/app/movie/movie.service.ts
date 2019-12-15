import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { MovieEndpointModel } from './modules/movie-endpoint.model';
import { MovieDetailsModel } from './modules/movie-details.model';

const API_URL = `${environment.apiUrl}`;
const API_KEY = `${environment.apiKey}`;
const API_LANG = `${environment.apiLanguage}`;
const IMG_PATH = `${environment.imgAbsolutePath}`;

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUpdated = new Subject<{results: Array<MovieDetailsModel>, count: number}>();

  constructor(private http: HttpClient) { }

  getMovies(title: string) {
    return this.http.get<MovieEndpointModel>(
      `${API_URL}${environment.searchMoviesEndpoint}?api_key=${API_KEY}&language=${API_LANG}&query=${title}`,
    ).pipe(
      map(moviesData => {
        return {
          results: moviesData.results.map( (movies: MovieDetailsModel) => {
            // if poster value undefined or null then add a placeholder img.
            const posterPath = !movies.poster_path ? '/assets/images/placeholder-300x450.png' : `${IMG_PATH}${movies.poster_path}`;
            const placeholderTitle = !movies.title ? '---' : movies.title;

            return {
              id: movies.id,
              title: placeholderTitle,
              genre_ids: movies.genre_ids,
              release_date: movies.release_date,
              poster_path: posterPath
            };
          }),
          count: moviesData.total_results};
      })
    ).subscribe(transformedMoviesData => {
       this.moviesUpdated.next({
         results: [...transformedMoviesData.results],
         count: transformedMoviesData.count
       });
    });
  }

  getMoviesUpdateListener() {
    return this.moviesUpdated.asObservable();
  }
}
