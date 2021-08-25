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
    country: ['', Validators.required]
  });

  //load selectors
  regions:string[]=[];
  countries:CountrySmall[]=[];


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
      }),
      switchMap(region=>this.countriesService.getCountriesByRegion(region))
    )
    .subscribe(countries=> {
      this.countries = countries;
    })
  }

  save(){

  }

}
