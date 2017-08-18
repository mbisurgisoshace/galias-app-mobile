import { Injectable, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { AuthService } from './auth.service';

import { Articulo } from '../models/articulo.model';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/do'

@Injectable()
export class ArticuloService implements OnInit {
    private articulos;

    constructor(public http: Http, public authService: AuthService) {
        this.initArticulos();
    }

    ngOnInit() {
        console.log('ArticuloService ngOnInit()');
    }

    private initArticulos() {
        this.articulos = [
            { codigo: '100001', descripcion: 'LEVADURA', precio: 12.44 },
            { codigo: '100002', descripcion: 'DUQUESA CLASICA', precio: 20.25 },
            { codigo: '100003', descripcion: 'COBERTURA DE CHOCOLATE', precio: 10.55 },
            { codigo: '100004', descripcion: 'MARGARINA', precio: 18.99 }
        ];
    }

    getAll() {
        return this.http.get('https://8vxcze5tyc.execute-api.us-east-1.amazonaws.com/dev/api/articulos')
            .map((res) => {
                return res.json();
            })
            .do((articulos) => {
                this.articulos = articulos;
            });
    }

    getArticulos() {
        return this.articulos.slice();
    }
}