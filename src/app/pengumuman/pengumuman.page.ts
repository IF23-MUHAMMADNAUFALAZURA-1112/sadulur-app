import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-pengumuman',
  templateUrl: './pengumuman.page.html',
  styleUrls: ['./pengumuman.page.scss'],
  standalone: false,
})
export class PengumumanPage implements OnInit {
  // 🔹 Array untuk menampung pengumuman
  announcements: any[] = [];
  private pressTimer: any; // ⏱️ simpan timer long press

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  goBack() {
    this.navCtrl.navigateBack('/dashboard');
    // atau: this.navCtrl.back();
  }

  ngOnInit() {
    // 🔹 Contoh data dummy (nanti diganti API Laravel)
    this.announcements = [
      {
        title: 'Kegiatan Gotong Royong',
        message: 'Besok ada kegiatan gotong royong di balai desa jam 07.00 WIB.',
        date: new Date()
      },
      {
        title: 'Update Sistem',
        message: 'Sistem akan diperbarui malam ini jam 23.00 WIB.',
        date: new Date('2025-09-06T23:00:00')
      }
    ];
  }

  // 🔹 Saat mulai tekan (mousedown/touchstart)
  startPress(index: number) {
    this.pressTimer = setTimeout(() => {
      this.confirmDelete(index);
    }, 600); // 600ms dianggap long press
  }

  // 🔹 Saat lepas tekan (mouseup/touchend/mouseleave)
  endPress() {
    clearTimeout(this.pressTimer);
  }

  // 🔹 Munculkan popup konfirmasi hapus
  async confirmDelete(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Pengumuman',
      message: 'Apakah Anda yakin ingin menghapus pengumuman ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.deleteAnnouncement(index);
          }
        }
      ]
    });

    await alert.present();
  }

  // 🔹 Hapus pengumuman dari array
  deleteAnnouncement(index: number) {
    this.announcements.splice(index, 1);
  }
}
gi