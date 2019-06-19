import { Categoria } from '../../categories/shared/categoria.model';

export class Produto {

    constructor(
        public id?: number,
        public nome?: string,
        public precoCompra?: number,
        public precoVenda?:number,
        public quantidade?:number,
        public categoria?: Categoria
    ){}
}