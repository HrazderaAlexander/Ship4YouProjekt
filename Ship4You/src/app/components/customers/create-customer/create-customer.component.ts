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

interface Types {
  value: string;
  viewValue: string;
}

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

  isHovering: boolean;

  files: File[] = [];
  filesDocuments: File[] = [];
  filesPictures: File[] = [];

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  types: Types[] = [
    {value: 'Sailingboat', viewValue: 'Sailingboat'},
    {value: 'Motorboat', viewValue: 'Motorboat'}
  ]

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

  onDropMult(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      //Picture.saveFilePath = this.boatBrand + this.boatName;
      if (!this.validateFile(files[0].name)) {
        console.log('Selected file format is not supported');
        alert("Selected file format is not supported! (Allowed: .jpeg, .jpg, .png)");
        return false;
      }
      else{
        if(this.checkID() == -1){
          this.filesPictures.push(files.item(i));
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
        console.log(localStorage.getItem("createBoatId"));
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
      || this.customer.location == null || this.customer.masts == null || this.customer.numberOfPeople == null || this.customer.vintage == null || this.customer.sail == null || this.customer.port == null){
        this.boolCheck = false;
        return 2;
    }

    if(this.boolCheck)
      return -1;
    else
      this.IDCounter = 0;

  }

  goToMultUpload(){
    this.customerService.tmpBoat = this.customer;
    console.log("TmpBoat " + this.customerService.tmpBoat)
    localStorage.setItem('createBoatId', this.customer.brand+this.customer.name);
    console.log(localStorage.getItem("createBoatId"));
    this.router.navigateByUrl("multiple-upload");
  }
}
