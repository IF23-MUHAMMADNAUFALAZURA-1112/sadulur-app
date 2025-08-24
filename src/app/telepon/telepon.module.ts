import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeleponPageRoutingModule } from './telepon-routing.module';

import { TeleponPage } from './telepon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeleponPageRoutingModule
  ],
  declarations: [TeleponPage]
})
export class TeleponPageModule {}
