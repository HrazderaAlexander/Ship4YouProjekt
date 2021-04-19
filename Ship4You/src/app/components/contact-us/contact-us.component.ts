import { Component, HostListener } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConnectionService } from 'src/app/shared/services/connection.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {

  /**
   * 
   * @param authService 
   * @param router 
   * @param fb 
   * @param connectionService 
   */
  constructor(public authService: AuthService, public router: Router, private fb: FormBuilder, private connectionService: ConnectionService)
  {
    /**
     * Set the validations and fields of the form
     */
    this.contactForm = fb.group({
      'contactFormName': ['', Validators.required],
      'contactFormEmail': ['', Validators.compose([Validators.required, Validators.email])],
      'contactFormSubjects': ['', Validators.required],
      'contactFormMessage': ['', Validators.required]
      });
  }

  /**
   * Define the form
   */
contactForm: FormGroup;

/**
 * Save the state of the submit button
 */
disabledSubmitButton: boolean = true;

/**
 * Array to save all options
 */
optionsSelect: Array<any>;


/**
 * Decorator that declares a DOM event to listen for, and provides a handler method to run when that event occurs.
 */
  @HostListener('input') oninput() {

    /**
     * Check if form is valid
     */
    if (this.contactForm.valid) {

      /**
       * make submit button visble
       */
      this.disabledSubmitButton = false;
    }
  }

  /**
   * Methode to send the message
   */
  onSubmit() {
    /**
     * Send the message
     */
    this.connectionService.sendMessage(this.contactForm.value).subscribe(() => {
      alert('Your message has been sent.');
      /**
       * Reset the form
       */
      this.contactForm.reset();
      /**
       * Disable submit button
       */
      this.disabledSubmitButton = true;
    }, error => {
      console.log('Error', error);
    });
  }

  /**
   * Methode to switch to dashboard
   */
  goToDashboard(){
    this.router.navigateByUrl("/dashboard");
  }
}
