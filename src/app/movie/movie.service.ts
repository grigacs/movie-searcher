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
const API_MULTI_ENDPOINT = `${environment.searchMultiEndpoint}`;
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
  private filteredElementNumbers = 0;
  private currentPage = 1;

  constructor(private http: HttpClient) { }

  getMoviesUpdateListener(): Observable<MoviesModel> {
    return this.moviesUpdated.asObservable();
  }

  getMovies(title: string, page: number = 1): Subscription {
    return this.http.get<MovieEndpointModel>(
      `${API_URL}${API_MULTI_ENDPOINT}?api_key=${API_KEY}&language=${API_LANG}&query=${title}&page=${page}&include_adult=false`,
    ).pipe(
      map(moviesData => {
        return {
          results: moviesData.results.map( (movies: MovieDetailsModel) => {
            // if poster value undefined or null then add a placeholder img.
            const posterPath = !movies.poster_path ? '/assets/images/placeholder-300x450.png' : `${IMG_PATH}${movies.poster_path}`;
            // movie has a title, tv show has only name, check what property found and save it as a title.
            const movieTitle = !movies.title ? movies.name : movies.title;
            // movie has a release date, tv show has first air date, check what property exists and save as movie date
            const movieDate = !movies.release_date ? movies.first_air_date : movies.release_date;

            // store current we need for it when returns to list page from detail page
            this.storeCurrentPage(page);

            // return a mapped data
            return {
              id: movies.id,
              title: movieTitle,
              media_type: movies.media_type,
              genre_ids: movies.genre_ids,
              release_date: movieDate,
              poster_path: posterPath
            };
          }),
          count: moviesData.total_results,
          total_pages: moviesData.total_pages,
          page: moviesData.page
        };
      }),
    ).subscribe(transformedMoviesData => {
        // persists data
        this.title = title;
        this.filteredElementNumbers = 0;
        this.movies = {
          results: [...transformedMoviesData.results.filter(movie => {
            this.filteredElementNumbers++;
            return movie.media_type !== 'person';
          })],
          count: transformedMoviesData.count - this.filteredElementNumbers,
          total_pages: transformedMoviesData.total_pages,
          page: transformedMoviesData.page,
          clear: false,
       };

        // call next function on subject
        this.moviesUpdated.next(this.movies);
    }, error => {
      console.log(error);
    });
  }

  // clear movie data when user clear it from the search component
  clearMovies(): void {
    this.moviesUpdated.next({
      results: [],
      count: null,
      total_pages: null,
      page: null,
      clear: true,
    });
  }

  // when application loaded, get all genres and save it
  getMovieGenres(): Subscription {
      return this.http.get<GenreModel>(`${API_URL}genre/movie/list?api_key=${API_KEY}`)
        .subscribe(genres => {
          this.genres = genres.genres;
        }, error => {
          console.log(error);
        });
  }

  // Return current movie genre names by genre ids
  getMovieGenreNames(genreIds: Array<number>): string {
    let movieGenres = '';

    if (!genreIds) {
      return;
    }

    if (genreIds.length > 0) {
      genreIds.forEach((genreId, idx) => {
        const index = this.genres.map(genre => genre.id)
          .indexOf(genreId);

        if (index >= 0) {
          if (idx === genreIds.length - 1) {
            movieGenres += `${this.genres[index].name}`;
          } else {
            movieGenres += `${this.genres[index].name}, `;
          }
        }
      });
    }

    return movieGenres;
  }

  // get movies extended data for detail page
  getMovieDetails(id: number, mediaType: string): Observable<MovieExtendedDetailsModel> {
    return this.http.get(`${API_URL}${mediaType}/${id}?api_key=${API_KEY}&language=${API_LANG}`)
      .pipe(
        map((extendedMovieDetails: MovieExtendedDetailsModel) => {
          const posterPath = !extendedMovieDetails.poster_path ?
            '/assets/images/placeholder-300x450.png' : `${IMG_PATH}${extendedMovieDetails.poster_path}`;

          // same properties in movies and tv shows
          const defaultProperties = {
            poster_path: posterPath,
            overview: extendedMovieDetails.overview,
            genres: extendedMovieDetails.genres,
            tagline: extendedMovieDetails.tagline,
            imdb_id: extendedMovieDetails.imdb_id,
            imdb_link: `${IMDB_LINK}${extendedMovieDetails.imdb_id}`,
          };

          if (mediaType === 'movie') {
            // extend movie properties and return it
            return {
              ...defaultProperties,
              original_title: extendedMovieDetails.original_title,
              release_date: extendedMovieDetails.release_date,
              runtime: extendedMovieDetails.runtime,
              production_countries: extendedMovieDetails.production_countries,
              spoken_languages: extendedMovieDetails.spoken_languages
            };
          } else {
            // extend tv show properties and return it
            return {
              ...defaultProperties,
              original_name: extendedMovieDetails.original_name,
              first_air_date: extendedMovieDetails.first_air_date,
              episode_run_time: extendedMovieDetails.episode_run_time,
              origin_country: extendedMovieDetails.origin_country,
              languages: extendedMovieDetails.languages
            };
          }
        })
      );
  }

  // get the stored titles when we go back to list page
  getStoredTitle() {
    return this.title;
  }

  // get stored movies for list page
  getStoredMovies() {
      return this.movies;
  }

  // store current page for we can get last page what we visit
  storeCurrentPage(currentPage: number) {
      this.currentPage = currentPage;
  }

  // get the last page
  getCurrentPage() {
    return this.currentPage;
  }
}
