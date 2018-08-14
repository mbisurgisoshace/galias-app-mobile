import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente, Direccion } from '../../../models/cliente.model';
import { SucursalPage } from '../../sucursal/sucursal';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'page-buscar-cliente',
  templateUrl: 'buscar-cliente.html',
})
export class BuscarClientePage implements OnInit {
  clientes: Cliente[];

  constructor(public viewController: ViewController, public clienteService: ClienteService, public pedidoService: PedidoService, public modalController: ModalController) {
  }

  ngOnInit() {
    this.clientes = this.clienteService.getClientes();
  }

  getClientes(event: any) {
    this.clientes = this.clienteService.getClientes();

    let searchQuery: string = event.target.value;

    if (searchQuery && searchQuery.trim() !== '') {
      this.clientes = this.clientes.filter((cliente) => {
        return (cliente.razonSocial.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
      });
    }
  }

  onClienteClicked(cliente: Cliente) {
    const modal = this.modalController.create(SucursalPage, { sucursales: cliente.sucursales });

    modal.present();

    modal.onDidDismiss((sucursal: Direccion) => {
      this.pedidoService.getCurrentPedido().cliente = cliente;
      this.pedidoService.getCurrentPedido().sucursal = sucursal;
      
      const cli = { cliente, sucursal };

      console.log(this.pedidoService.getCurrentPedido());

      this.viewController.dismiss(cli);
    });
  }
}
