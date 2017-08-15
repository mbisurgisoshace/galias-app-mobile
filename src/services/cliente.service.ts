export class ClienteService {
    private clientes = [];

    constructor() {
        this.initClientes();
    }

    private initClientes() {
        this.clientes = [
            {codigo: '100001', razonSocial: 'Maximiliano Bisurgi', direccion: 'Independencia 185'},
            {codigo: '100002', razonSocial: 'Claudio Bisurgi', direccion: 'Ruta 52 km 3,5'},
            {codigo: '100003', razonSocial: 'Matias Bisurgi', direccion: 'Callao 245'}
        ];
    }

    getClientes() {
        return this.clientes.slice();
    }
}