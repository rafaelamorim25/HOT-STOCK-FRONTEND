import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Produto } from './produto.model';
import { MessageService } from '../../categories/shared/message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private url = 'http://localhost:8080/produtos';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
    ) { }

  /** GET categorias from the server */
  getProdutos (): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.url, httpOptions)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError<Produto[]>('getProdutos', []))
      );
  }

  /** GET hero by id. Return `undefined` when id not found */
  getProdutosNo404<Data>(id: number): Observable<Produto> {
    const url = `${this.url}/${id}`;
    return this.http.get<Produto[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Produto>(`getProduto id=${id}`))
      );
  }

  /** GET hero by id. Will 404 if id not found */
  getProduto(id: number): Observable<Produto> {
    const url = `${this.url}/${id}`;
    return this.http.get<Produto>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Produto>(`getProduto id=${id}`))
    );
  }

  /* GET heroes whose name contains search term */
  searchProdutos(term: string): Observable<Produto[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Produto[]>(`${this.url}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Produto[]>('searchProduto', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new hero to the server */
  addProduto (hero: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.url, hero, httpOptions).pipe(
      tap((newHero: Produto) => this.log(`added produto`)),
      catchError(this.handleError<Produto>('addProduto'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteProduto (hero: Produto | number): Observable<Produto> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.url}/${id}`;

    return this.http.delete<Produto>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Produto>('deleteProduto'))
    );
  }

  /** PUT: update the hero on the server */
  updateProduto (hero: Produto): Observable<any> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.url}/${id}`;

    return this.http.put(url, hero, httpOptions).pipe(
      tap(_ => this.log(`updated Produto id=${hero.id}`)),
      catchError(this.handleError<any>('updateProduto'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}