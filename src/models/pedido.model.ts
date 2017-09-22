import { Cliente } from './cliente.model';
import { Articulo } from './articulo.model';

export interface Pedido {
    _id?: string;
    fecha: string;
    cliente: Cliente;
    comentario: string;
    items: any[];
    total: number;
    estado: string;
    enviado: boolean;
}