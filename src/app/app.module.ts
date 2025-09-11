import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Impor komponen standalone
import { BtnNavigationbarComponent } from './shared/btn-navigationbar/btn-navigationbar.component';
import { LaporanPage } from './laporan/laporan.page';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      animated: false   // 🔥 Nonaktifkan animasi slide
    }),
    AppRoutingModule,
    HammerModule,             // ✅ tambahkan ini
    BtnNavigationbarComponent // Standalone component
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
