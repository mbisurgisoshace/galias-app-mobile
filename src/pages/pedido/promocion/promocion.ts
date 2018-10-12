import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ViewController, NavParams } from 'ionic-angular';
import { PedidoService } from '../../../services/pedido.service';
import { ArticuloService } from '../../../services/articulo.service';

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
  extra: boolean = false;
  stock: number = 0;

  constructor(public viewController: ViewController, public navParams: NavParams, public pedidoService: PedidoService, public articuloService: ArticuloService) {
  }

  ngOnInit() {
    this.articulo = this.navParams.get('articulo');
    this.articuloService.getStock(this.articulo.codigo).subscribe((cantidad: number) => {
      this.stock = cantidad;
    });
  }

  onPromoSelected(promocion: any) {
    this.promocion = promocion;
  }

  onConfirmarClicked(form: NgForm) {
    const promo = {tipo: this.promocion.tipo, promo: form.value};

    this.viewController.dismiss(promo);
  }
}
