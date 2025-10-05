import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  date!: Date;

  constructor(private http: HttpClient) {}
  getDate() {
    let dateTime = moment(this.date).format('DD/MM/YYYY')
    console.log('DATETIME',dateTime);
    return dateTime
  }

  downloadFile(url: string) {
    return this.http.get(url, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}


