import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    senha: [null, Validators.required]
  })

  signupForm = this.formBuilder.group({
    nome: [null, Validators.required],
    email: [null, Validators.required],
    senha: [null, Validators.required],
  })

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  onSubmitLoginForm(): void {
  }

  onSubmitSignupForm(): void {
    this.signupForm.reset();
  }
}
