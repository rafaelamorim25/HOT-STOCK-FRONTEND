import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Categoria } from '../shared/categoria.model';
import { CategoriaService } from '../shared/categoria.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoriaForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  categoria: Categoria = new Categoria();

  constructor(
    private categoriaService: CategoriaService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoriaForm();
    this.loadCategoria();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new'){
      this.createCategoria();
    }else{
      this.updateCategoria();
    }

  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new'
    } else {
      this.currentAction = 'edit'
    }
  }

  private buildCategoriaForm(){
    this.categoriaForm = this.formBuilder.group(
      {
        id: [0],
        nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
      }
    )
  }

  private loadCategoria() {
    if (this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.categoriaService.getCategoria(+params.get('id')))
      )
      .subscribe(
        (categoria) => {
          this.categoria = categoria;
          this.categoriaForm.patchValue(categoria)
        },
        (error) => alert('Error ao dar o load')
      )
    }
  }

  private setPageTitle(){
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro'
    }else{
      const categoryName = this.categoria.nome || ""
      this.pageTitle = "Editando: " + categoryName;
    }
  }

  private createCategoria(){
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);
    this.categoriaService.addCategoria(categoria)
    .subscribe(
      categoria => this.actionsForSuccess(categoria),
      error => this.actionsForError(error)
    )
  }

  private updateCategoria(){
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);

    this.categoriaService.updateCategoria(categoria)
    .subscribe(
      categoria => this.actionsForSuccess(categoria),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(categoria: Categoria){
    toastr.success('Solicitação aprovada');

    this.router.navigateByUrl('categorias', {skipLocationChange: true})
    .then(
      () => this.router.navigate(['categorias', categoria.id, 'edit'])
    )
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
