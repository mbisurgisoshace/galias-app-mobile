import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Rx';

import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { Response } from '_debugger';

const poolData = {
    UserPoolId: 'us-east-1_7doL8g32M',
    ClientId: '2000o31jh3udbrm1bm1jknu10q'
};

const userPool = new CognitoUserPool(poolData);

@Injectable()
export class AuthService {
    constructor(public http: Http, public storage: Storage) {

    }

    logIn(email: string, password: string): Observable<any> {
        
        // const authenticationData = {
        //     Username: username,
        //     Password: password
        // };

        // const userData = {
        //     Username: username,
        //     Pool: userPool
        // }

        // const authenticationDetails = new AuthenticationDetails(authenticationData);
        // const cognitoUser = new CognitoUser(userData);

        // const obs = Observable.create((observer) => {
        //     cognitoUser.authenticateUser(authenticationDetails, {
        //         onSuccess: (result) => {
        //             observer.next();
        //             console.log(result.getAccessToken().getJwtToken());
        //         },
        //         onFailure: (err) => {
        //             observer.next();
        //             console.log(err);
        //         }
        //     });
        // });

        const obs = Observable.create((observer) => {
            this.http.post('https://galias-server-api.herokuapp.com/signin', { email, password })
                .subscribe((res) => {
                    if (res.status === 200) {
                        this.storage.set('token', res.json().token)
                            .then(() => {
                                observer.next();
                            })
                    }
                }, (err) => {
                    observer.next('El usuario o la contraseña son incorrectos');
                });
        });

        return obs;
    }

    getAuthenticatedUser() {
        //return userPool.getCurrentUser();
        return true;
    }

    logOut() {
        //this.getAuthenticatedUser().signOut();
        this.storage.set('token', null)
            .then(() => {

            });
    }

    isAuthenticated(): Observable<boolean> {
        // const cognitoUser = this.getAuthenticatedUser();

        // const obs = Observable.create((observer) => {
        //     if (!cognitoUser) {
        //         observer.next(false);
        //     } else {
        //         cognitoUser.getSession((err, session) => {
        //             if (err) {
        //                 observer.next(false);
        //             } else {
        //                 if (session.isValid()) {
        //                     observer.next(true);
        //                 } else {
        //                     observer.next(false);
        //                 }
        //             }
        //         });
        //     }
        //     observer.complete();
        // });

        const obs = Observable.create((observer) => {
            this.storage.get('token')
                .then((token) => {
                    if (token !== null) {
                        observer.next(true);
                    } else {
                        observer.next(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            
            observer.complete();
        });

        return obs;
    }
}