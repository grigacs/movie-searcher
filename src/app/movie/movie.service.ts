import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const API_URL = `${environment.apiUrl}`;
const API_KEY = `${environment.apiKey}`;
const API_LANG = `${environment.apiLanguage}`;

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  getMovies(title: string): Observable<MovieDetailsModel[]> {
    return this.http.get<MovieDetailsModel[]>(
      `${API_URL}${environment.searchMoviesEndpoint}?api_key=${API_KEY}&language=${API_LANG}&query=${title}`,
    ).pipe(
      map(movies => movies)
    );
  }
}
