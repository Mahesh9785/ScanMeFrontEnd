import { Injectable } from '@angular/core';
import { User } from 'src/app/Models/user';
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
  return this.httpClient.get(this.API_URL + '/getusers').pipe(
    catchError((error) => {
      // Handle the error
      console.error('Error fetching user', error);
      return throwError(() => new Error('Error fetching user'));
    })
  );
}

//save qr code
saveQr(data: any): Observable<any> {
  return this.httpClient
    .post(this.API_URL + '/save-qr', data, { responseType: 'json' })
    .pipe(
      catchError((error) => {
        // Handle the error
        console.error('Error saving qr', error);
        return throwError(() => new Error('Error saving qr'));
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
