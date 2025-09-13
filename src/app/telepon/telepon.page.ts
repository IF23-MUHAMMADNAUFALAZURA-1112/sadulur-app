import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

interface KontakDarurat {
  id: number;
  nama: string;
  nomor: string;
  type?: 'tel' | 'wa'; // 🔥 tambahkan type
}

@Component({
  selector: 'app-telepon',
  templateUrl: './telepon.page.html',
  styleUrls: ['./telepon.page.scss'],
  standalone: false
})
export class TeleponPage implements OnInit {

  kontakList: KontakDarurat[] = [
    { id: 1, nama: 'Polisi', nomor: '110', type: 'tel' },
    { id: 2, nama: 'Ambulans', nomor: '118', type: 'tel' },
    { id: 3, nama: 'Damkar', nomor: '113', type: 'tel' },
    { id: 4, nama: 'SAR Nasional (BASARNAS)', nomor: '115', type: 'tel' },
    { id: 5, nama: 'Palang Merah Indonesia', nomor: '(021) 7992325', type: 'tel' },
    { id: 6, nama: 'BNPB (Bencana)', nomor: '117', type: 'tel' },
    { id: 7, nama: 'Konseling Kesehatan Jiwa (Kemenkes)', nomor: '119 ext 8', type: 'tel' },
    { id: 8, nama: 'Layanan Darurat Nasional', nomor: '112', type: 'tel' },
    { id: 9, nama: 'Ketua RT 01', nomor: '081234567890', type: 'wa' },
    { id: 10, nama: 'Ketua RW 05', nomor: '082198765432', type: 'wa' }
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

  // 🔥 helper untuk generate href sesuai type
  getContactHref(kontak: KontakDarurat): string {
    if (kontak.type === 'wa') {
      return 'https://wa.me/' + kontak.nomor.replace(/[^0-9]/g, '');
    }
    return 'tel:' + kontak.nomor;
  }
}
