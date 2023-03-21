import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private _snackBar:MatSnackBar,
    ){}

  qrCodeImageUrlForMail: File|any;
  disabled=false;
  showAddQR=false;
  qrcodes=false;
  generated:boolean=false;
  inputText: string='';
  qrData:string='';
  qrName:string='';
  qrCodeImageUrl='';
  qrCodeName='';
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
    if(this.inputText=='' || this.inputText==null || this.qrCodeName=='' || this.qrCodeName==null){
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
      this.qrName="QR Code Text : "+this.inputText;
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
    this.inputText='';
    this.showAddQR=false;
    fetch(this.qrCodeDownloadLink)
    .then(res => res.blob())
    .then(blob =>  {
      this.qrCodeImagePath = new File([blob], this.qrCodeName+".jpeg", { type: 'image/jpeg' });
      console.log(this.qrCodeImagePath);
      const formData = new FormData();
      formData.append('file', this.qrCodeImagePath);
      formData.append('userId', this.loggedInUser._id );
      formData.append('qrName', this.qrCodeName );
      formData.append('qrData', this.qrData );
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

  sendQrCodeByEmail(imagePath:string) {
    // fetch('http://localhost:3000/public/QR_Codes/' + this.loggedInUser._id + '/' + imagePath)
    // .then(res => res.blob())
    // .then(blob =>  {
    //   this.qrCodeImageUrlForMail = new File([blob], imagePath, { type: 'image/jpeg' });
    //   console.log(this.qrCodeImagePath);
    // });
    // const formDataForMail = new FormData();
    // console.log(this.qrCodeImageUrlForMail)
    // console.log(this.loggedInUser.email)

    //   formDataForMail.append('file', this.qrCodeImageUrlForMail);
    //   formDataForMail.append('email', this.loggedInUser.email );
    //   console.log(formDataForMail);
    this.apiService.sendEmail({email:this.loggedInUser.email,filename:imagePath}).subscribe((res)=>{
      if(res.success){
        this._snackBar.open(
          res.message,
          'OK',
          {
            duration: 5000,
          }
        );
      }else{
        console.log('Error', res);
      this._snackBar.open(
        res.message,
        'OK',
        {
          duration: 5000,
        }
      );
      }
    })
  }

  editQrCode(qrName:string,qrData:string) {
    this.showAddQR=true;
    this.qrCodeName=qrName;
    this.inputText=qrData;
    this.disabled=true;
    this.generateQRCode();
  }

  async downloadQrCode(imagePath: string) {

  const response = await fetch('http://localhost:3000/public/QR_Codes/' + this.loggedInUser._id + '/' + imagePath, {
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  });
   const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    link.download = fileName;
    link.href = url;

    console.log(link);
    console.log(fileName);

    link.addEventListener('load', () => {
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    });

    document.body.appendChild(link);

    link.click();
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
