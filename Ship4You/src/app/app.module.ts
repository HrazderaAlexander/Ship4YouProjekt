import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


//Forms
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
// App routing modules
import { AppRoutingModule } from './shared/routing/app-routing.module';

// App components
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserDetailsComponent} from './components/user-details/user-details.component';

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { DropzoneDirective } from './dropzone.directive';

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule,  MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatMenuModule, MatSliderModule } from '@angular/material';

// Create Boad
import { HttpClientModule } from '@angular/common/http';

//FileUpload
//import { FileDropDirective, FileSelectDirective} from 'ng2-file-upload';

//Elevation
import { MaterialElevationDirective } from './material-elevation.directive';

//Image Slider
import { NgImageSliderModule } from 'ng-image-slider';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { CreateBoatComponent } from './components/boats/create-boat/create-boat.component';
import { BoatDetailsComponent } from './components/boats/boat-details/boat-details.component';
import { BewertungComponent } from './components/bewertung/bewertung.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatBadgeModule} from '@angular/material/badge';
import { CreateFeedbackComponent } from './create-feedback/create-feedback.component';
import { MultiplePicturesComponent } from './multiple-pictures/multiple-pictures.component';

import { FirebaseService } from '../app/shared/services/firebase.service';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';
import { EditFeedbackComponent } from './edit-feedback/edit-feedback.component';
import { EditBoatComponent } from './edit-boat/edit-boat.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    UserDetailsComponent,
    DropzoneDirective,
    BoatDetailsComponent,
    CreateBoatComponent,
    BewertungComponent,
    ConfirmDialogComponent,
    MaterialElevationDirective,
    CreateFeedbackComponent,
    MultiplePicturesComponent,
    ContactUsComponent,
    AboutUsComponent,
    ImageSliderComponent,
    EditFeedbackComponent,
    EditBoatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatStepperModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
	  MatProgressSpinnerModule,
    NgImageSliderModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatButtonModule,
    NgxSliderModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MatListModule,
    MatBadgeModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
  providers: [AuthService, DatePipe, FirebaseService],
  bootstrap: [AppComponent]
})

export class AppModule { }
