import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {MainComponent} from './main/main.component';
import {DetailsComponent} from './movie/details/details.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'details/:mediaType/:movieId',
    component: DetailsComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
