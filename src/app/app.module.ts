import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { Geolocation } from '@ionic-native/geolocation';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AddPedidoPage } from '../pages/pedido/add-pedido/add-pedido';
import { PedidoTipoPage } from '../pages/pedido/pedido-tipo/pedido-tipo';
import { PedidoDetallePage } from '../pages/pedido/pedido-detalle/pedido-detalle';
import { BuscarClientePage } from '../pages/pedido/buscar-cliente/buscar-cliente';
import { BuscarArticuloPage } from '../pages/pedido/buscar-articulo/buscar-articulo';
import { PromocionPage } from '../pages/pedido/promocion/promocion';

import { AuthService } from '../services/auth.service';
import { PedidoService } from '../services/pedido.service';
import { ClienteService } from '../services/cliente.service';
import { ArticuloService } from '../services/articulo.service';
import { SucursalPage } from '../pages/sucursal/sucursal';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    AddPedidoPage,
    PedidoTipoPage,
    PedidoDetallePage,
    BuscarClientePage,
    BuscarArticuloPage,
    PromocionPage,
    SucursalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    AddPedidoPage,
    PedidoTipoPage,
    PedidoDetallePage,
    BuscarClientePage,
    BuscarArticuloPage,
    PromocionPage,
    SucursalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundGeolocation,
    Geolocation,
    AuthService,
    PedidoService,
    ClienteService,
    ArticuloService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
