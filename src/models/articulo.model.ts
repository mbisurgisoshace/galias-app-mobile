export interface Articulo {
    _id: string;
    codigo: string;
    descripcion: string;
    precios: {tipo: number, precio: number}[];
}