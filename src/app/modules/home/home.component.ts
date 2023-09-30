import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom } from 'rxjs';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: [null, Validators.required]
  })

  signupForm = this.formBuilder.group({
    name: [null, Validators.required],
    email: [null, Validators.required],
    password: [null, Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService
  ) { }

  onSubmitLoginForm(): void {
    console.log('entrou aqui', this.loginForm.value)
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as unknown as AuthRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set('USER_INFO', response?.token);

              this.loginForm.reset();

            }
          },
          error: (err) => console.log(err),
        })
    }
  }

  onSubmitSignupForm(): void {
    if (this.signupForm.value && this.signupForm.valid) {
      this.userService.signUpUser(this.signupForm.value as unknown as SignUpUserRequest)
      .subscribe({
        next: (response) => {
          if (response) {
            alert('Usuário teste criado com sucesso!');
            this.signupForm.reset();
            this.loginCard = true;
          }
        },
      error: (err) => console.log(err),
      })
    }
  }
}
