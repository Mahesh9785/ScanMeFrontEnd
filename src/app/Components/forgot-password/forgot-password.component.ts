import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup | any;
  hide=true;

  constructor(private dialogRef: MatDialogRef<ForgotPasswordComponent>,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onChangePassword(): void {
    // Implement the logic to change the password
  }

}
