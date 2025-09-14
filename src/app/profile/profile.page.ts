import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  NavController,
  ActionSheetController,
  AlertController,
  GestureController,
} from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface UserProfile {
  nik: string;
  password: string;
  nama: string;       // field untuk menampilkan nama di profile
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  foto?: string;
  fullName?: string;  // opsional, dari data registrasi
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit, AfterViewInit {
  readonly DEFAULT_FOTO = 'assets/img/default-profile.png';

  user: UserProfile = {
    nik: '',
    password: '',
    nama: '',
    email: '',
    whatsapp: '',
    phone: '',
    address: '',
    foto: this.DEFAULT_FOTO,
  };

  isEditing = false;
  isModalOpen = false;

  constructor(
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as any;

      // Pastikan user.nama terisi dari nama atau fullName
      this.user = {
        ...this.user,
        ...parsed,
        nama: parsed.nama || parsed.fullName || '', // fallback ke fullName
      };

      if (!this.user.foto) this.user.foto = this.DEFAULT_FOTO;
    } else {
      this.navCtrl.navigateRoot('/login');
    }
  }

  ngAfterViewInit() {
    const img = document.querySelector('.photo-img') as HTMLElement;
    if (img) {
      const gesture = this.gestureCtrl.create({
        el: img,
        gestureName: 'double-tap-zoom',
        onEnd: () => {
          img.style.transform =
            img.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
        },
      });
      gesture.enable(true);
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/dashboard');
  }

  openProfileModal() {
    this.isModalOpen = true;
  }

  closeProfileModal() {
    this.isModalOpen = false;
  }

  async pickImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Pilih Foto Profil',
      buttons: [
        { text: 'Kamera', icon: 'camera', handler: () => this.openCamera(CameraSource.Camera) },
        { text: 'Galeri', icon: 'image', handler: () => this.openCamera(CameraSource.Photos) },
        { text: 'Hapus Foto', icon: 'trash', role: 'destructive', handler: () => this.deletePhoto() },
        { text: 'Batal', icon: 'close', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  async openCamera(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source,
      });

      if (image.dataUrl) {
        this.user.foto = image.dataUrl;
        this.saveToLocalStorage();
        this.addAnnouncement('Foto profil berhasil diperbarui!');
        this.showAlert('Berhasil', 'Foto profil berhasil diperbarui!');
      }
    } catch (error) {
      console.error('Gagal ambil foto:', error);
    }
  }

  async deletePhoto() {
    this.user.foto = this.DEFAULT_FOTO;
    this.saveToLocalStorage();
    this.addAnnouncement('Foto profil berhasil dihapus!');
    this.showAlert('Berhasil', 'Foto profil berhasil dihapus!');
  }

  enableEdit() {
    this.isEditing = true;
  }

  async saveProfile() {
    this.isEditing = false;
    // pastikan nama juga tersimpan ke field fullName agar sinkron dengan registrasi
    this.user.fullName = this.user.nama;
    this.saveToLocalStorage();

    // Tambahkan pengumuman
    this.addAnnouncement(`Profil ${this.user.nama} berhasil diperbarui.`);

    this.showAlert('Berhasil', 'Profil berhasil diperbarui!');
  }

  private saveToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.user));
  }

  // ✅ Simpan pengumuman ke localStorage key "pengumuman" agar sinkron dengan PengumumanPage
  private addAnnouncement(message: string) {
    const pengumuman = JSON.parse(localStorage.getItem('pengumuman') || '[]');
    pengumuman.unshift({
      title: 'Perubahan Profil',
      message,
      date: new Date().toISOString()
    });
    localStorage.setItem('pengumuman', JSON.stringify(pengumuman));
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Logout',
          handler: () => {
            localStorage.removeItem('currentUser');
            this.navCtrl.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }
}
