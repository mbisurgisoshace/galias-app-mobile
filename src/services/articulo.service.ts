import { Injectable } from '@angular/core';

@Injectable()
export class ArticuloService {
    private articulos = [];

    constructor() {
        this.initArticulos();
    }

    private initArticulos() {
        this.articulos = [
            {codigo: '100001', descripcion: 'LEVADURA', precio: 12.44},
            {codigo: '100002', descripcion: 'DUQUESA CLASICA', precio: 20.25},
            {codigo: '100003', descripcion: 'COBERTURA DE CHOCOLATE', precio: 10.55},
            {codigo: '100004', descripcion: 'MARGARINA', precio: 18.99}
        ];
    }

    getArticulos() {
        return this.articulos.slice();
    }
}