import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ApiService } from 'src/app/Services/api.service';
import { environment } from 'src/app/Environments/environments';

interface MyFile extends File {
  url: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {

  @ViewChild('fileInput') fileInputRef!: ElementRef | any;

  baseURI: string = environment.apiUrl;
  files: File|any;
  imageSelected : boolean = false;
  selectedimg : string ="";
  imageFile: File = {} as File;
  userProfilePicture:string="./assets/profile-img.jpg"
  accountForm: FormGroup | any;
  disabled=false;
  flag=false;
  message='';
  loggedInUser:any;
  hide = true;
  isClicked: boolean = false;

  openFileDialog() {
    this.fileInputRef.nativeElement.click();
  }

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private apiService:ApiService,
    private _snackBar: MatSnackBar,
    ) {}

    ngOnInit() {
    this.loggedInUser=JSON.parse(localStorage.getItem("myData") as string);
    this.accountForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.maxLength(30)]],
        contact: [
          '',
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.minLength(10),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
      }
    );
      this.accountForm.controls['email'].disable();
    this.apiService.getProfile().subscribe((res)=>{
      console.log(res)
      const imagename=res.toString();
      if(imagename==''){
        this.userProfilePicture="./assets/profile-img.jpg"
      }else{
      this.userProfilePicture=`${this.baseURI}/public/Profiles/${imagename}`
    }
    })

      this.apiService.getUser().subscribe((res)=>{
        if(res.success){
          const currentUser=res.data;
          localStorage.setItem('myData',JSON.stringify(res.data))
          this.loggedInUser = JSON.parse(localStorage.getItem('myData') as string)

          this.accountForm.patchValue({
            name:currentUser.name,
            contact:currentUser.contact,
            email:currentUser.email,
          })
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

  openChangePasswordForm(): void {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  upload() {
    this.isClicked = true;
    console.log(this.isClicked);
  }

  onSubmit(data:any) {
    // Submit the form data
    if(this.accountForm.valid){
      this.apiService.updateUser(data).subscribe((res)=>{
        if(res.success){
          console.log('Data updated!!!!', res.message);
          this._snackBar.open(
            res.message,
            'OK',
            {
              duration: 5000,
            }
          );
              this.apiService.getUser().subscribe((res)=>{
                console.log(res)
                if(res.success){
                  localStorage.setItem('myData',JSON.stringify(res.data))
                  this.loggedInUser = JSON.parse(localStorage.getItem('myData') as string)
                  console.log(this.loggedInUser);
                  this._snackBar.open(
                    "Data successfully updated",
                    'OK',
                    {
                      duration: 5000,
                    }
                  );
                }else{
                  console.error("Error Fetching User");
                }
              })
      } else {
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
    this.uploadFiles();
    // console.log(localStorage.getItem('myData'))
  }

  onContactInput(event: any) {
    const input = event.target.value;
    const pattern = /^[0-9]*$/;
    if (!pattern.test(input)) {
      event.target.value = input.replace(/[^0-9]/g, '');
    }
  }

  editEmail(){
    this.accountForm.controls['email'].enable();
    this.disabled=true;
    this.flag=true;
  }

  sendVerificationEmail(email:string){
    if(email==this.loggedInUser.email){
      this.accountForm.controls['email'].disable();
      this.disabled=false;
      this.flag=false;
      console.log("No change in email id")
    }else{
      this.disabled=false;
      this.flag=false;
      this.accountForm.controls['email'].disable();
      this.apiService.updateEmail({userId:this.loggedInUser._id,email:email}).subscribe((res)=>{
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
    this.message='The Email will only be updated after you verify it'
  }
}

  onFileSelected(files: FileList | any) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      this.files=file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedimg = e?.target?.result as string;
        // store the selected image in a variable
        this.imageFile = file;
      };
      reader.readAsDataURL(file);
    }
    this.imageSelected = true;
    console.log(this.files);
  }

  showPreviewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.userProfilePicture = event.target.result;
        }
        reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadFiles(){
    if(this.files!==undefined){
    const formData = new FormData();
      formData.append('image', this.files, this.files.name);
      console.log(formData);
      this.apiService.saveProfilePicture(formData).subscribe((res)=>{

      })
    }
  }

}
