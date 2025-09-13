import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavController, ActionSheetController, AlertController, GestureController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface UserProfile {
  nik: string;
  password: string;
  nama: string;
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  foto?: string;
}

interface Pengumuman {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean; // 🔹 tambah properti read
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
      const parsed = JSON.parse(storedUser) as Partial<UserProfile>;
      this.user = { ...this.user, ...parsed };
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
          img.style.transform = img.style.transform === 'scale(2)' ? 'scale(1)' : 'scale(2)';
        },
      });
      gesture.enable(true);
    }
  }

  goBack() { this.navCtrl.navigateBack('/dashboard'); }
  openProfileModal() { this.isModalOpen = true; }
  closeProfileModal() { this.isModalOpen = false; }

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
        this.saveProfile(true); // skip alert
      }
    } catch (error) {
      console.error('Gagal ambil foto:', error);
    }
  }

  async deletePhoto() {
    this.user.foto = this.DEFAULT_FOTO;
    this.saveProfile(true); // skip alert
  }

  enableEdit() { this.isEditing = true; }

  /** Simpan profil & buat pengumuman */
  async saveProfile(skipAlert = false) {
    this.isEditing = false;
    this.saveToLocalStorage();
    this.addPengumuman('Profil Diperbarui', 'Anda berhasil memperbarui profil!');
    if (!skipAlert) this.showAlert('Berhasil', 'Profil berhasil diperbarui!');
  }

  /** Hitung jumlah pengumuman belum dibaca */
  getUnreadPengumumanCount(): number {
    const stored = localStorage.getItem('pengumuman');
    const arr: Pengumuman[] = stored ? JSON.parse(stored) : [];
    return arr.filter(p => !p.read).length;
  }

  private saveToLocalStorage() { localStorage.setItem('currentUser', JSON.stringify(this.user)); }

  /** Tambah pengumuman baru */
  private addPengumuman(title: string, message: string) {
    const stored = localStorage.getItem('pengumuman');
    const arr: Pengumuman[] = stored ? JSON.parse(stored) : [];
    arr.unshift({
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString(),
      read: false, // 🔹 selalu unread
    });
    localStorage.setItem('pengumuman', JSON.stringify(arr));
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi Logout',
      message: 'Apakah Anda yakin ingin keluar?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        { text: 'Logout', handler: () => {
            localStorage.removeItem('currentUser');
            this.navCtrl.navigateRoot('/login');
        }},
      ],
    });
    await alert.present();
  }
}
