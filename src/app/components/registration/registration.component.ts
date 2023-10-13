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
     

     
     window.onGoogleLibraryLoad = () => {
      //@ts-ignore
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




  //   const script = document.createElement('script');
  //   script.src = 'https://accounts.google.com/gsi/client';
  //   script.onload = () => {
  //     // Initialize and render the Google Sign-In button after the script has loaded
  //     // @ts-ignore
  //     google.accounts.id.initialize({
  //       client_id: '131259041588-7lrt26av8rp1nm0tf3m6vq0bpaj3b23g.apps.googleusercontent.com',
  //       callback: this.credentialResponse.bind(this),
  //       auto_select: false,
  //       cancel_on_tap_outside: true,
  //     });
  
  //     // @ts-ignore
  //     google.accounts.id.renderButton(
  //       // @ts-ignore
  //       document.getElementById('google-button'),
  //       { theme: 'outline', size: 'large', width: '100%' }
  //     );
  
  //     // @ts-ignore
  //     google.accounts.id.prompt((notification: PromptMomentNotification) => {});
  //   };
  
  //   // Append the script to the document to load the Google Identity Services library
  //   document.head.appendChild(script);







    
  // }

  private credentialResponse(response: CredentialResponse) {
    this.authService
      .LoginWithGoogle(response.credential)
      .subscribe(
        (x: any) => {
          console.log("a", x);
          this.zone.run(() => {
            // Registration successful
            this.toastr.success('Google Registration successful!', 'Success');
            // Redirect to login page or perform other actions
            this.router.navigate(['/login']);
          });
        },
        (error: any) => {
          console.log(error);
          // Handle login error if needed
        }
      );
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

