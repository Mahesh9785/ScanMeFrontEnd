import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  @ViewChild('qrCanvas') qrCanvas: ElementRef | any;

  constructor(private apiService:ApiService){}

  generated:boolean=false;
  inputText: string='';
  qrData:string='';
  qrCodeImage: string='';
  data:any;
  message:string|any;
  loggedInUser:any=localStorage.getItem("myData");

  generateQRCode() {
    if(this.inputText=='' || this.inputText==null){
      this.message='Please enter Some text to generate a QR code';
      alert(this.message);
    }else{
    if(this.onContactInput(this.inputText)){
      this.qrData=`tel:`+this.inputText;
    }
    else if(this.onEmailInput(this.inputText)){
      this.qrData=`mailto:`+this.inputText;
    }
    else{
    this.qrData=this.inputText;
  }
  console.log(this.qrData)
  this.generated=true;
  }
}

  onContactInput(inputText:string) : boolean {
    const pattern = /^[0-9]*$/;
    if (pattern.test(inputText)) {
      return true;
    }else{
      return false;
    }

  }
  onEmailInput(inputText:string) : boolean {
    const pattern =  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/;
    if (pattern.test(inputText)) {
      return true;
    }else{
      return false;
    }
  }

  saveQrCode(){
    const canvas = this.qrCanvas.nativeElement;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      context.drawImage(img, 0, 0);
      this.qrCodeImage = canvas.toDataURL('image/png');
    };
    img.src = canvas.toDataURL();
    this.data={
      userId: this.loggedInUser._id,
      qrName:this.qrData,
      qrCode:this.qrCodeImage
    }
    this.apiService.saveQr(this.data).subscribe(
      (res) => {
        console.log('QR code saved successfully:', res);
      },
      (error) => {
        console.error('Error saving QR code:', error);
      }
    )
  }


}
