import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewController, NavParams } from 'ionic-angular';
import { Direccion } from '../../models/cliente.model';

@Component({
  selector: 'page-sucursal',
  templateUrl: 'sucursal.html',
})
export class SucursalPage implements OnInit {
  sucursales: Direccion;

  constructor(public viewController: ViewController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.sucursales = this.navParams.get('sucursales');
  }

  onSucursalClicked(sucursal: Direccion) {
      this.viewController.dismiss(sucursal);
  }
}
