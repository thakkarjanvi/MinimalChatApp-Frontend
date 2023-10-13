import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  user: User = new User('', '', ''); // Initialize an empty user
  errorMessage: string = '';
  

  constructor(private authService: AuthService, private fb: FormBuilder,  private toastr: ToastrService, private router:Router,  private zone: NgZone) {}

  ngOnInit(): void {
    // Initialize the loginForm with FormBuilder
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '131259041588-7lrt26av8rp1nm0tf3m6vq0bpaj3b23g.apps.googleusercontent.com',
        callback: this.credentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('google-button'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  private credentialResponse(response: CredentialResponse) {
    this.authService
      .LoginWithGoogle(response.credential)
      .subscribe(
        (x: any) => {
          console.log("a", x);
          this.zone.run(() => {
            // Registration successful
            this.toastr.success('Google Login successful!', 'Success');
            // Redirect to login page or perform other actions
            this.router.navigate(['/chat']);
            console.log("hi");
          });
        },
        (error: any) => {
          console.log(error);
          // Handle login error if needed
        }
      );
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
