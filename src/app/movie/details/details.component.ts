import {Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MovieService} from '../movie.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MovieExtendedDetailsModel} from '../modules/movie-extended-details.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

  movieId: number;
  mediaType: string;
  extendedMovieDetailsSubscription: Subscription = null;
  extendedMovieDetails: MovieExtendedDetailsModel;
  @ViewChild('popup', {static: false}) popup: ElementRef;

  constructor(private movieService: MovieService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('movieId') && paramMap.has('mediaType')) {
          this.movieId = parseInt(paramMap.get('movieId'), 10);
          this.mediaType = paramMap.get('mediaType');

          if (isNaN(this.movieId)) {
            this.router.navigate(['']);
          }

          this.extendedMovieDetailsSubscription = this.movieService.getMovieDetails(this.movieId, this.mediaType)
            .subscribe(extendedMovieDetails => {
              this.extendedMovieDetails = extendedMovieDetails;
            }, error => {
              console.log(error);
            });
        }
    }, error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    this.extendedMovieDetailsSubscription.unsubscribe();
  }

}
