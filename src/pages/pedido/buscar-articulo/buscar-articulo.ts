import { Component, OnInit } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

import { PromocionPage } from '../promocion/promocion';

import { ArticuloService } from '../../../services/articulo.service';

import { Articulo } from '../../../models/articulo.model';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'page-buscar-articulo',
  templateUrl: 'buscar-articulo.html',
})
export class BuscarArticuloPage implements OnInit {
  articulos: Articulo[] = [];

  constructor(public viewController: ViewController, public articuloService: ArticuloService, public pedidoService: PedidoService, public modalController: ModalController) {
  }

  ngOnInit() {
    this.articulos = this.articuloService.getArticulos();
  }

  getArticulos(event: any) {
    this.articulos = this.articuloService.getArticulos();

    let searchQuery: string = event.target.value;

    if (searchQuery && searchQuery.trim() !== '') {
      this.articulos = this.articulos.filter((articulo) => {
        return (articulo.descripcion.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1);
      });
    }
  }

  onArticuloClicked(articulo: Articulo) {
    this.pedidoService.getCurrentItem().articulo = articulo;

    const modal = this.modalController.create(PromocionPage, { articulo: articulo });

    modal.present();

    modal.onDidDismiss((promo: any) => {
      const item = { promo };

      this.viewController.dismiss(item);
    });
  }
}
