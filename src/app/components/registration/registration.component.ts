import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  user: User = new User('', '', ''); // Initialize an empty user
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const user = this.registerForm.value;

    this.authService.registerUser(user).subscribe(
      (response) => {
        // Registration successful
        this.toastr.success('Registration successful!', 'Success');
        // Redirect to login page or perform other actions
      },
      (error) => {
        // Registration failed
        this.errorMessage = 'Registration failed. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    );
  }

  }
}
