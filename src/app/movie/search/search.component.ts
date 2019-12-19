import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MovieService} from '../movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  form: FormGroup;
  title: string = null;
  @Output() isLoadingChange = new EventEmitter<boolean>();

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.onGetStoredTitle();


    this.form = new FormGroup({
      title: new FormControl( this.title,
        {
          validators: [
            Validators.required,
            Validators.minLength(3)
          ]
        })
    });
  }

  onSearchMovie() {
    if (this.form.invalid) {
      return;
    }

    this.isLoadingChange.emit(true);

    this.movieService.getMoviesAndTVShows(this.form.value.title);
  }

  onResetForm() {
    this.movieService.clearMovies();
    this.form.reset();
  }

  onGetStoredTitle() {
    if (this.movieService.getStoredTitle()) {
      this.title = this.movieService.getStoredTitle();
    }
  }
}
