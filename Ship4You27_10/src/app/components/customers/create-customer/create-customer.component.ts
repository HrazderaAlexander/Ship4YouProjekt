import { Route } from '@angular/compiler/src/core';
import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Picture } from 'src/app/Picture';
import { ImageService } from 'src/app/shared/image.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { map } from 'rxjs/operators';
import { Customer } from '../customer';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {

  customer: Customer = new Customer();
  submitted = false;
  customers: Customer[] = [];

  ID : string[] = [];
  IDCounter : number = 0;
  boolCheck : boolean = false;

  constructor(private customerService: CustomerService, private router: Router, public authService: AuthService,
    public ngZone: NgZone,
    private afs: AngularFirestore, private service: ImageService
) { }

  ngOnInit() {
    this.getCustomer();
  }

  newCustomer(): void {
    this.submitted = false;
    this.customer = new Customer();
  }

  save() {
    //this.customer.imageUrl = "https://firebasestorage.googleapis.com/v0/b/ship4you-36b43.appspot.com/o/1600897207082_Retana24.jpeg?alt=media&token=bc63b384-7b18-437e-bd86-9b4e13dd05ae";
    this.customer.imageUrl = localStorage.getItem('downloadUrl');
    this.customer.documentUrl = localStorage.getItem('downloadDocumentUrl');
    this.customer.userId = localStorage.getItem('userUid');
    this.customer.allReatings = [0];
    this.customer.rating = 0;
    this.customerService.createCustomer(this.customer);
    this.customer = new Customer();
  }

  isHovering: boolean;

  files: File[] = [];
  filesDocuments: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateFile(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .jpeg, .jpg, .png)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.files.push(files.item(i));
        }
        else{
          alert("All fields are required!");
        }
      }
    }
  }

  onDropDocument(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateDocument(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .docx, .pdf, .xlsx, .txt)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.filesDocuments.push(files.item(i));
        }
        else{
          alert("All fields are required!");
        }
      }
    }
  }


  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'jpg') {
        return true;
    }
    else {
        return false;
    }
}
validateDocument(name: String) {
  var ext = name.substring(name.lastIndexOf('.') + 1);
  if (ext.toLowerCase() == 'docx' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'xlsx') {
      return true;
  }
  else {
      return false;
  }
}

  onSubmit() {
    this.submitted = true;
    this.save();
    this.router.navigateByUrl("/dashboard");
  }

  getCustomer(){
    this.customerService.getCustomersList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {

      this.customers = customers;
    });
  }

    checkID() : number{
      this.IDCounter = 0;
      for(let i = 0; i < this.customers.length; i++)
      {
        console.log(this.customers[i].brand+this.customers[i].name);
        this.ID[this.IDCounter] = this.customers[i].brand+this.customers[i].name;
        this.IDCounter++;  
      }
      console.log(this.IDCounter);

    for(var i = 0; i< this.IDCounter; i++){
      if(this.ID[i] === this.customer.brand+this.customer.name){
        this.boolCheck = false;
        return 0;
      }
      else if(this.customer.brand == "" ||  this.customer.name == ""){
        this.boolCheck = false;
        return 1;
      }
      else
        this.boolCheck = true;
    }
    if(this.customer.brand == null ||  this.customer.name == null || this.customer.cabins == null ||this.customer.length == null || this.customer.lessor == null
      || this.customer.location == null || this.customer.masts == null || this.customer.numberOfPeople == null || this.customer.vintage == null || this.customer.sail == null){
        this.boolCheck = false;
        return 2;
    }

    if(this.boolCheck)
      return -1;
    else
      this.IDCounter = 0;

  }
}
