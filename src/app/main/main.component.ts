import {Component, OnDestroy, OnInit} from '@angular/core';
import {MovieDetailsModel} from '../movie/modules/movie-details.model';
import {Subscription} from 'rxjs';
import {MovieService} from '../movie/movie.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  movies: MovieDetailsModel[] = [];
  movieTotalCount: number;
  movieSubscription: Subscription;
  noFoundedMovie = false;
  pageNumbers: number;
  clearList: boolean;

  constructor(private movieService: MovieService) {
  }

  private static checkFoundMovies(count: number) {
    let isFoundedMovie = false;

    if (count > 0) {
      isFoundedMovie = true;
    }

    return isFoundedMovie;
  }

  ngOnInit() {
    this.onGetStoredMovies();

    this.movieService.getMovieGenres();

    this.movieSubscription = this.movieService.getMoviesUpdateListener()
      .subscribe(movies => {
        this.clearList = movies.clear;

        if (MainComponent.checkFoundMovies(movies.count)) {
          this.noFoundedMovie = false;
          this.movieTotalCount = movies.count;
          this.pageNumbers = movies.total_pages;
          this.movies = [...movies.results];
        } else {
          this.noFoundedMovie = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }

  onGetStoredMovies() {
    if (this.movieService.getStoredMovies()) {
      this.noFoundedMovie = false;
      this.movieTotalCount = this.movieService.getStoredMovies().count;
      this.pageNumbers = this.movieService.getStoredMovies().total_pages;
      this.movies = [...this.movieService.getStoredMovies().results];
    }
  }

  counter(pageNumbers: number) {
    return new Array(pageNumbers);
  }

  onChangePage(pageNumber: number) {
    const title = this.movieService.getStoredTitle();

    this.movieService.getMovies(title, pageNumber);
  }

}
