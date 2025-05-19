import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor() { }

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/api/city';

  public get(regionId: number): Observable<any> {
    return this.http.get(this.apiUrl + '/' + regionId);
  }

  public put(city: City){
    return this.http.put(this.apiUrl + '/' + city.id, city);
  }

  public post(name: string, regionId: number): Observable<any>{
    let city: City = {id: 0, name: name, regionId: regionId};
    return this.http.post(this.apiUrl + '/', city);
  }

  public delete(cityId: number): Observable<any>{
    return this.http.delete(this.apiUrl + '/' + cityId)
  }
}
