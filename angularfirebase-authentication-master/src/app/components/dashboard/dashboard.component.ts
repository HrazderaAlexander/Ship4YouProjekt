import { Component, OnInit, NgZone } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from "../../shared/services/auth.service";
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { Router } from "@angular/router";
import { Boat } from 'src/app/shared/services/boat';

export interface StateGroup {
  letter: string;
  names: string[];
}

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stateForm: FormGroup = this._formBuilder.group({
    stateGroup: ['', Validators.required],
    vermieterGroup: ['', Validators.required],
    boatTypeGroup: ['', Validators.required],
    boatNameGroup: ['', Validators.required]
  });

  boats: Boat[] = [{
    id: ['Maximus', 'Maxus'],
    name: 'Maximus',
    vermieter: 'Alexander Test',
    schiffstyp: 'Maxus'
  },{
    id: ['Stern', 'Bavaria Yachts'],
    name: 'Stern',
    vermieter: 'Christian Test',
    schiffstyp: 'Bavaria Yachts'
  },{
    id: ['Jenny', 'Maxus'],
    name: 'Jenny',
    vermieter: 'Herbert Test',
    schiffstyp: 'Maxus'
  },{
    id: ['Helmut', 'Maxus'],
    name: 'Helmut',
    vermieter: 'Christof Test',
    schiffstyp: 'Maxus'
  },{
    id: ['Maximus', 'Bavaria Yachts'],
    name: 'Maximus',
    vermieter: 'Lukas Test',
    schiffstyp: 'Bavaria Yachts'

  },{
    id: ['Helga', 'Maxus'],
    name: 'Helga',
    vermieter: 'Wolfgang Test',
    schiffstyp: 'Maxus'
  },{
    id: ['Rita', 'Bavaria Yachts'],
    name: 'Rita',
    vermieter: 'Ulrich Test',
    schiffstyp: 'Bavaria Yachts'
  },{
    id: ['Paul', 'Bavaria Yachts'],
    name: 'Paul',
    vermieter: 'Peter Test',
    schiffstyp: 'Bavaria Yachts'
  }];

  boatNameGroups: StateGroup[] = [
  {
    letter: 'H',
    names: ['Helga']
  },{
    letter: 'J',
    names: ['Jenny']
  },{
    letter: 'M',
    names: ['Maximus']
  },{
    letter: 'P',
    names: ['Paul']
  },{
    letter: 'R',
    names: ['Rita']
  },{
    letter: 'S',
    names: ['Stern']
  }]

  boatTypeGroups: StateGroup[] = [{
    letter: 'B',
    names: ['Bavaria Yachts']
  },{
    letter: 'M',
    names: ['Maxus']
  }]

  stateGroups: StateGroup[] = [{
    letter: 'A',
    names: ['Alabama', 'Alaska', 'Arizona', 'Arkansas']
  }, {
    letter: 'C',
    names: ['California', 'Colorado', 'Connecticut']
  }, {
    letter: 'D',
    names: ['Delaware']
  }, {
    letter: 'F',
    names: ['Florida']
  }, {
    letter: 'G',
    names: ['Georgia']
  }, {
    letter: 'H',
    names: ['Hawaii']
  }, {
    letter: 'I',
    names: ['Idaho', 'Illinois', 'Indiana', 'Iowa']
  }, {
    letter: 'K',
    names: ['Kansas', 'Kentucky']
  }, {
    letter: 'L',
    names: ['Louisiana']
  }, {
    letter: 'M',
    names: ['Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana']
  }, {
    letter: 'N',
    names: ['Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota']
  }, {
    letter: 'O',
    names: ['Ohio', 'Oklahoma', 'Oregon']
  }, {
    letter: 'P',
    names: ['Pennsylvania']
  }, {
    letter: 'R',
    names: ['Rhode Island']
  }, {
    letter: 'S',
    names: ['South Carolina', 'South Dakota']
  }, {
    letter: 'T',
    names: ['Tennessee', 'Texas']
  }, {
    letter: 'U',
    names: ['Utah']
  }, {
    letter: 'V',
    names: ['Vermont', 'Virginia']
  }, {
    letter: 'W',
    names: ['Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
  }];

  vermieterGroups: StateGroup[] = [{
    letter: 'A',
    names: ['Alexander Test', 'Andreas Test', 'Andrej Test', 'Amel Test']
  },
  {
    letter: 'B',
    names: ['Bernhard Test', 'Benjamin Test', 'Berthold Test']
  },
  {
    letter: 'C',
    names: ['Christof Test', 'Christian Test', 'Clemens Test']
  }, {
    letter: 'D',
    names: ['Daniel Test', 'David Test', 'Dominik Test']
  }, {
    letter: 'F',
    names: ['Fabian Test', 'Fred Test', 'Felix Test']
  }, {
    letter: 'G',
    names: ['Gregor Test','Gustav Test', 'Georg Test']
  }, {
    letter: 'H',
    names: ['Herman Test', 'Herbert Test', 'Heinrich Test']
  }, {
    letter: 'I',
    names: ['Isack Test', 'Ilia Test']
  }, {
    letter: 'K',
    names: ['Kevin Test', 'Karl Test']
  }, {
    letter: 'L',
    names: ['Lukas Test', 'Luis Test']
  }, {
    letter: 'M',
    names: ['Markus Test', 'Manuel Test', 'Michael Test']
  }, {
    letter: 'N',
    names: ['Nino Test']
  }, {
    letter: 'O',
    names: ['Oliver Test', 'Otto Test', 'Oskar Test']
  }, {
    letter: 'P',
    names: ['Peter Test', 'Paul Test']
  }, {
    letter: 'R',
    names: ['Reinhard Test', 'Rupert Test']
  }, {
    letter: 'S',
    names: ['Sebastian Test', 'Simon Test', 'Severin Test']
  }, {
    letter: 'T',
    names: ['Tim Test', 'Tobias Test']
  }, {
    letter: 'U',
    names: ['Ulrich Test']
  }, 
  {
    letter: 'W',
    names: ['Wolfgang Test']
  }];


  stateGroupOptions: Observable<StateGroup[]>;
  vermieterGroupOptions: Observable<StateGroup[]>;
  schiffsTypGroupOptions: Observable<StateGroup[]>;
  schiffsNameGroupOptions: Observable<StateGroup[]>;

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit() {

    this.stateGroupOptions = this.stateForm.controls['stateGroup']!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroup(value))
        )
        
        this.vermieterGroupOptions = this.stateForm.controls['vermieterGroup']!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroupVermieter(value))
        )

        this.schiffsTypGroupOptions = this.stateForm.controls['boatTypeGroup']!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroupSchiffsTyp(value))
        )

        this.schiffsNameGroupOptions = this.stateForm.controls['boatNameGroup']!.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterGroupSchiffsName(value))
        )
   }

   private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({letter: group.letter, names: _filter(group.names, value)}))
        .filter(group => group.names.length > 0);
    }
    return this.stateGroups;
    } 

    private _filterGroupVermieter(value: string): StateGroup[] {
      if(value) {
        return this.vermieterGroups
          .map(g => ({letter: g.letter, names: _filter(g.names, value)}))
          .filter(group => group.names.length > 0);
      }
      return this.vermieterGroups;
    }

    private _filterGroupSchiffsTyp(value: string): StateGroup[] {
      if(value) {
        return this.boatTypeGroups
          .map(g => ({letter: g.letter, names: _filter(g.names, value)}))
          .filter(group => group.names.length > 0);
      }
      return this.boatTypeGroups;
    }
    private _filterGroupSchiffsName(value: string): StateGroup[] {
      if(value) {
        return this.boatNameGroups
          .map(g => ({letter: g.letter, names: _filter(g.names, value)}))
          .filter(group => group.names.length > 0);
      }
      return this.boatNameGroups;
    }
}
