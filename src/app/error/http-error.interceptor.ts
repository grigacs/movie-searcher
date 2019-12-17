import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {ErrorService} from './error.service';

export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client side error
            errorMessage = `Error code: ${error.status} \n Message: ${error.error.message}`;
          } else {
            // server side error
            errorMessage = `Error code: ${error.status} \n Message: ${error.statusText}`;

          }

          this.errorService.showError(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

}
