import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap'

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
    private formBuilder: FormBuilder,
    private router:Router,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
     // @ts-ignore
     

     
    //  window.onGoogleLibraryLoad = () => {
    //   //@ts-ignore
    //   google.accounts.id.initialize({
    //     client_id: '93789025494-p83u7qfgrlqdc7kv4knm924knd83vlok.apps.googleusercontent.com',
    //     callback: this.credentialResponse.bind(this),
    //     auto_select: false,
    //     cancel_on_tap_outside: true,
    //   });
    //   // @ts-ignore
    //   google.accounts.id.renderButton(
    //     // @ts-ignore
    //     document.getElementById('google-button'),
    //     { theme: 'outline', size: 'large', width: '100%' }
    //   );
    //   // @ts-ignore
    //   google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    // };




    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => {
      // Initialize and render the Google Sign-In button after the script has loaded
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '93789025494-p83u7qfgrlqdc7kv4knm924knd83vlok.apps.googleusercontent.com',
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
  
    // Append the script to the document to load the Google Identity Services library
    document.head.appendChild(script);







    
  }

  private credentialResponse(response: CredentialResponse) {
    this.authService
      .LoginWithGoogle(response.credential)
      .subscribe((x: any) => {
        this.zone.run(() => {
          if (x.statusCode === 200) {
            // Registration successful
        this.toastr.success('Google Registration successful!', 'Success');
        // Redirect to login page or perform other actions
        this.router.navigate(['/login']);

            //this.router.navigateByUrl('/login');
          } else {
            this.errorMessage = 'Google Registration failed. Please try again.';
            this.toastr.error(this.errorMessage, 'Error');
          }
        });
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
        this.router.navigate(['/login']);
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
