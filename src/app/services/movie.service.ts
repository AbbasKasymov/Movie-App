import { catchError, Observable, of } from 'rxjs';
import { Movie } from './../models/movie';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '268f3c8';
  private baseUrl = 'http://www.omdbapi.com/';
  private lastSearchResults: Movie[] = [];

  constructor(private http: HttpClient) {}

  // Поиск фильмов по названию
  searchMovies(title: string): Observable<object> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(title)}`;
    return this.http.get<object>(url).pipe(
      catchError((error: any) => {
        // Обработка ошибки
        console.error('Error in searchMovies:', error);
        return of({});
      })
    );
  }

  // Получение подробной информации о фильме по его ID
  getMovieDetails(id: string): Observable<Movie> {
    const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${id}`;
    return this.http.get<Movie>(url).pipe(
      catchError((error: any) => {
        // Обработка ошибки
        console.error('Error in getMovieDetails:', error);
        return of({} as Movie);
      })
    );
  }

  // Установка последних результатов поиска
  setLastSearchResults(results: Movie[]): void {
    this.lastSearchResults = results;
  }

  // Получение последних результатов поиска
  getLastSearchResults(): Movie[] {
    return this.lastSearchResults;
  }

  // Очистка последних результатов поиска
  clearLastSearchResults(): void {
    this.lastSearchResults = [];
  }
}
