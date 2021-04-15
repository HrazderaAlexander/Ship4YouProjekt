import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Subject} from 'rxjs';
import {startWith, map, window} from 'rxjs/operators';
import { NavigationEnd, Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BoatData } from 'src/app/BoatData';
import { Picture } from 'src/app/Picture';
import {Observable, combineLatest} from 'rxjs'
import { ImageService } from 'src/app/shared/image.service';
import { BoatService } from '../boats/boat.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { Options } from '@angular-slider/ngx-slider';
import { FavModel } from 'src/app/shared/services/favModel';
import { SignInComponent } from '../sign-in/sign-in.component';
import { auth } from 'firebase';
import { SignUpComponent } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  formatLabel(value: number) {
    return value + 'm';
  }
  formatLabelYear(value: number) {
    return value;
  }

  menuOpen:boolean = false;
  customers: any;
  selected = 'option2';

  favRef: AngularFirestoreDocument<any>;

  startAt = new Subject();
  endAt = new Subject();

  loc= ""
  boatName=""
  isLoaded: boolean = false;

  //Button
  locationButtonBool: boolean = true;
  nameButtonBool: boolean = true;

  //////
  searchLocationString:string="";
  searchBoatNameString:string="";
  searchLessorString:string="";
  searchBrandString:string="";
  searchPortString:string="";

  isUsedBoolean:Boolean = false;

  favModel: any;

  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();
//////////
navigationSubscription;

feedbackData : any;
favCustomer: any[] = [];
favCustomerSort: any[] = [];
countFav = 0;

showFav: boolean = false;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private afs: AngularFirestore, private service: ImageService, private boatService: BoatService
  )
  {

  }

  imageList: any[];
  rowIndexArray: any[];

  fav:boolean[]=[];

  size = 0;

  //length-Slider
  value: number = 0;
  highValue: number = 100;
  options: Options = {
    floor: 0,
    ceil: 100
  };
  //sails-Slider
  sailsValue: number = 0;
  sailsHighValue: number = 10;
  optionsSails: Options = {
    floor: 0,
    ceil: 10
  };
  //masts-Slider
  mastsValue: number = 0;
  mastsHighValue: number = 10;
  optionsMasts: Options = {
    floor: 0,
    ceil: 10
  };
  //cabins-Slider
  cabinsValue: number = 0;
  cabinsHighValue: number = 100;
  optionsCabins: Options = {
    floor: 0,
    ceil: 100
  };
  //year-Slider
  yearValue: number = 1800;
  yearHighValue: number = 2030;
  optionsYear: Options = {
    floor: 1800,
    ceil: 2030
  }
  //amountPeople-Slider
  amountPeopleValue: number = 1;
  amountPeopleHighValue: number = 100;
  optionsAmountPeople: Options = {
    floor: 1,
    ceil: 100
  };
  getValues(value, highValue){
    console.log(value);
    console.log(highValue);
  }
  allUserIds : string[] = [];
  userIdCounter = 0;

  myControl = new FormControl();
  namesControl = new FormControl();
  lessorControl = new FormControl();
  brandControl = new FormControl();
  portControl = new FormControl();
  //optionsArray: string[] = this.allLocations;
  filteredOptions: Observable<string[]>;
  filteredLocations: Observable<string[]>;
  filteredLessors: Observable<string[]>;
  filteredBrand: Observable<string[]>;
  filteredPort: Observable<string[]>;

  ngOnInit() {
    this.getCustomersList();
    this.afs.collection('users').valueChanges().subscribe(s => localStorage.setItem('size', `${s.length}`));

    const ref = this.afs.collection('users');
    const snapshot = ref.get();
    snapshot.forEach(doc => {
      doc.forEach(d => {
        this.allUserIds[this.userIdCounter] = d.id;
        this.userIdCounter++;
      })
      localStorage.setItem('userIds', JSON.stringify(this.allUserIds));
    });
  }
  files = [];

  getCustomersList() {
    this.boatService.getBoatsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(customers => {

      this.customers = customers.sort((n1, n2)=>
      {
        if (n1.rating < n2.rating) {
          return 1;
        }

        if (n1.rating > n2.rating) {
          return -1;
        }

        return 0;
      });
      localStorage.setItem('numberOfBoats', this.customers.length);
      localStorage.setItem('customerArray', JSON.stringify(this.customers));
      console.log('size: ', this.customers.length);
      console.log('customers: ', this.customers);
    });
  }

  getAllFavBoats(){
    if(!this.showFav)
    {
      this.showFav = true;
      for(let i = 0; i < parseInt(localStorage.getItem('numberOfBoats')); i++)
      {
        this.favRef = this.afs.doc(`${localStorage.getItem('userUid')}/${this.customers[i].brand + this.customers[i].name}`);
        this.favRef.valueChanges().subscribe(item =>
          {
            this.favModel = item;
              if(!this.favCustomer.includes(this.customers[i]) && this.favModel.boatId == this.customers[i].key && this.favModel.favourite){
                this.favCustomer[this.countFav] = this.customers[i];
                this.countFav++;
                this.favCustomerSort = this.favCustomer.sort((n1,n2) => {
                  if (n1.rating < n2.rating) {
                      return 1;
                  }

                  if (n1.rating > n2.rating) {
                      return -1;
                  }

                  return 0;
                });

              }
          });
      }
    }
    else{
      this.showFav = false;
      this.favCustomer= [];
      this.favCustomerSort=[];
      this.favModel = null;
      this.countFav = 0;
    }
  }

  confirmDialog(): void {
    const message = `Do you wanna login now?`;

    const dialogData = new ConfirmDialogModel("Not logged in!", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this.router.navigateByUrl('sign-in');
      }
    });
  }

  confirmSignIn(): void{
    const dialogRef = this.dialog.open(SignInComponent, {
      maxWidth: "400px",
    });
    dialogRef.afterClosed().subscribe(x => {
      if(!x && this.authService.isLoggedIn)
        location.reload();
    })
  }
  confirmSignUp():void {
    const dialogRef = this.dialog.open(SignUpComponent, {
      maxWidth: "400px",
    });
    dialogRef.afterClosed().subscribe(x => {
      if(!x && !this.authService.isLoggedIn)
        location.reload();
    })
  }

  openMenu(){
    if(!this.menuOpen)
      this.menuOpen = true;
    else
      this.menuOpen = false;
  }
}
