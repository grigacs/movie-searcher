import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MovieExtendedDetailsModel} from '../../modules/movie-extended-details.model';
import {Router} from '@angular/router';
import {MovieService} from '../../movie.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input() extendedMovieDetails: MovieExtendedDetailsModel;
  @Input() mediaType: string;
  @ViewChild('closePopup', {static: true}) closePopup: ElementRef;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  onClosePopup() {
      this.router.navigate(['']);
  }

  checkIsLastItem(descriptionArray: Array<{name: string}>|Array<string|number>, index: number) {
    return descriptionArray.length - 1 === index;
  }

  isMovie() {
    return this.mediaType === 'movie';
  }

}
