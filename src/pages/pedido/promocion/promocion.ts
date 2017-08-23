import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-promocion',
  templateUrl: 'promocion.html',
})
export class PromocionPage implements OnInit {

  promociones: any[] = [
    {tipo: 1, descripcion: 'A + B'},
    {tipo: 2, descripcion: 'Descuento por %'},
    {tipo: 3, descripcion: 'No aplica promocion'}
  ];

  promocion: any;
  articulo: any;

  constructor(public viewController: ViewController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.articulo = this.navParams.get('articulo');
  }

  onPromoSelected(promocion: any) {
    this.promocion = promocion;
  }

  onConfirmarClicked(form: NgForm) {
    const promo = {tipo: this.promocion.tipo, promo: form.value};

    this.viewController.dismiss(promo);
  }
}
