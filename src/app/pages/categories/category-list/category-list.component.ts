import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Categoria } from '../shared/categoria.model';
import { CategoriaService } from '../shared/categoria.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categorias: Categoria[] = [];
  searchForm: FormGroup;

  constructor(private categoriaService: CategoriaService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias,
      error => alert('Erro ao carregar a lista')
    );
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
      this.categoriaService.deleteCategoria(categoria.id).subscribe(
        () => this.categorias = this.categorias.filter(element => element != categoria),
        () => alert('Erro ao tentar excluir')
      )
    }
  }

  submitForm(){
    const key: string = this.searchForm.get('keyword').value;

    if(key == ''){
      this.refresh()
    }else{
      this.categorias = this.categorias.filter(element => element.nome.includes(key))
    }
  }

  refresh(){
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias,
      error => alert('Erro ao carregar a lista')
    );
  }

}
