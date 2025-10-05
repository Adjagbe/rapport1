import { isPlatformBrowser } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActionResponse } from 'src/app/Models/actions.model';
import { STORAGE_KEYS } from 'src/app/Models/storage-keys.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  hasPermission(code: string): boolean {
    const userData = localStorage.getItem( STORAGE_KEYS.USER_INFO,);
    // console.log(userData);
    

    if(!userData) return false;

    const user = JSON.parse(userData);
    
    return user?.item.fonctionnalites?.some((f: any) => f.code == code) || false;
  }

}
