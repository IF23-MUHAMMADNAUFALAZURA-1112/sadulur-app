import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {

  
  constructor(private navCtrl: NavController) {}

  goBack() {
    this.navCtrl.navigateBack('/dashboard'); 
    // 🔥 atau pakai pop() biar sesuai riwayat navigasi
    // this.navCtrl.back();
  }



  ngOnInit() {
  }

}
