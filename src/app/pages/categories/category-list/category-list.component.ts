import { Component, OnInit } from '@angular/core';

import { Categoria } from '../shared/categoria.model';
import { CategoriaService } from '../shared/categoria.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService) { }

  ngOnInit() {
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias,
      error => alert('Erro ao carregar a lista')
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

}
