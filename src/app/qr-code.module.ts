import { NgModule } from '@angular/core';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  imports: [
    QrCodeModule
  ],
  exports: [
    QrCodeModule
  ]
})
export class MyQrCodeModule { }
