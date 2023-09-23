import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  user: User = new User('', '', ''); // Initialize an empty user
  errorMessage: string = '';
  

  constructor(private authService: AuthService, private fb: FormBuilder,  private toastr: ToastrService, private router:Router) {}

  ngOnInit() {
    // Initialize the loginForm with FormBuilder
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const user = this.loginForm.value;

    this.authService.loginUser(user).subscribe(
      (response) => {
        console.log(response.token);
        
        // Login successful
        this.toastr.success('Login successful!', 'Success');
        // Store JWT token in local storage
        localStorage.setItem('token', response.token); 
        localStorage.setItem('user', JSON.stringify(response));


        // Redirect to chat route
        // You can use Router to navigate to the chat route
        this.router.navigate(['/chat']);
      },
      (error) => {
        // Handle login failure and display relevant error message
        this.errorMessage = 'Login failed. Please try again.';
        this.toastr.error(this.errorMessage, 'Error');
      }
    );
  }

}
}
