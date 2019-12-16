import {Component, Input, OnInit} from '@angular/core';
import {MovieDetailsModel} from '../modules/movie-details.model';
import {MovieService} from '../movie.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() movie: MovieDetailsModel;
  genreNames: string;


  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.genreNames = this.movieService.getMovieGenreNames(this.movie.genre_ids);
    this.movie.genres = this.genreNames;
  }
}
