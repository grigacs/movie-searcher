import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MovieService} from '../movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  form: FormGroup;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl( null,
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

    this.movieService.getMovies(this.form.value.title)
      .subscribe(movie => console.log(movie));

    this.form.reset();
  }

  onResetForm() {
    this.form.reset();
  }

}
