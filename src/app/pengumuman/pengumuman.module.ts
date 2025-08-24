import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PengumumanPageRoutingModule } from './pengumuman-routing.module';

import { PengumumanPage } from './pengumuman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PengumumanPageRoutingModule,
    
  ],
  declarations: [PengumumanPage]
})
export class PengumumanPageModule {}
