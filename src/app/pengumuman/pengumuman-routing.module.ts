import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PengumumanPage } from './pengumuman.page';

const routes: Routes = [
  {
    path: '',
    component: PengumumanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PengumumanPageRoutingModule {}
