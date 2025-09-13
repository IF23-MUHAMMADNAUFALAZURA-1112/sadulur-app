import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

interface Announcement {
  title: string;
  message: string;
  date: string; // ISO string
}

@Component({
  selector: 'app-pengumuman',
  templateUrl: './pengumuman.page.html',
  styleUrls: ['./pengumuman.page.scss'],
  standalone: false
})
export class PengumumanPage implements OnInit {
  announcements: Announcement[] = [];
  selectedItems: number[] = [];
  isSelectionMode = false;
  private pressTimer: any;

  constructor(private navCtrl: NavController, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadAnnouncements();
    // cek pengumuman baru dari localStorage (misal dari ProfilePage)
    this.checkProfileUpdateNotif();
    // polling tiap 2 detik supaya realtime tanpa reload
    setInterval(() => this.checkProfileUpdateNotif(), 2000);
  }

  goBack() {
    this.navCtrl.navigateBack('/dashboard');
  }

  private loadAnnouncements() {
    const stored = localStorage.getItem('pengumuman');
    if (stored) {
      this.announcements = JSON.parse(stored);
      // urutkan berdasarkan tanggal terbaru
      this.announcements.sort((a, b) => (a.date < b.date ? 1 : -1));
    }
  }

  private checkProfileUpdateNotif() {
    const notif = localStorage.getItem('profileUpdatedNotif');
    if (notif) {
      const newAnn: Announcement = JSON.parse(notif);
      // tambahkan di paling atas
      this.announcements.unshift(newAnn);
      localStorage.removeItem('profileUpdatedNotif'); // hapus supaya tidak dobel
      this.saveAnnouncementsToStorage();
    }
  }

  private saveAnnouncementsToStorage() {
    localStorage.setItem('pengumuman', JSON.stringify(this.announcements));
  }

  enableSelectionMode() {
    this.isSelectionMode = true;
  }

  cancelSelection() {
    this.isSelectionMode = false;
    this.selectedItems = [];
  }

  onSelectChange() {
    console.log('Selected items:', this.selectedItems);
  }

  removeOldAnnouncements() {
    const now = new Date().getTime();
    this.announcements = this.announcements.filter(item => {
      const diff = (now - new Date(item.date).getTime()) / (1000 * 3600 * 24);
      return diff <= 3;
    });
    this.saveAnnouncementsToStorage();
  }

  startPress(index: number) {
    this.pressTimer = setTimeout(() => {
      this.enableSelectionMode();
      if (!this.selectedItems.includes(index)) {
        this.selectedItems.push(index);
      }
    }, 600);
  }

  endPress() {
    clearTimeout(this.pressTimer);
  }

  async confirmDelete(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Pengumuman',
      message: 'Apakah Anda yakin ingin menghapus pengumuman ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => this.deleteAnnouncement(index),
        },
      ],
    });
    await alert.present();
  }

  async deleteAnnouncement(index: number) {
    this.announcements.splice(index, 1);
    this.saveAnnouncementsToStorage();
    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Pengumuman telah dihapus',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async deleteSelected() {
    this.announcements = this.announcements.filter(
      (_, idx) => !this.selectedItems.includes(idx)
    );
    this.selectedItems = [];
    this.isSelectionMode = false;
    this.saveAnnouncementsToStorage();

    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Pengumuman terpilih telah dihapus',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
