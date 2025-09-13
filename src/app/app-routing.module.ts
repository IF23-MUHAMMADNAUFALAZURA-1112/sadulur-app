import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then(m => m.WelcomePageModule),
    data: { showNavbar: false } // navbar disembunyikan
  },
  {
    path: 'registrasi',
    loadChildren: () =>
      import('./registrasi/registrasi.module').then(m => m.RegistrasiPageModule),
    data: { showNavbar: false }
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(m => m.LoginPageModule),
    data: { showNavbar: false }
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    data: { showNavbar: true }
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfilePageModule),
    data: { showNavbar: false }
  },
  {
    path: 'laporan',
    loadChildren: () =>
      import('./laporan/laporan.module').then(m => m.LaporanPageModule),
    data: { showNavbar: true }
  },
  {
    path: 'pengumuman',
    loadChildren: () =>
      import('./pengumuman/pengumuman.module').then(m => m.PengumumanPageModule),
    data: { showNavbar: true }
  },
  {
    path: 'password',
    loadChildren: () =>
      import('./password/password.module').then(m => m.PasswordPageModule),
    data: { showNavbar: false }
  },
  {
    path: 'telepon',
    loadChildren: () =>
      import('./telepon/telepon.module').then(m => m.TeleponPageModule),
    data: { showNavbar: true }
  },
  {
    path: 'informasi',
    loadChildren: () => import('./informasi/informasi.module').then( m => m.InformasiPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
