import { Injectable } from '@angular/core';

@Injectable()
export class PedidoService {
    private pedidos = [];

    constructor() {
        this.initPedidos();
    }

    private initPedidos() {
        let items1 = [
            { articulo: 'Levadura', cantidad: 10, precio: 25.55 },
            { articulo: 'Levadura', cantidad: 2, precio: 0 },
            { articulo: 'Pastelgras', cantidad: 5, precio: 15.45 }
        ];

        let items2 = [
            { articulo: 'Levadura', cantidad: 8, precio: 20.25 },
            { articulo: 'Margarina', cantidad: 1, precio: 12.50 }
        ];

        let items3 = [
            { articulo: 'Cobertura', cantidad: 3, precio: 110.45 }
        ];

        this.pedidos = [
            { numero: '135752', cliente: 'Maximiliano Bisurgi', items: items1, enviado: true },
            { numero: '452761', cliente: 'Claudio Bisurgi', items: items2, enviado: false },
            { numero: '542126', cliente: 'Matias Bisurgi', items: items3, enviado: false }
        ];
    }

    getPedidos() {
        return this.pedidos.slice();
    }
}