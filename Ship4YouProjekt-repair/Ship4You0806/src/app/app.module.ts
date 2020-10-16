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
import { UploadTaskComponent } from './components/newboat/upload-task/upload-task.component';

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule,  MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, MatMenuModule } from '@angular/material';

// Create Boad
import { HttpClientModule } from '@angular/common/http';

//import { CreateUserComponent } from './components/newboat/create-user/create-user.component';
import {ShowUpload} from './components/newboat/showUpload';

//FileUpload
import { FileDropDirective, FileSelectDirective} from 'ng2-file-upload';

import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import { CustomersListComponent } from './components/customers/customers-list/customers-list.component';
import { CreateCustomerComponent } from './components/customers/create-customer/create-customer.component';
import { CustomerDetailsComponent } from './components/customers/customer-details/customer-details.component';
import { BewertungComponent } from './components/bewertung/bewertung.component';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    UserDetailsComponent,
    FileSelectDirective,
    FileDropDirective,
    ShowUpload,
    UploadTaskComponent,
    DropzoneDirective,
    CustomersListComponent,
    CustomerDetailsComponent,
    CreateCustomerComponent,
    BewertungComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }