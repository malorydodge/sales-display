import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, filter, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private _http: HttpClient) { }

  getSales(){
    return this._http.get("https://my.api.mockaroo.com/twt_prompt.json?key=1e872ee0");
  }

  getSalesByCountry(country){
    return this._http.get("https://my.api.mockaroo.com/twt_prompt.json?key=1e872ee0&countries="+country);
  }

}
