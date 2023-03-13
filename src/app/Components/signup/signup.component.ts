import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/user';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup | any;
  hide = true;
  user:User[]=[];

  constructor(
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private apiService:ApiService,
    ) {}

  ngOnInit() {
    //defining validations for the form data
    this.signUpForm = this.formBuilder.group(
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
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: this.confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
  }

  onSubmit(data:any) {
    // Submit the form data
    console.log(data)
    this.apiService.registerUser(data).subscribe((res)=>{
      console.log("Registration Response",res);
      if (res['success']) {
        console.log('Data added!!!!', res.message);
        this.ngZone.run(() => this.router.navigateByUrl('/login'));
        this._snackBar.open(
          'Hello ' + data.name + ', Please Verify your email id',
          'OK',
          {
            duration: 5000,
          }
        );
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

  //
  confirmPasswordValidator(
    passwordControlName: string,
    confirmPasswordControlName: string
  ) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[passwordControlName];
      const confirmPasswordControl =
        formGroup.controls[confirmPasswordControlName];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['passwordsMismatch']
      ) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordsMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  onContactInput(event: any) {
    const input = event.target.value;
    const pattern = /^[0-9]*$/;
    if (!pattern.test(input)) {
      event.target.value = input.replace(/[^0-9]/g, '');
    }
  }
}
