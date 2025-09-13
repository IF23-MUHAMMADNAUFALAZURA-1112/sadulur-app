import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; 
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http'; // ✅ uncomment nanti kalau backend sudah siap
// import { Observable } from 'rxjs';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
  standalone: false,
})
export class PasswordPage implements OnInit {

  // 🔹 Tambahkan variabel untuk ngModel
  oldPass: string = '';
  newPass: string = '';
  confirmPass: string = '';

  // 🔹 Data user dari localStorage
  user: any = {
    name: 'NAMA LENGKAP',
    id: '1111222233334444',
    photo: 'assets/img/profile.png'
  };

  constructor(
    private location: Location,
    private alertCtrl: AlertController,
    private router: Router,
    // private http: HttpClient // ✅ aktifkan kalau backend Laravel sudah siap
  ) {}

  goBack() {
    this.location.back(); 
  }

  ngOnInit() {
    // 🔥 load data user dari localStorage
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

  async showSuccessAlert() {
    // 🔥 simpan dummy notifikasi ke localStorage
    const notif = {
      title: 'Password Diperbarui',
      message: 'Password akun Anda berhasil diperbarui.',
      date: new Date()
    };
    localStorage.setItem('passwordUpdatedNotif', JSON.stringify(notif));

    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Password telah diperbarui',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // 🚀 Redirect ke halaman pengumuman
            this.router.navigate(['/pengumuman']);
          }
        }
      ]
    });

    await alert.present();
  }

  // 🚀 Fungsi dipanggil saat klik tombol simpan
  onSavePassword() {
    // 👉 validasi sederhana dulu
    if (!this.oldPass || !this.newPass || !this.confirmPass) {
      this.alertCtrl.create({
        header: 'Error',
        message: 'Semua field wajib diisi',
        buttons: ['OK']
      }).then(alert => alert.present());
      return;
    }

    if (this.newPass !== this.confirmPass) {
      this.alertCtrl.create({
        header: 'Error',
        message: 'Password baru dan konfirmasi tidak sama',
        buttons: ['OK']
      }).then(alert => alert.present());
      return;
    }

    // 👉 sementara hardcode sukses (nanti ganti dengan API call)
    this.showSuccessAlert();
  }
}
