import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-pengumuman',
  templateUrl: './pengumuman.page.html',
  styleUrls: ['./pengumuman.page.scss'],
  standalone: false,
})
export class PengumumanPage implements OnInit {
 
   
   constructor(private navCtrl: NavController) {}
 
   goBack() {
     this.navCtrl.navigateBack('/dashboard'); 
     // 🔥 atau pakai pop() biar sesuai riwayat navigasi
     // this.navCtrl.back();
   }
  ngOnInit() {
  }

}
