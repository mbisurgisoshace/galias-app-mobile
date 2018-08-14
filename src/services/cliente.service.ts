import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';

import { BehaviorSubject } from 'rxjs/Rx';

import { AuthService } from './auth.service';

import { Cliente } from '../models/cliente.model';

@Injectable()
export class ClienteService {
    isLoading = new BehaviorSubject<boolean>(false);
    isUpdating = new BehaviorSubject<boolean>(false);

    private clientes: Cliente[] = [];

    constructor(public http: Http, public authService: AuthService, public storage: Storage, public geolocation: Geolocation) {
        this.init();
    }

    private init() {
        this.storage.get('clientes')
            .then((clientes: Cliente[]) => {
                if (clientes !== null) {
                    this.clientes = clientes;
                } else {
                    this.syncClientes().subscribe((clientes: Cliente[]) => {
                        this.clientes = clientes;
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    syncClientes() {
        this.isLoading.next(true);

        return this.http.get('https://galias-server-api-dev.herokuapp.com/api/cliente/list')
            .map((res) => {
                return res.json().clientes;
            })
            .do((clientes: Cliente[]) => {
                this.storage.set('clientes', clientes)
                    .then(() => {
                        this.isLoading.next(false);
                        this.clientes = clientes;
                        return clientes;
                    });
            });
    }

    updateClienteLocation(cliente: Cliente) {
        // this.isUpdating.next(true);

        // this.geolocation.getCurrentPosition()
        //     .then((location) => {
        //         cliente.ubicacion = [];
        //         cliente.ubicacion.push(location.coords.longitude);
        //         cliente.ubicacion.push(location.coords.latitude);

        //         console.log(location);

        //         this.http.put('https://8vxcze5tyc.execute-api.us-east-1.amazonaws.com/dev/api/clientes', cliente)
        //             .map((res) => {
        //                 return res.json();
        //             })
        //             .do((res) => {
        //                 this.isUpdating.next(false);
        //                 console.log(res);
        //             }).subscribe();
        //     })
        //     .catch((err) => {
        //         this.isUpdating.next(false);
        //         console.log(err);
        //     });
    }

    getClientes() {
        return this.clientes.slice();
    }
}