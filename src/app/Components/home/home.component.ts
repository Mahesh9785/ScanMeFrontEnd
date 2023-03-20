import { Component, ElementRef, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  qrCodeDownloadLink: SafeUrl | any;
  downloadQR: SafeUrl | any;

  @ViewChild('qrInput') qrInputField: ElementRef|any;
  constructor(
    private apiService:ApiService,
    ){}

  showAddQR=false;
  qrcodes=false;
  generated:boolean=false;
  inputText: string='';
  qrData:string='';
  qrName:string='';
  qrCodeImageUrl='';
  qrCodeImagePath: File|any;
  data:any;
  message:string|any;
  loggedInUser=JSON.parse(localStorage.getItem("myData") as string);

    ngOnInit(){
      this.apiService.getQRcodes().subscribe((res)=>{
        console.log(res);
        if(res.status){
          this.qrcodes=true;
          this.data=res.data;
        }else{
          this.qrcodes=false;
        }
      })
    }

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
    this.downloadQR=url;
    this.qrCodeDownloadLink = url.toString();
    console.log(url);
    const pattern =  /blob:https?:\/\/\S+/
    const match = this.qrCodeDownloadLink.match(pattern);
    if (match ? this.qrCodeDownloadLink= match[0] : this.qrCodeDownloadLink= null)
    console.log(this.qrCodeDownloadLink);
  }

  saveQrCode(){
    this.showAddQR=false;
    fetch(this.qrCodeDownloadLink)
    .then(res => res.blob())
    .then(blob =>  {
      this.qrCodeImagePath = new File([blob], this.qrData+".png", { type: 'image/png' });
      console.log(this.qrCodeImagePath);
      const formData = new FormData();
      formData.append('file', this.qrCodeImagePath);
      formData.append('userId', this.loggedInUser._id );
      formData.append('qrName', this.qrData );
      console.log(formData);
      this.apiService.saveQr(formData).subscribe(
        (res) => {
          console.log('QR code saved successfully:', res);
        },
        (error) => {
          console.error('Error saving QR code:', error);
        }
      )
    });
    setTimeout(()=>{
      window.location.reload();
    },1000)
  }

  sendQrCodeByEmail() {
    throw new Error('Method not implemented.');
  }

  editQrCode() {
    throw new Error('Method not implemented.');
  }

  downloadQrCode(imageUrl: string) {
  // define a method to download the image
  const headers=new Headers();
  headers.append('Access-Control-Allow-Origin', '*');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    if (xhr.status === 200) {
      const reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.saveImage(dataUrl);
      };
    }
  };
  xhr.send();
}

// define a method to save the image as a file
saveImage(dataUrl: string) {
  const link = document.createElement('a');
  link.download = 'image.png';
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


  showAddQRCard(){
    this.showAddQR=true;
    console.log(this.showAddQR)
  }


}
