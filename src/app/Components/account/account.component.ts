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

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent {

  @ViewChild('fileInput') fileInputRef!: ElementRef | any;

  accountForm: FormGroup | any;

  hide = true;
  public imageUrl: string = '';
  isClicked: boolean = false;
  profileImageUrl: string = 'https://via.placeholder.com/400x400';

  openFileDialog() {
    this.fileInputRef.nativeElement.click();
  }

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
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
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: this.confirmPasswordValidator('password', 'confirmPassword'),
      }
    );
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

  onSubmit() {
    // Submit the form data
  }

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

  onFileSelected(event: Event | any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileImageUrl = reader.result as string;
    };
  }
}
