import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountrySmall } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private _baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions():string[] {
    return [...this._regions];
  }

  constructor(private http:HttpClient) { }

  getCountriesByRegion(region:string):Observable<CountrySmall[]>{
    return this.http.get<CountrySmall[]>(`${this._baseUrl}/region/${region}?fields=alpha3Code;name`)
  }
}
