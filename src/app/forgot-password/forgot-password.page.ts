import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone:false
})
export class ForgotPasswordPage implements OnInit {
  form: FormGroup;
  showNIK: boolean = false;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
    this.form = this.fb.group({
      nik: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]]
    });
  }

  ngOnInit() {}

  toggleNIKVisibility() {
    this.showNIK = !this.showNIK;
  }

  async submitForgotPassword() {
    if (this.form.valid) {
      const alert = await this.alertCtrl.create({
        header: 'Berhasil',
        message: 'Instruksi reset password telah dikirim!',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Masukkan NIK yang valid (16 digit).',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goBack() {
    this.navCtrl.navigateBack('/login');
  }
}
