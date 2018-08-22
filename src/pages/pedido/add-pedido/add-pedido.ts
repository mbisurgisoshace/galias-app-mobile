import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../../login/login';
import { BuscarClientePage } from '../buscar-cliente/buscar-cliente';
import { BuscarArticuloPage } from '../buscar-articulo/buscar-articulo';

import { AuthService } from '../../../services/auth.service';
import { PedidoService } from '../../../services/pedido.service';
import { ClienteService } from '../../../services/cliente.service';

import { Pedido, Item } from '../../../models/pedido.model';
import { Cliente, Direccion } from '../../../models/cliente.model';

import * as moment from 'moment';
import { Articulo } from '../../../models/articulo.model';

@Component({
  selector: 'page-add-pedido',
  templateUrl: 'add-pedido.html',
})
export class AddPedidoPage implements OnInit {
  cliente: Cliente;
  sucursal: Direccion;
  comentario: string;
  items: Item[] = [];

  constructor(public navController: NavController, public authService: AuthService, public pedidoService: PedidoService, public clienteService: ClienteService, public modalController: ModalController, public geolocation: Geolocation, public loadingController: LoadingController, public alertController: AlertController, public toastController: ToastController) {
  }

  ngOnInit() {
    this.items = this.pedidoService.getCurrentPedido().items;
  }

  ionViewCanEnter() {
    if (!this.authService.isAuthenticated()) {
      this.navController.setRoot(LoginPage);
    }
  }

  ionViewDidEnter() {
    let loadingEnviando;

    this.pedidoService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        if (!loadingEnviando) {
          loadingEnviando = this.loadingController.create({
            content: 'Enviando...'
          });
        }

        loadingEnviando.present();
      } else {
        if (loadingEnviando) {
          loadingEnviando.dismiss();
          loadingEnviando = null;
        }
      }
    });

    let loadingLocalizando;

    this.clienteService.isUpdating.subscribe((isUpdating) => {
      if (isUpdating) {
        if (!loadingLocalizando) {
          loadingLocalizando = this.loadingController.create({
            content: 'Localizando...'
          });
        }

        loadingLocalizando.present();
      } else {
        if (loadingLocalizando) {
          loadingLocalizando.dismiss();
          loadingLocalizando = null;
        }
      }
    });
  }

  onBuscarClicked() {
    const modal = this.modalController.create(BuscarClientePage);

    modal.present();

    modal.onDidDismiss((cliente) => {
      this.cliente = cliente.cliente;
      this.sucursal = cliente.sucursal;
    });
  }

  onLocationClicked() {
    this.clienteService.updateClienteLocation(this.cliente);
  }

  onAddClicked() {
    this.pedidoService.createItem();

    const modal = this.modalController.create(BuscarArticuloPage);

    modal.present();

    modal.onDidDismiss((item) => {
      if (item.promo.tipo === 1) {
        this.promocionTipo1(item);
      }

      if (item.promo.tipo === 2) {
        this.promocionTipo2(item);
      }

      if (item.promo.tipo === 3) {
        this.promocionTipo3(item);
      }
    });
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

            this.pedidoService.getCurrentPedido().items[index].cantidad = data.cantidad;
          }
        }
      ]
    });

    prompt.present();
  }

  onRemoveClicked(index: number) {
    this.items.splice(index, 1);
  }

  onConfirmarClicked() {
    this.pedidoService.getCurrentPedido().comentario = this.comentario;
    this.pedidoService.addPedido();

    const alert = this.alertController.create({
      title: 'Enviar',
      message: 'Desea enviar el pedido ahora?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            // this.pedidoService.syncPedido(this.pedidoService.getCurrentPedido()).subscribe((ped) => {
            //   const toast = this.toastController.create({
            //     message: 'Pedido enviado con ID: ' + ped._id,
            //     duration: 5000
            //   });

            //   toast.present();
            //   this.navController.popToRoot();
            // }, (err) => {
            //   const toast = this.toastController.create({
            //     message: 'No se ha podido enviar el pedido.',
            //     duration: 5000
            //   });

            //   toast.present();
            //   this.navController.popToRoot();
            // });

            this.pedidoService.syncPedido(this.pedidoService.getCurrentPedido())
              .then((obs) => {
                obs.subscribe((ped) => {
                  const toast = this.toastController.create({
                    message: 'Pedido enviado con ID: ' + ped._id,
                    duration: 5000
                  });

                  toast.present();
                  this.navController.popToRoot();
                }, (err) => {
                  const toast = this.toastController.create({
                    message: 'No se ha podido enviar el pedido.',
                    duration: 5000
                  });

                  toast.present();
                  this.navController.popToRoot();
                });
              })
          }
        },
        {
          text: 'No',
          handler: () => {
            this.navController.popToRoot();
          },
          role: 'cancel'
        }
      ]
    })

    alert.present();
  }

  isDisabled() {
    let pedido = this.pedidoService.getCurrentPedido();

    if (!pedido.cliente || pedido.items.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  private promocionTipo1(item: any) {
    let currentItem: Item = this.pedidoService.getCurrentItem();
    currentItem.descuento = 0;
    currentItem.promocion = 'a+b';

    let itemA: Item = { ...currentItem };
    let itemB: Item = { ...currentItem };

    itemA.cantidad = item.promo.promo.cantidadA;
    itemA.precio = currentItem.articulo.precioVta;
    itemB.cantidad = item.promo.promo.cantidadB;
    itemB.precio = 0;

    this.pedidoService.getCurrentPedido().items.push(itemA);
    this.pedidoService.getCurrentPedido().items.push(itemB);

    this.pedidoService.resetItem();
  }

  private promocionTipo2(item: any) {
    let currentItem: Item = this.pedidoService.getCurrentItem();
    currentItem.cantidad = item.promo.promo.cantidad;
    currentItem.precio = currentItem.articulo.precioVta * (1 - (item.promo.promo.porcentaje / 100));
    currentItem.descuento = item.promo.promo.porcentaje;
    currentItem.promocion = '%';

    this.pedidoService.getCurrentPedido().items.push(currentItem);

    this.pedidoService.resetItem();
  }

  private promocionTipo3(item: any) {
    let currentItem: Item = this.pedidoService.getCurrentItem();
    currentItem.cantidad = item.promo.promo.cantidad;
    currentItem.precio = currentItem.articulo.precioVta;
    currentItem.descuento = 0;
    currentItem.promocion = 'sin';

    this.pedidoService.getCurrentPedido().items.push(currentItem);

    this.pedidoService.resetItem();
  }

  getTotal() {
    let total = 0;

    for (let i = 0; i < this.pedidoService.getCurrentPedido().items.length; i++) {
      let item = this.items[i];

      let subTotal = item.cantidad * item.precio;

      total = total + subTotal;
    }

    return total;
  }
}
