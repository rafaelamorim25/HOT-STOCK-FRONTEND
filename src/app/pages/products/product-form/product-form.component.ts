import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Produto } from '../shared/produto.model';
import { ProdutoService } from '../shared/produto.service';

import { switchMap } from 'rxjs/operators';

import { Categoria } from '../../categories/shared/categoria.model';
import { CategoriaService } from '../../categories/shared/categoria.service';

import toastr from 'toastr';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  produtoForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  produto: Produto = new Produto();
  categorias: Categoria[];

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildProdutoForm();
    this.loadCategorias();
    this.loadProduto();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new'){
      this.createProduto();
    }else{
      this.updateProduto();
    }

  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private buildProdutoForm(){
    this.produtoForm = this.formBuilder.group(
      {
        id: [0],
        nome: ['', Validators.required],
        precoCompra: [0.0],
        precoVenda: [0.0],
        quantidade: [0],
        categoriaId: [0]
      }
    )
  }

  private loadProduto() {
    if (this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.produtoService.getProduto(+params.get('id')))
      )
      .subscribe(
        (produto) => {
          this.produto = produto;
          this.produtoForm.patchValue(produto)
        },
        (error) => alert('Error ao dar o load')
      )
    }
  }

  private loadCategorias() {
    this.categoriaService.getCategorias().subscribe(
      categorias => this.categorias = categorias
    )
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro'
    }else{
      const categoryName = this.produto.nome || ""
      this.pageTitle = "Editando: " + categoryName;
    }
  }

  private createProduto(){
    console.log('Form que chegou:')
    console.log(this.produtoForm.value)
    var produto: Produto = new Produto(
      null,
      this.produtoForm.get('nome').value,
      this.produtoForm.get('precoCompra').value,
      this.produtoForm.get('precoVenda').value,
      this.produtoForm.get('quantidade').value
    )
    this.categoriaService.getCategoria(this.produtoForm.get('categoriaId').value).subscribe(
      c => produto.categoria = c,
      () => console.log("Deu ruim") 
    )
    console.log('O produto que ta sendo salvo: ')
    console.log(produto)
    
    this.produtoService.addProduto(produto)
    .subscribe(
      produto => this.actionsForSuccess(produto),
      error => this.actionsForError(error)
    )
  }

  private updateProduto(){
    const produto: Produto = Object.assign(new Produto(), this.produtoForm.value);
    console.log('O produto é esse: ')
    console.log(produto)
    this.produtoService.updateProduto(produto)
    .subscribe(
      produto => this.actionsForSuccess(produto),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(produto: Produto){
    toastr.success('Solicitação aprovada');

    this.router.navigateByUrl('produtos');
  }

  private actionsForError(error){
    toastr.error('Ocorreu um erro ao processar solicitação');

    this.submittingForm = false;

    if(error.status === 422){
      this.serverErrorMessages = JSON.parse(error._body).serverErrorMessages;
    }else{
      this.serverErrorMessages = ['Falha na comunicação do servidor, tente mais tarde']
    }
  }
}
