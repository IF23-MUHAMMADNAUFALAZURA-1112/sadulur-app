import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-navigationbar',
  templateUrl: './btn-navigationbar.component.html',
  styleUrls: ['./btn-navigationbar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,   // untuk *ngIf, *ngFor dll
    IonicModule,    // supaya <ion-*> dikenali
    RouterModule    // untuk [routerLink]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // tambahan supaya Angular terima web components dari Ionic
})
export class BtnNavigationbarComponent {}
