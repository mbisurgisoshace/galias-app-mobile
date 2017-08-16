import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
    private isAuthenticated = false;

    logIn() {
        this.isAuthenticated = true;
    }

    logOut() {
        this.isAuthenticated = false;
    }

    authenticated(): boolean {
        return this.isAuthenticated;
    }
}