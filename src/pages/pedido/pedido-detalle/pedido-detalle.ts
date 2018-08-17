import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../../login/login';

import { AuthService } from '../../../services/auth.service';
import { PedidoService } from './../../../services/pedido.service';

import { Pedido } from '../../../models/pedido.model';

@Component({
  selector: 'page-pedido-detalle',
  templateUrl: 'pedido-detalle.html',
})
export class PedidoDetallePage implements OnInit {
  pedido: any;

  constructor(public navController: NavController, public navParams: NavParams, public authService: AuthService, public alertController: AlertController, public pedidoService: PedidoService, public toastController: ToastController, public loadingController: LoadingController) {
  }

  ngOnInit() {
    this.pedido = this.navParams.get('pedido');
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidEnter() {
    let loading;

    this.pedidoService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        if (!loading) {
          loading = this.loadingController.create({
            content: 'Enviando...'
          });
        }

        loading.present();
      } else {
        if (loading) {
          loading.dismiss();
          loading = null;
        }
      }
    });
  }

  onSendClicked(pedido: Pedido) {
    // this.pedidoService.syncPedido(pedido).subscribe((ped) => {
    //   const toast = this.toastController.create({
    //     message: 'Pedido enviado con ID: ' + ped._id,
    //     duration: 5000
    //   });

    //   toast.present();
    //   this.navController.pop();
    // }, (err) => {
    //   const toast = this.toastController.create({
    //     message: 'No se ha podido enviar el pedido.',
    //     duration: 5000
    //   });

    //   toast.present();
    //   this.navController.pop();
    // });

    this.pedidoService.syncPedido(pedido)
      .then((obs) => {
        obs.subscribe((ped) => {
          const toast = this.toastController.create({
            message: 'Pedido enviado con ID: ' + ped._id,
            duration: 5000
          });

          toast.present();
          this.navController.pop();
        }, (err) => {
          const toast = this.toastController.create({
            message: 'No se ha podido enviar el pedido.',
            duration: 5000
          });

          toast.present();
          this.navController.pop();
        });
      })
  }

  onEditClicked(index: number) {
    const prompt = this.alertController.create({
      title: 'Editar',
      message: 'Ingrese la cantidad',
      inputs: [
        {
          name: 'cantidad',
          placeholder: 'Cantidad'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.cantidad === '' || data.cantidad === null) {
              return;
            }

            this.pedido.items[index].cantidad = data.cantidad;
            this.pedido.total = this.getTotal();
            this.pedido.enviado = false;

            this.pedidoService.updatePedido();
          }
        }
      ]
    });

    prompt.present();
  }

  onRemoveClicked(index: number) {
    this.pedido.items.splice(index, 1);
    this.pedido.total = this.getTotal();
    this.pedido.enviado = false;

    this.pedidoService.updatePedido();
  }

  getTotal() {
    let total = 0;

    for (let i = 0; i < this.pedido.items.length; i++) {
      let item = this.pedido.items[i];

      let subTotal = item.cantidad * item.precio;

      total = total + subTotal;
    }

    return total;
  }
}
