import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

import { ClienteService } from '../../../services/cliente.service';

@Component({
  selector: 'page-buscar-cliente',
  templateUrl: 'buscar-cliente.html',
})
export class BuscarClientePage implements OnInit {
  clientes: any[];
  cliente: any;

  constructor(public viewController: ViewController, public clienteService: ClienteService) {
  }

  ngOnInit() {
    this.clientes = this.clienteService.getClientes();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscarClientePage');
  }

  onClienteClicked(cliente: any) {
    this.viewController.dismiss(cliente);
  }
}
