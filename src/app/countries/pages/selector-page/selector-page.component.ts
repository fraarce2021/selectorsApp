import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {switchMap, tap} from 'rxjs/operators'

import { CountriesService } from '../../services/countries.service';
import { CountrySmall } from '../../interfaces/countries.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  myForm:FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    frontier: ['', Validators.required]
  });

  //load selectors
  regions:string[]=[];
  countries:CountrySmall[]=[];
  // frontiers:string[]=[];
  frontiers:CountrySmall[]=[];

  //Ui
  load:boolean=false;


  constructor(private fb:FormBuilder, private countriesService:CountriesService) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    // this.myForm.get('region')?.valueChanges
    // .subscribe( region =>{
    //   this.countriesService.getCountriesByRegion(region)
    //   .subscribe(countries=>{
    //     this.countries = countries;
    //   })
    // });

    this.myForm.get('region')?.valueChanges
    .pipe(
      tap( (_) => {
        this.myForm.get('country')?.reset('');
        this.load = true;
      }),
      switchMap(region=>this.countriesService.getCountriesByRegion(region))
    )
    .subscribe(countries=> {
      this.countries = countries;
      this.load = false;
    });

    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(()=>{
        this.myForm.get('frontier')?.reset('');
        this.load = true;
      }),
      switchMap( code => this.countriesService.getCountryByCode(code)),
      switchMap( country => this.countriesService.getCountriesByCodes(country?.borders!) )
    )
    .subscribe((countries)=>{
      // this.frontiers = country?.borders || [];
      console.log(countries)
      this.frontiers = countries;
      this.load = false;
    })


  }

  save(){

  }

}
