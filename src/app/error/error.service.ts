import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorUpdated = new Subject<string>();

  constructor() { }

  showError(error: string): void {
      this.errorUpdated.next(error);
  }

  getErrorUpdateListener(): Observable<string> {
    return this.errorUpdated.asObservable();
  }
}
