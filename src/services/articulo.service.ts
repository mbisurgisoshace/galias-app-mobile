import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs/Rx';

import { AuthService } from './auth.service';

import { Articulo } from '../models/articulo.model';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'

@Injectable()
export class ArticuloService {
    isLoading = new BehaviorSubject<boolean>(false);
    
    private articulos: Articulo[]; 

    constructor(public http: Http, public authService: AuthService, public storage: Storage) {
        this.init();
    }

    private init() {
        this.storage.get('articulos')
            .then((articulos: Articulo[]) => {
                if (articulos !== null) {
                    this.articulos = articulos;
                } else {
                    this.syncArticulos().subscribe((articulos: Articulo[]) => {
                        this.articulos = articulos;
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    syncArticulos() {
        this.isLoading.next(true);        

        return this.http.get('https://8vxcze5tyc.execute-api.us-east-1.amazonaws.com/dev/api/articulos')
            .map((res) => {
                return res.json();
            })
            .do((articulos: Articulo[]) => {
                this.storage.set('articulos', articulos)
                    .then(() => {
                        this.isLoading.next(false);
                        this.articulos = articulos;
                        return articulos;
                    });
            });
    }

    getArticulos() {
        return this.articulos.slice();
    }
}