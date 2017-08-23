import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente } from '../../../models/cliente.model';

@Component({
  selector: 'page-buscar-cliente',
  templateUrl: 'buscar-cliente.html',
})
export class BuscarClientePage implements OnInit {
  clientes: Cliente[];

  constructor(public viewController: ViewController, public clienteService: ClienteService) {
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
    this.viewController.dismiss(cliente);
  }
}
