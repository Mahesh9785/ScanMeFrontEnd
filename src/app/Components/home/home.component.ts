import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/Services/api.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  qrCodeDownloadLink: SafeUrl | any;

  @ViewChild('qrInput') qrInputField: ElementRef|any;
  constructor(private apiService:ApiService){
  }

  generated:boolean=false;
  inputText: string='';
  qrData:string='';
  qrName:string='';
  qrCodeImagePath: string='';
  data:any;
  message:string|any;
  loggedInUser=JSON.parse(localStorage.getItem("myData") as string);

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
      // console.log(this.qrData)
      this.generated=true;
      this.qrName="QR Code Name : "+this.inputText;
      this.inputText='';
      this.qrInputField.nativeElement.focus();
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

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
    console.log(this.qrCodeDownloadLink);
  }

  saveQrCode(){
    fetch(this.qrCodeDownloadLink)
      .then(response => response.blob())
      .then(blob =>{
        const folderPath = `user_images/user_${this.loggedInUser._id}`;
        const fileName = `image_${Date.now()}.png`;
        saveAs(blob, `${folderPath}/${fileName}`);
        console.log(`${folderPath}/${fileName}`);
        this.qrCodeImagePath=`${folderPath}/${fileName}`;
      })
      .catch(error => console.error(error));


    this.data={
      userId: this.loggedInUser._id,
      qrName:this.qrData,
      qrCode:this.qrCodeImagePath,
    }
    console.log(this.data);
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
