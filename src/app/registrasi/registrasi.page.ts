import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

// Capacitor Camera
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-registrasi',
  templateUrl: './registrasi.page.html',
  styleUrls: ['./registrasi.page.scss'],
  standalone: false,
})
export class RegistrasiPage {
  form!: FormGroup;

  // toggle show/hide
  showPass = true; // utama
  showPass2 = false; // jika butuh untuk konfirmasi

  // alias agar template yang masih pakai showPassword tidak error
  get showPassword(): boolean {
    return this.showPass;
  }
  set showPassword(v: boolean) {
    this.showPass = v;
  }
  get showPassword2(): boolean {
    return this.showPass2;
  }
  set showPassword2(v: boolean) {
    this.showPass2 = v;
  }

  // preview foto
  photoPreview: string | null = null;

  // batas ukuran file 5MB
  private readonly MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

  constructor(
    private fb: FormBuilder,
    private nav: NavController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        nik: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|.*\.co\.id|.*\.id)$/
            ),
          ],
        ],

        whatsapp: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        password: ['', [Validators.required, Validators.maxLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(8)]],
        // foto wajib; tipe dicek via validator khusus
        photo: ['', [Validators.required, this.imageTypeValidator()]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  // Validator: konfirmasi password sama
  private passwordsMatchValidator = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password')?.value ?? '';
    const confirm = group.get('confirmPassword')?.value ?? '';
    return pass && confirm && pass !== confirm
      ? { passwordsMismatch: true }
      : null;
  };

  // Validator tipe gambar: hanya jpg/jpeg/png (menerima ekstensi atau dataURL)
  private imageTypeValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '') as string;
      if (!v) return null; // 'required' ditangani validator lain

      const lowered = v.toLowerCase();
      const ok =
        lowered.endsWith('.jpg') ||
        lowered.endsWith('.jpeg') ||
        lowered.endsWith('.png') ||
        lowered === 'jpg' ||
        lowered === 'jpeg' ||
        lowered === 'png' ||
        lowered.startsWith('data:image/jpeg') ||
        lowered.startsWith('data:image/png');

      return ok ? null : { invalidImageType: true };
    };
  }

  // Toggle mata
  togglePass() {
    this.showPass = !this.showPass;
  }
  togglePass2() {
    this.showPass2 = !this.showPass2;
  }

  goBack() {
    this.nav.back();
  }

  // --- PILIH FOTO (kamera/galeri via Capacitor) ---
  async pickImage() {
    try {
      if (Capacitor.getPlatform() !== 'web') {
        const photo = await Camera.getPhoto({
          quality: 70,
          allowEditing: false,
          resultType: CameraResultType.Uri, // dapat webPath untuk preview
          source: CameraSource.Prompt, // Camera atau Photos (galeri)
          saveToGallery: false,
        });

        const format = (photo.format || '').toLowerCase(); // 'jpeg' / 'png'
        if (!['jpeg', 'jpg', 'png'].includes(format)) {
          await this.showAlert(
            'Format tidak didukung',
            'Hanya JPG/PNG yang diperbolehkan.'
          );
          return;
        }

        const webPath = photo.webPath;
        if (!webPath) {
          await this.showAlert('Gagal memuat foto', 'Silakan coba lagi.');
          return;
        }

        const resp = await fetch(webPath);
        const blob = await resp.blob();
        if (blob.size > this.MAX_PHOTO_SIZE) {
          await this.showAlert('Ukuran terlalu besar', 'Maksimal 5MB.');
          return;
        }

        // Set preview & kontrol form
        this.photoPreview = webPath;
        this.setPhotoControl(format); // simpan 'jpeg'/'png' agar lolos validator tipe
        return;
      }

      // Fallback untuk web/PWA: klik input file yang hidden
      const el = document.querySelector(
        'input[type=file]'
      ) as HTMLInputElement | null;
      el?.click();
    } catch {
      // user cancel / error plugin: biarkan tanpa alert
    }
  }

  // --- Fallback file input (web/PWA) ---
  async onFilePicked(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const mime = file.type; // 'image/jpeg' / 'image/png'
    if (!['image/jpeg', 'image/png'].includes(mime)) {
      await this.showAlert(
        'Format tidak didukung',
        'Hanya JPG/PNG yang diperbolehkan.'
      );
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

    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Simpan ekstensi agar lolos validator tipe
    const ext = mime === 'image/png' ? 'png' : 'jpeg';
    this.setPhotoControl(ext);
  }

  private setPhotoControl(extOrMarker: string) {
    this.form.patchValue({ photo: extOrMarker });
    const ctrl = this.form.get('photo');
    ctrl?.markAsDirty();
    ctrl?.updateValueAndValidity();
  }

  // Submit
  async submit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      await this.showAlert(
        'Form belum lengkap',
        'Silahkan lengkapi data terlebih dahulu.'
      );
      return;
    }

    const payload = { ...this.form.value };
    delete (payload as any).confirmPassword;

    // TODO: panggil API register + kirim file foto sesuai kebutuhan backend kamu.

    const alert = await this.alertCtrl.create({
      header: 'Berhasil',
      message: 'Akun berhasil dibuat. Silakan login.',
      buttons: [
        {
          text: 'OK',
          handler: () => this.nav.navigateRoot(['/login']),
        },
      ],
    });
    await alert.present();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message, // ion-alert boleh HTML sederhana (br)
      buttons: ['Tutup'],
    });
    await alert.present();
  }

  get f() {
    return this.form.controls;
  }
}
