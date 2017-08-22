import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

import { BehaviorSubject } from 'rxjs/Rx';

import { AuthService } from './auth.service';

import { Cliente } from '../models/cliente.model';

@Injectable()
export class ClienteService {
    isLoading = new BehaviorSubject<boolean>(false);

    private clientes: Cliente[] = [];

    constructor(public http: Http, public authService: AuthService, public storage: Storage) {
        console.log('ClienteService constructor()');

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
                this.isLoading.next(false);
            });
    }

    syncClientes() {
        this.isLoading.next(true);

        return this.http.get('https://8vxcze5tyc.execute-api.us-east-1.amazonaws.com/dev/api/clientes')
            .map((res) => {
                return res.json();
            })
            .do((clientes: Cliente[]) => {
                this.storage.set('clientes', clientes)
                    .then(() => {
                        this.isLoading.next(false);
                        
                        return clientes;
                    });
            });
    }

    getClientes() {
        return this.clientes.slice();
    }
}