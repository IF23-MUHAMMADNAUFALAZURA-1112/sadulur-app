import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // ⬅️ Tambahkan ini

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false
})
export class WelcomePage implements OnInit {

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    console.log('✅ WelcomePage berhasil dimuat');
  }

  // Fungsi untuk menampilkan alert jika halaman belum tersedia
  async notAvailable() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Halaman belum tersedia.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
