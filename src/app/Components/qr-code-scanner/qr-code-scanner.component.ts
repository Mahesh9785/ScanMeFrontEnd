import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.css']
})
export class QrCodeScannerComponent implements AfterViewInit{

  @ViewChild('scanner')scanner: ZXingScannerComponent|any;

  BarcodeFormat: BarcodeFormat.QR_CODE |any;
  flag=false;
  result: any;

  ngAfterViewInit() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      // Select the device you want to use (usually the back camera)
      const backCamera = devices.find((device) => device.label.includes('back')) || devices[0];
      this.scanner.changeDevice(backCamera);
    });

    this.scanner.startScan();
  }


// Handle a successful scan by logging the result to the console
onScanSuccess(result: string|any) {
  console.log('Scanned successfully:', result);
  this.scanner.reset();
  this.result=result;
  this.flag=true;
  alert("The Scanned result is"+result)
}

// Handle an unsuccessful scan by logging the error to the console
onScanError(error: Error|any) {
  console.error('Error while scanning:', error);
}


}
