import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-buscar-articulo',
  templateUrl: 'buscar-articulo.html',
})
export class BuscarArticuloPage {

  constructor(public navController: NavController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuscarArticuloPage');
  }

}
