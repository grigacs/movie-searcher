import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorService} from '../error.service';
import {Subscription, timer} from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit, OnDestroy {

  errorMessage: string;
  errorMessageSubscription: Subscription;

  constructor(private errorService: ErrorService) { }

  ngOnInit() {
    this.errorMessageSubscription = this.errorService.getErrorUpdateListener()
      .subscribe(errorMessage => {
        this.errorMessage = errorMessage;

        timer(5000).subscribe(() => {
          this.errorMessage = null;
        });

      }, err => {
        console.log(err);
      });
  }

  ngOnDestroy(): void {
    this.errorMessageSubscription.unsubscribe();
  }

}
