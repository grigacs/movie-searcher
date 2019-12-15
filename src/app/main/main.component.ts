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

  constructor(private movieService: MovieService) { }

  private static checkFoundMovies(count: number) {
    let isFoundedMovie = false;

    if (count > 0) {
      isFoundedMovie = true;
    }

    return isFoundedMovie;
  }

  ngOnInit() {
    this.movieSubscription = this.movieService.getMoviesUpdateListener()
      .subscribe(movies => {

        if (MainComponent.checkFoundMovies(movies.count)) {
          this.noFoundedMovie = false;
          this.movieTotalCount = movies.count;
          this.movies = [...movies.results];
        } else {
          this.noFoundedMovie = true;
        }

        console.log(movies);
      });
  }

  ngOnDestroy(): void {
    this.movieSubscription.unsubscribe();
  }
}
