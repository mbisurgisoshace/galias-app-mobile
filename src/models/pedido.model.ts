import { Cliente } from './cliente.model';
import { Articulo } from './articulo.model';

export interface Pedido {
    _id?: string;
    fecha: string;
    cliente: Cliente;
    items: {articulo: Articulo, cantidad: number, precio: number}[];
    total: number;
    estado: string;
    enviado: boolean;
}