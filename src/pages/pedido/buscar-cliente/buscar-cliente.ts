import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente, Direccion } from '../../../models/cliente.model';
import { SucursalPage } from '../../sucursal/sucursal';

@Component({
  selector: 'page-buscar-cliente',
  templateUrl: 'buscar-cliente.html',
})
export class BuscarClientePage implements OnInit {
  clientes: Cliente[];

  constructor(public viewController: ViewController, public clienteService: ClienteService, public modalController: ModalController) {
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
      const cli = { cliente, sucursal };

      this.viewController.dismiss(cli);
    });
  }
}
