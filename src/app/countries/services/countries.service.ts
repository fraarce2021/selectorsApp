import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { CountrySmall, Country } from '../interfaces/countries.interface';

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


  getCountryByCode(code:string):Observable<Country | null>{
    if (!code) {
      return of(null)
    }
    return this.http.get<Country>(`${this._baseUrl}/alpha/${code}`);
  }

  getCountryByCodeSmall(code:string):Observable<CountrySmall>{
    return this.http.get<CountrySmall>(`${this._baseUrl}/alpha/${code}?fields=alpha3Code;name`);
  }

  getCountriesByCodes(borders:string[]):Observable<CountrySmall[]>{
    if (!borders) {
      return of([]);
    }
    const requests:Observable<CountrySmall>[] = [];

    borders.forEach(code => {
      const request = this.getCountryByCodeSmall(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }
}
