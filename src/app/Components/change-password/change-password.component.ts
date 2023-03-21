import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm: FormGroup | any;
  hide=true;

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private apiService:ApiService,
    private _snackBar:MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required,Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close("No change in password");
  }

  onChangePassword(data:any): void {
    // Implement the logic to change the password
    console.log(data);
    if(data){
    this.apiService.updatePassword(data).subscribe((res)=>{
      console.log('response', res);
      if(res.success){
        console.log('Password Changed!!!!', res.message);
      this._snackBar.open(
        res.message,
        'OK',
        {
          duration: 5000,
        }
        );
        this.dialogRef.close("Password Changed!!!!");
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
  }else{
    this._snackBar.open(
      "Please enter the password to change else press Cancel",
      'OK',
      {
        duration: 5000,
      }
    );
  }
  }

}
