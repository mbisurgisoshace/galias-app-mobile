export interface Location {
    type: string;
    coordinate: number[];
}

export interface Direccion {
    _id: string;
    calle: string;
    altura: string;
    localidad: string;
    codigoPostal: string;
    geometry: Location;
}

export interface Cliente {
    _id: string;
    codigo: string;
    razonSocial: string;
    sucursales: Direccion[];
}