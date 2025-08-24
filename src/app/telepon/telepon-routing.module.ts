import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeleponPage } from './telepon.page';

const routes: Routes = [
  {
    path: '',
    component: TeleponPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeleponPageRoutingModule {}
