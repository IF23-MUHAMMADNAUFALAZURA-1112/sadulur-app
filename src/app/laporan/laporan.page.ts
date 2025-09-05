import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
  standalone: false
})
export class LaporanPage {
  constructor(private navCtrl: NavController) {}

  goToInformasi() {
    this.navCtrl.navigateForward('/informasi');
  }
}
