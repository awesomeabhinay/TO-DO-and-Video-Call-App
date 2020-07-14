import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthServiceService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private authService: AuthServiceService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        if (localStorage.getItem('token') === 'loggedin'){
            return true;
        }
        else{
            return false;
        }
    }
}
