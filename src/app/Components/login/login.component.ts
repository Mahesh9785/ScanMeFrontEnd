import { Component, NgZone, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  hide = true; // for password toggle
  loginForm: FormGroup | any;
  data: any;
  msg = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private ngZone: NgZone,
    private routes: Router,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }
  ngOnInit(): void {}

  onSubmit(data: any) {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      //authentication service
      this.apiService.verifyUser(data).subscribe(
        (res) => {
          this.data = res.data;
          console.log(res);
          if(res.data){
            if (this.data.email == data.email) {
              localStorage.setItem('isLoggedIn', 'true');

              localStorage.setItem('myData', JSON.stringify(this.data));

            this.ngZone.run(() => this.routes.navigateByUrl('/home'));
          } else {
            this.msg = res.message;
          }
        }else{
          this.msg=res.message;
        }
        },
        (error) => {
          console.log('Error:', error);
          this.msg =
            'Invalid username or password. If you are a new user, please register ';
          // Handle the error
        }
      );
    }
  }

  openForgotPasswordForm(): void {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
