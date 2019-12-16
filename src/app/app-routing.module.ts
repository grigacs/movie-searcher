import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './movie/search/search.component';
import { NgModule } from '@angular/core';
import {MainComponent} from './main/main.component';
import {DetailsComponent} from './movie/details/details.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'details/:mediaType/:movieId',
    component: DetailsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
