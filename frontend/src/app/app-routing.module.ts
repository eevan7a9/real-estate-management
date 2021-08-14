import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'map',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'properties',
    loadChildren: () => import('./properties/properties.module').then( m => m.PropertiesPageModule)
  },
  {
    path: 'enquiries',
    loadChildren: () => import('./enquiries/enquiries.module').then( m => m.EnquiriesPageModule)
  },
  {
    path: 'mortgage-calc',
    loadChildren: () => import('./mortgage-calc/mortgage-calc.module').then( m => m.MortgageCalcPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
