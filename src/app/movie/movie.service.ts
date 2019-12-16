import { Injectable } from '@angular/core';
import {Observable, Subject, Subscription} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { MovieEndpointModel } from './modules/movie-endpoint.model';
import { MovieDetailsModel } from './modules/movie-details.model';
import { GenreModel } from './modules/genre.model';
import { MovieExtendedDetailsModel } from './modules/movie-extended-details.model';
import { MoviesModel } from './modules/movies.model';

const API_URL = `${environment.apiUrl}`;
const API_KEY = `${environment.apiKey}`;
const API_LANG = `${environment.apiLanguage}`;
const IMG_PATH = `${environment.imgAbsolutePath}`;
const IMDB_LINK = `${environment.imdbLink}`;

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: MoviesModel;
  private title: string;
  private moviesUpdated = new Subject<MoviesModel>();
  private genres: {id: number, name: string}[] = [];

  constructor(private http: HttpClient) { }

  getMoviesUpdateListener(): Observable<{
    results: Array<MovieDetailsModel>,
    count: number,
    total_pages: number,
    page: number,
    clear: boolean
  }> {
    return this.moviesUpdated.asObservable();
  }

  getMovies(title: string): Subscription {
    return this.http.get<MovieEndpointModel>(
      `${API_URL}${environment.searchMoviesEndpoint}?api_key=${API_KEY}&language=${API_LANG}&query=${title}`,
    ).pipe(
      map(moviesData => {
        return {
          results: moviesData.results.map( (movies: MovieDetailsModel) => {
            // if poster value undefined or null then add a placeholder img.
            const posterPath = !movies.poster_path ? '/assets/images/placeholder-300x450.png' : `${IMG_PATH}${movies.poster_path}`;
            const movieTitle = !movies.title ? movies.name : movies.title;
            const movieData = !movies.release_date ? movies.first_air_date : movies.release_date;

            return {
              id: movies.id,
              title: movieTitle,
              media_type: movies.media_type,
              genre_ids: movies.genre_ids,
              release_date: movieData,
              poster_path: posterPath
            };
          }),
          count: moviesData.total_results,
          total_pages: moviesData.total_pages,
          page: moviesData.page
        };
      })
    ).subscribe(transformedMoviesData => {
        this.title = title;

        this.movies = {
          results: [...transformedMoviesData.results],
          count: transformedMoviesData.count,
          total_pages: transformedMoviesData.total_pages,
          page: transformedMoviesData.page,
          clear: false,
       };

        this.moviesUpdated.next(this.movies);
    });
  }

  clearMovies(): void {
    this.moviesUpdated.next({
      results: [],
      count: null,
      total_pages: null,
      page: null,
      clear: true,
    });
  }

  getMovieGenres(): Subscription {
      return this.http.get<GenreModel>(`${API_URL}genre/movie/list?api_key=${API_KEY}`)
        .subscribe(genres => {
          this.genres = genres.genres;
        });
  }

  getMovieGenreNames(genreIds: Array<number>): string {
    let movieGenres = '';

    if (!genreIds) {
      return;
    }

    if (genreIds.length > 0) {
      genreIds.forEach(genreId => {
        const index = this.genres.map(genre => genre.id)
          .indexOf(genreId);

        if (index >= 0) {
          movieGenres += `${this.genres[index].name}, `;
        }
      });
    }

    return movieGenres;
  }

  getMovieDetails(id: number, mediaType: string): Observable<MovieExtendedDetailsModel> {
    return this.http.get(`${API_URL}${mediaType}/${id}?api_key=${API_KEY}&language=${API_LANG}`)
      .pipe(
        map((extendedMovieDetails: MovieExtendedDetailsModel) => {
          const posterPath = !extendedMovieDetails.poster_path ?
            '/assets/images/placeholder-300x450.png' : `${IMG_PATH}${extendedMovieDetails.poster_path}`;

          if (mediaType === 'movie') {
            return {
              poster_path: posterPath,
              original_title: extendedMovieDetails.original_title,
              overview: extendedMovieDetails.overview,
              genres: extendedMovieDetails.genres,
              release_date: extendedMovieDetails.release_date,
              tagline: extendedMovieDetails.tagline,
              imdb_id: extendedMovieDetails.imdb_id,
              imdb_link: `${IMDB_LINK}${extendedMovieDetails.imdb_id}`,
              runtime: extendedMovieDetails.runtime,
              production_countries: extendedMovieDetails.production_countries,
              spoken_languages: extendedMovieDetails.spoken_languages
            };
          } else {
            return {
              poster_path: posterPath,
              name: extendedMovieDetails.name,
              overview: extendedMovieDetails.overview,
              genres: extendedMovieDetails.genres,
              first_air_date: extendedMovieDetails.first_air_date,
              tagline: extendedMovieDetails.tagline,
              imdb_id: extendedMovieDetails.imdb_id,
              imdb_link: `${IMDB_LINK}${extendedMovieDetails.imdb_id}`,
              episode_run_time: extendedMovieDetails.episode_run_time,
              origin_country: extendedMovieDetails.origin_country,
              languages: extendedMovieDetails.languages
            };
          }
        })
      );
  }

  getStoredTitle() {
    return this.title;
  }

  getStoredMovies() {
      return this.movies;
  }
}
