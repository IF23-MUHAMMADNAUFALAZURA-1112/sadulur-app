import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';  // Cukup satu kali impor IonicModule

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Impor komponen standalone
import { BtnNavigationbarComponent } from './shared/btn-navigationbar/btn-navigationbar.component';
import { LaporanPage } from './laporan/laporan.page';

@NgModule({
  declarations: [
    AppComponent,
 
    // Hapus BtnNavigationbarComponent dari sini
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BtnNavigationbarComponent,  // Impor komponen standalone di sini
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
