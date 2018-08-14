import { Cliente, Direccion } from './cliente.model';
import { Articulo } from './articulo.model';

export interface Item {
    articulo: Articulo;
    promocion: string;
    cantidad: number;
    descuento: number;
    precio: number;
    extra: boolean;
}

export interface Pedido {
    _id?: string;
    fecha: number;
    cliente: Cliente;
    sucursal: Direccion;
    comentario: string;
    items: Item[];
    total: number;
    estado: string;
    enviado: boolean;
    extra: boolean;
}