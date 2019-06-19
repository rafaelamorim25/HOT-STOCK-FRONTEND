import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ProdutoService} from '../shared/produto.service';
import { Produto } from '../shared/produto.model'

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  private produtos: Produto[];
  searchForm: FormGroup;

  constructor(private produtoService: ProdutoService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.refresh();
    this.buildSearchForm();
  }

  private buildSearchForm(){
    this.searchForm = this.formBuilder.group(
      {
        keyword: ['']
      }
    )
  }

  deleteCategoria(categoria) {
    const mustDelete = confirm('Deseja realmente excluir ?');

    if (mustDelete) {
      this.produtoService.deleteProduto(categoria.id).subscribe(
        () => this.produtos = this.produtos.filter(element => element != categoria),
        () => alert('Erro ao tentar excluir')
      )
    }
  }

  submitForm(){
    const key: string = this.searchForm.get('keyword').value;

    if(key == ''){
      this.refresh()
    }else{
      this.produtos = this.produtos.filter(element => element.nome.includes(key))
    }
  }

  refresh(){
    this.produtoService.getProdutos().subscribe(
      categorias => this.produtos = categorias,
      error => alert('Erro ao carregar a lista')
    );
  }

}
