import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, PopoverController } from '@ionic/angular';

interface CurrentUser {
  nama: string;
  foto?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  isPopoverOpen = false;
  popoverEvent: any;

  user: CurrentUser = { nama: 'Dulur', foto: 'assets/img/default-profile.png' };

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as CurrentUser;
      this.user = {
        nama: parsed.nama || 'Dulur',
        foto: parsed.foto || 'assets/img/default-profile.png'
      };
    }
  }

  openPopover(ev: any) {
    this.popoverEvent = ev;
    this.isPopoverOpen = true;
  }

  async goToProfile() {
    this.isPopoverOpen = false;
    await this.popoverCtrl.dismiss();
    this.navCtrl.navigateForward('/profile');
  }

  async logout() {
    this.isPopoverOpen = false;
    await this.popoverCtrl.dismiss();

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin logout?',
      buttons: [
        { text: 'Batal', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Ya, Logout',
          handler: async () => {
            localStorage.removeItem('currentUser');
            const toast = await this.toastCtrl.create({
              message: 'Logout berhasil',
              duration: 2000,
              position: 'top',
              color: 'success'
            });
            await toast.present();
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });

    await alert.present();
  }
}
