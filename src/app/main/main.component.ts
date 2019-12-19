import {Component, OnDestroy, OnInit} from '@angular/core';
import {MovieDetailsModel} from '../movie/modules/movie-details.model';
import {from, fromEvent, Observable, of, pipe, Subscription, timer} from 'rxjs';
import {MovieService} from '../movie/movie.service';
import {debounceTime, filter, finalize, map, mergeMap, throttleTime} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";

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
  isLoading = false;
  page = 1;

  constructor(private movieService: MovieService) { }

  private static checkFoundMovies(count: number) {
    let isFoundedMovie = false;

    if (count > 0) {
      isFoundedMovie = true;
    }

    return isFoundedMovie;
  }

  ngOnInit() {
    this.observables();


    this.onGetStoredMovies();
    this.page = this.movieService.getCurrentPage();

    this.movieService.getMovieGenres();

    this.movieSubscription = this.movieService.getMoviesUpdateListener()
      .subscribe(movies => {
        this.isLoading = false;
        console.log(movies);
        this.clearList = movies.clear;

        if (MainComponent.checkFoundMovies(movies.count)) {
          this.noFoundedMovie = false;
          this.movieTotalCount = movies.count;
          this.pageNumbers = movies.total_pages;
          this.page = movies.page;
          this.movies = [...movies.result];
        } else {
          this.noFoundedMovie = true;
        }
      }, error => {
        console.log(error);
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
      this.movies = [...this.movieService.getStoredMovies().result];
    }
  }

  changeStateLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  onChangePage(currentPageNumber: number) {
    const title = this.movieService.getStoredTitle();
    this.movieService.getMoviesAndTVShows(title, currentPageNumber);
  }

  observables() {
    const observable = new Observable( observer => {
      observer.next('hello');
      observer.next('world');
    });

    observable.subscribe(val => console.log(val));

    const click = fromEvent(document,'mousemove').pipe(debounceTime(10000));

    const example = click.pipe(map(event => `Event timer ${event}`));

     click
       .subscribe(aa => {
       console.log(aa)
     });

    example.subscribe(val => {
      console.log(val);
    });

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('resolve!')
      }, 500);
      setTimeout(() => {
        resolve('resolved!')
      }, 1000)
    });
    promise.then(res => console.log(res)).catch(err => console.log(err));

    const observPromise = fromPromise(promise);

    observPromise.subscribe(result => console.log(result), error => console.log(error));

    const ofObs = of(1, 2, 3, 4,5, 6);

    ofObs.subscribe(val => console.log(val));

    const timerObs = timer(0, 1000).pipe(finalize(() => console.log('All done!')))
      .subscribe(val => console.log(`Timer: ${val}`),
        error => (console.log(error)))

    const timerObs2 = timer(11000)
      .subscribe(() => {
        timerObs.unsubscribe();
      })

    const cold = new Observable(observer => {
      observer.next(Math.random());
    })

    cold.subscribe(a => console.log(`Subscriber A: ${a}`));
    cold.subscribe(b => console.log(`Subscriber B: ${b}`));

    const mapFrom = from([1, 10, 100]).pipe(
      map(num => Math.log(num))
    ).subscribe(x => console.log(x));


    const tweets: Observable<Array<{user: string, value: string}>> = of([{user:'alma', value: 'nice'}, {user:'alma', value: 'nice'}, {user:'alma3', value: 'nice'}, {user:'alma2', value: 'nice'}]);

    tweets.pipe(
      map(tweets => tweets.filter(tweet => tweet.user === 'alma')))
      .subscribe(val => console.log(val));

  }
}
