import { Injectable } from '@angular/core';

import { Pedido } from '../models/pedido.model';

@Injectable()
export class PedidoService {
    private pedidos: Pedido[] = [];

    constructor() {}

    getPedidos() {
        return this.pedidos.slice();
    }

    addPedido(pedido: Pedido) {
        this.pedidos.push(pedido);
    }
}