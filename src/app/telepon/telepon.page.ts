import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface KontakDarurat {
  id: number;
  nama: string;
  nomor: string;
}

@Component({
  selector: 'app-telepon',
  templateUrl: './telepon.page.html',
  styleUrls: ['./telepon.page.scss'],
  standalone: false
})
export class TeleponPage implements OnInit {

  kontakList: KontakDarurat[] = [
    { id: 1, nama: 'Polisi', nomor: '110' },
    { id: 2, nama: 'Ambulans', nomor: '118' },
    { id: 3, nama: 'Damkar', nomor: '113' },
    { id: 4, nama: 'SAR Nasional (BASARNAS)', nomor: '115' },
    { id: 5, nama: 'Palang Merah Indonesia', nomor: '(021) 7992325' },
    { id: 6, nama: 'BNPB (Bencana)', nomor: '117' },
    { id: 7, nama: 'Konseling Kesehatan Jiwa (Kemenkes)', nomor: '119 ext 8' },
    { id: 8, nama: 'Layanan Darurat Nasional', nomor: '112' },
    { id: 9, nama: 'Ketua RT 01', nomor: '0812-3456-7890' },
    { id: 10, nama: 'Ketua RW 05', nomor: '0821-9876-5432' }
  ];

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {}

  async copyNumber(nomor: string) {
    try {
      await navigator.clipboard.writeText(nomor);

      // 🔥 tampilkan toast
      const toast = await this.toastCtrl.create({
        message: 'Nomor telepon disalin!',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (err) {
      console.error('Gagal menyalin nomor:', err);
    }
  }
}
