import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { Pedido, Item } from '../models/pedido.model';

import * as moment from 'moment';

@Injectable()
export class PedidoService {
    isLoading = new BehaviorSubject<boolean>(false);
    hasItems = new BehaviorSubject<boolean>(false);

    private pedidos: Pedido[] = [];
    private currentPedido = null as Pedido;
    private currentItem = null as Item;

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

    async syncPedido(pedido: Pedido) {
        this.isLoading.next(true);

        const token = await this.storage.get('token');
            
        const headers = new Headers({ 'authorization': token });

        return this.http.post('https://galias-server-api-dev.herokuapp.com/api/pedido/new', pedido, { headers })
            .map((res) => {
                return res.json();
            })
            .do((res) => {

                this.pedidos[this.pedidos.indexOf(pedido)]._id = res._id;
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

    getCurrentPedido() {
        return this.currentPedido;
    }

    getCurrentItem() {
        return this.currentItem;
    }

    getPedidos() {
        return this.pedidos.slice();
    }

    createPedido() {
        this.currentPedido = {} as Pedido;
        this.currentPedido.fecha = moment(moment(new Date()).format('YYYY-MM-DD')).valueOf();
        this.currentPedido.items = [];
    }

    resetPedido() {
        this.currentPedido = null as Pedido;
    }

    createItem() {
        this.currentItem = {} as Item;
    }

    resetItem() {
        this.currentItem = {} as Item;
    }

    addPedido() {
        this.currentPedido.total = this.currentPedido.items.map((item) => {
            return item.cantidad * item.precio;
        }).reduce((total, subtotal) => {
            return total + subtotal;
        });
        this.currentPedido.estado = 'generado'

        this.pedidos.push(this.currentPedido);

        this.storage.set('pedidos', this.pedidos)
            .then(() => {

            })
            .catch((err) => {
                console.log(err);
                this.pedidos.slice(this.pedidos.indexOf(this.currentPedido), 1);
            });
    }

    updatePedido() {
        console.log(this.pedidos);

        this.storage.set('pedidos', this.pedidos)
            .then(() => {

            })
            .catch((err) => {
                console.log(err);
            });
    }

    removePedidos() {
        this.pedidos = [];
    }
}