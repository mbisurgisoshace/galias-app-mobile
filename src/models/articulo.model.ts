export interface Equivalencia {
    unidad: string,
    equivalencia: number,
    defecto: boolean
}

export interface Articulo {
    _id: string;
    codigo: string;
    descripcion: string;
    unidadesVta: Equivalencia[];
    precioVta: number;
}