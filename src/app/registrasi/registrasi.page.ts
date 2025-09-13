import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface RegistrationPayload {
  fullName: string;
  nik: string;
  email: string;
  whatsapp: string;
  phone: string;
  address: string;
  password: string;
  photoPreview?: string;
}

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
  standalone: false
})
export class RegistrasiPage {
  form!: FormGroup;
  showPass = true;
  showPass2 = false;
  photoPreview: string | null = null;
  private readonly MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    public navCtrl: NavController,   // harus public supaya bisa dipakai di template
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      nik: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      email: ['', [Validators.required, Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|.*\.co\.id|.*\.id)$/
      )]],
      whatsapp: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(8)]],
      photo: ['', [Validators.required, this.imageTypeValidator()]],
    }, { validators: this.passwordsMatchValidator });
  }

  // Getter untuk template agar bisa pakai showPassword / showPassword2
  get showPassword(): boolean { return this.showPass; }
  set showPassword(v: boolean) { this.showPass = v; }
  get showPassword2(): boolean { return this.showPass2; }
  set showPassword2(v: boolean) { this.showPass2 = v; }

  passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const pass = group.get('password')?.value ?? '';
    const confirm = group.get('confirmPassword')?.value ?? '';
    return pass && confirm && pass !== confirm ? { passwordsMismatch: true } : null;
  };

  private imageTypeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '') as string;
      if (!v) return null;
      const lowered = v.toLowerCase();
      const ok =
        lowered.endsWith('.jpg') ||
        lowered.endsWith('.jpeg') ||
        lowered.endsWith('.png') ||
        lowered.startsWith('data:image/jpeg') ||
        lowered.startsWith('data:image/png');
      return ok ? null : { invalidImageType: true };
    };
  }

  togglePass() { this.showPassword = !this.showPassword; }
  togglePass2() { this.showPassword2 = !this.showPassword2; }

  goBack() {
    this.navCtrl.back();
  }

  async pickImage() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        const photo: Photo = await Camera.getPhoto({
          quality: 70,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt,
          saveToGallery: false,
        });
        if (!photo.dataUrl) { await this.showAlert('Gagal memuat foto', 'Silakan coba lagi.'); return; }
        this.photoPreview = photo.dataUrl;
        this.setPhotoControl('dataUrl');
        return;
      }
      const el = document.querySelector('input[type=file]') as HTMLInputElement | null;
      el?.click();
    } catch (error) { console.error('Error pickImage:', error); }
  }

  async onFilePicked(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      await this.showAlert('Format tidak didukung', 'Hanya JPG/PNG yang diperbolehkan.');
      input.value = '';
      this.form.patchValue({ photo: '' });
      this.photoPreview = null;
      return;
    }

    if (file.size > this.MAX_PHOTO_SIZE) {
      await this.showAlert('Ukuran terlalu besar', 'Maksimal 5MB.');
      input.value = '';
      this.form.patchValue({ photo: '' });
      this.photoPreview = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => { this.photoPreview = reader.result as string; };
    reader.readAsDataURL(file);

    this.setPhotoControl('dataUrl');
  }

  private setPhotoControl(value: string) {
    this.form.patchValue({ photo: value });
  }

  async submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { await this.showAlert('Form belum lengkap', 'Silahkan lengkapi data.'); return; }

    const payload: RegistrationPayload = {
      fullName: this.form.value.fullName,
      nik: this.form.value.nik,
      email: this.form.value.email,
      whatsapp: this.form.value.whatsapp,
      phone: this.form.value.phone,
      address: this.form.value.address,
      password: this.form.value.password,
      photoPreview: this.photoPreview || ''
    };

    const stored = localStorage.getItem('users');
    let users: RegistrationPayload[] = stored ? JSON.parse(stored) : [];
    users.push(payload);
    localStorage.setItem('users', JSON.stringify(users));

    await this.showAlert('Berhasil', 'Akun berhasil dibuat. Silakan login.');
    this.navCtrl.navigateRoot('/login');
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }

  get f() { return this.form.controls; }
}
