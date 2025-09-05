import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-informasi',
  templateUrl: './informasi.page.html',
  styleUrls: ['./informasi.page.scss'],
  standalone: false
})
export class InformasiPage {
  constructor(private navCtrl: NavController) {}

  closePage() {
    this.navCtrl.back();
  }
}
