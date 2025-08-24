import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http'; //  aktifkan ini kalau backend sudah siap

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false //  pastikan ini false kalau pakai Ionic Angular
})
export class LoginPage {
  form: FormGroup;
  showPassword = false;

  // ✅ Dummy user sementara (password sudah sesuai aturan baru)
  private dummyUser = {
    nik: '3215260409280004',    
    password: 'N@ufal12',       // contoh: huruf besar, kecil, angka, simbol
    nama: 'Naufal'
  };

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    // private http: HttpClient //  aktifkan kalau backend sudah siap
  ) {
    this.form = this.fb.group({
      nik: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // ✅ Custom validator untuk password
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSymbol) {
      return { passwordStrength: true };
    }
    return null;
  }

  async login() {
    if (this.form.invalid) {
      this.showAlert(
        'Login Gagal',
        'Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, dan simbol!'
      );
      return;
    }

    const { nik, password } = this.form.value;

    // ============== VERSI DUMMY (sementara) ==============
    if (nik === this.dummyUser.nik && password === this.dummyUser.password) {
      this.showAlert('Login Berhasil', `Selamat datang ${this.dummyUser.nama}!`);
      this.navCtrl.navigateRoot('/dashboard');
    } else {
      this.showAlert('Login Gagal', 'NIK atau Password salah!');
    }

    // ============== VERSI API LARAVEL (aktifkan nanti) ==============
    /*
    this.http.post('http://localhost:8000/api/login', { nik, password }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.showAlert('Login Berhasil', `Selamat datang ${res.user.name}!`);
          localStorage.setItem('token', res.token);
          this.navCtrl.navigateRoot('/dashboard');
        } else {
          this.showAlert('Login Gagal', 'NIK atau Password salah!');
        }
      },
      error: () => {
        this.showAlert('Login Gagal', 'Terjadi kesalahan pada server!');
      }
    });
    */
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
