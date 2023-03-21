import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup | any;
  hide=true;

  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    private apiService:ApiService,
    private _snackBar:MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChangePassword(data:any): void {
    //Logic to change the password
    this.apiService.resetPass(data).subscribe((res)=>{
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

}
