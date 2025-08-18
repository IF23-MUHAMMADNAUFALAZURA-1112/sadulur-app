import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
  standalone: false,
})
export class RegistrasiPage implements OnInit {

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    console.log('✅ RegistrasiPage berhasil dimuat!');
  }

  goBack() {
    this.navCtrl.back();
  }
}
