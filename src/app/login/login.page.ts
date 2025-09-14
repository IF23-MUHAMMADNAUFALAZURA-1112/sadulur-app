import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

interface RegistrationPayload {
  nama: string;
  nik: string;
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  password: string;
  photoPreview?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  form: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.form = this.fb.group({
      nik: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
    });
  }

  togglePasswordVisibility() { 
    this.showPassword = !this.showPassword; 
  }

  ionViewWillEnter() {
    const user = localStorage.getItem('currentUser');
    if (user) this.navCtrl.navigateRoot('/dashboard');
  }

  async login() {
    if (this.form.invalid) {
      await this.showAlert('Login Gagal', 'Silakan masukkan NIK & password yang benar.');
      return;
    }

    const { nik, password } = this.form.value;
    const stored = localStorage.getItem('users');
    const users: RegistrationPayload[] = stored ? JSON.parse(stored) : [];

    const matchedUser = users.find(u => u.nik === nik && u.password === password);
    if (!matchedUser) {
      await this.showAlert('Login Gagal', 'NIK atau Password salah!');
      return;
    }

    const userToSave = {
      nik: matchedUser.nik,
      nama: matchedUser.nama,
      email: matchedUser.email,
      whatsapp: matchedUser.whatsapp,
      phone: matchedUser.phone,
      address: matchedUser.address,
      password: matchedUser.password,
      foto: matchedUser.photoPreview || 'assets/img/default-profile.png'
    };

    localStorage.setItem('currentUser', JSON.stringify(userToSave));
    await this.showAlert('Login Berhasil', `Selamat datang ${userToSave.nama}!`);
    this.navCtrl.navigateRoot('/dashboard');
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
