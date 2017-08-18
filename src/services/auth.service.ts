import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_7doL8g32M',
    ClientId: '2000o31jh3udbrm1bm1jknu10q'
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {
    logIn(username: string, password: string): Observable<any> {
        const authenticationData = {
            Username: username,
            Password: password
        };

        const userData = {
            Username: username,
            Pool: userPool
        }

        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const cognitoUser = new CognitoUser(userData);

        const obs = Observable.create((observer) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    observer.next();
                    console.log(result.getAccessToken().getJwtToken());
                },
                onFailure: (err) => {
                    observer.next(err);
                    console.log(err);
                }
            });
        });

        return obs;
    }

    getAuthenticatedUser() {
        return userPool.getCurrentUser();
    }

    logOut() {
        this.getAuthenticatedUser().signOut();
    }

    isAuthenticated(): Observable<boolean> {
        const cognitoUser = this.getAuthenticatedUser();

        const obs = Observable.create((observer) => {
            if (!cognitoUser) {
                observer.next(false);
            } else {
                cognitoUser.getSession((err, session) => {
                    if (err) {
                        observer.next(false);
                    } else {
                        if (session.isValid()) {
                            observer.next(true);
                        } else {
                            observer.next(false);
                        }
                    }
                });
            }
            observer.complete();
        });
        
        return obs;
    }
}