import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { SignUpUserResponse } from 'src/app/models/interfaces/user/SignUpUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/AuthResponse';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient, private cookie: CookieService) { }

  signUpUser(requestData: SignUpUserRequest): Observable<SignUpUserResponse> {
    return this.http.post<SignUpUserResponse>(`${this.API_URL}/user`, requestData);
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth`, requestData);
  }

  isLoggedIn(): boolean {
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN ? true : false;
  }
}
