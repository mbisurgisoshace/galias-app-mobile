import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { Pedido } from '../models/pedido.model';

@Injectable()
export class PedidoService {
    isLoading = new BehaviorSubject<boolean>(false);
    hasItems = new BehaviorSubject<boolean>(false);

    private pedidos: Pedido[] = [];

    constructor(public storage: Storage, public http: Http) {
        this.init();
    }

    private init() {
        this.storage.get('pedidos')
            .then((pedidos: Pedido[]) => {
                if (pedidos !== null) {
                    this.pedidos = pedidos;

                    this.hasItems.next(true);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    syncPedido(pedido: Pedido) {
        this.isLoading.next(true);

        return this.http.post('https://8vxcze5tyc.execute-api.us-east-1.amazonaws.com/dev/api/pedidos', pedido)
            .map((res) => {
                return res.json();
            })
            .do((res) => {
                this.pedidos[this.pedidos.indexOf(pedido)]._id = res.pedido._id;
                this.pedidos[this.pedidos.indexOf(pedido)].enviado = true;

                this.storage.set('pedidos', this.pedidos)
                    .then(() => {
                        this.isLoading.next(false);
                    })
                    .catch((err) => {
                        this.isLoading.next(false);
                    });
            })
            .catch((err) => {
                console.log(err);
                this.isLoading.next(false);
                return Observable.throw(err);
            });
    }

    getPedidos() {
        return this.pedidos.slice();
    }

    addPedido(pedido: Pedido) {
        this.pedidos.push(pedido);

        this.storage.set('pedidos', this.pedidos)
            .then(() => {

            })
            .catch((err) => {
                console.log(err);
                this.pedidos.slice(this.pedidos.indexOf(pedido), 1);
            });
    }
}