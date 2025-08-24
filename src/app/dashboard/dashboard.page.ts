import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage {
  isPopoverOpen = false;
  popoverEvent: any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController
  ) {}

  openPopover(ev: any) {
    this.popoverEvent = ev;
    this.isPopoverOpen = true;
  }

  async goToProfile() {
    this.isPopoverOpen = false;
    await this.popoverCtrl.dismiss();   // ✅ pastikan popover tertutup
    this.navCtrl.navigateForward('/profile');
  }

  async logout() {
    this.isPopoverOpen = false;
    await this.popoverCtrl.dismiss();   // ✅ tutup popover dulu

    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin logout?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Ya, Logout',
          handler: async () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

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
