import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

// Node/Express API
API_URL = 'http://localhost:3000';
userId:any;


// Http Header
httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

constructor(private httpClient: HttpClient) {}

// register new user
registerUser(data: any): Observable<any> {
  return this.httpClient
  .post(this.API_URL + '/register', data, { responseType: 'json' })
  .pipe(
    catchError((error) => {
      // Handle the error
      console.error('Error adding user', error);
      return throwError(() => new Error('Error adding user'));
    })
    );
  }

  // Verify user
  verifyUser(data:any): Observable<any> {
    console.log(data);
    return this.httpClient.post(this.API_URL + '/login', data).pipe(
      catchError((error) => {
        // Handle the error
        console.error('Error fetching user', error);
        return throwError(() => new Error('Error fetching user'));
      })
      );
    }

    // Get all users
    getUsers(): Observable<any> {
      this.userId=JSON.parse(localStorage.getItem("myData") as string);
      return this.httpClient.get(this.API_URL + `/getuser/${this.userId._id}`).pipe(
        catchError((error) => {
          // Handle the error
          console.error('Error fetching user', error);
          return throwError(() => new Error('Error fetching user'));
        })
        );
      }

      //save qr code
      saveQr(data: FormData): Observable<any> {
        this.userId=JSON.parse(localStorage.getItem("myData") as string);
        console.log(data);
        return this.httpClient
        .post(this.API_URL + `/save-qr/${this.userId._id}`, data, { responseType: 'json' })
        .pipe(
          catchError((error) => {
            // Handle the error
            console.error('Error saving qr', error);
            return throwError(() => new Error('Error saving qr'));
          })
    );
  }

  // update user
  updateUser(data: any): Observable<any> {
    this.userId=JSON.parse(localStorage.getItem("myData") as string);
    return this.httpClient
    .post(this.API_URL + `/update/${this.userId._id}`, data, { responseType: 'json' })
    .pipe(
      catchError((error) => {
        // Handle the error
        console.error('Error updating user', error);
        return throwError(() => new Error('Error updating user'));
      })
    );
  }

  //save profile picture
  saveProfilePicture(data: FormData): Observable<any> {
    this.userId=JSON.parse(localStorage.getItem("myData") as string);
    console.log(data);
    return this.httpClient
    .post(this.API_URL + `/save-profile-picture/${this.userId._id}`, data, { responseType: 'json' })
    .pipe(
      catchError((error) => {
        // Handle the error
        console.error('Error saving profile picture', error);
        return throwError(() => new Error('Error saving profile picture'));
      })
      );
    }

    // Get user profile picture
    getProfile(): Observable<any> {
      this.userId=JSON.parse(localStorage.getItem("myData") as string);
      return this.httpClient.get(this.API_URL + `/getProfile/${this.userId._id}`).pipe(
        catchError((error) => {
          // Handle the error
          console.error('Error fetching user profile', error);
          return throwError(() => new Error('Error fetching user profile'));
        })
        );
      }

      // Verify user
      getQRcodes(): Observable<any> {
        this.userId=JSON.parse(localStorage.getItem("myData") as string);
        return this.httpClient.get(this.API_URL + `/getQRCodes/${this.userId._id}`).pipe(
          catchError((error) => {
      // Handle the error
      console.error('Error fetching QRCodes', error);
      return throwError(() => new Error('Error fetching QRCodes'));
    })
  );
}


// Error
handleError(error: HttpErrorResponse) {
  let errorMessage = '';
  if (error.error instanceof ErrorEvent) {
    // Handle client error
    errorMessage = error.error.message;
  } else {
    // Handle server error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
}
}
