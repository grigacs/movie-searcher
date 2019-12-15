import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MovieDetailsModel} from '../modules/movie-details.model';
import { Subscription } from 'rxjs';
import {MovieService} from '../movie.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @Input() movie: MovieDetailsModel;

  constructor() { }

  ngOnInit() {
  }

}
