import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Movie } from './../../models/movie';
import { MovieService } from './../../services/movie.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  movieNameControl: FormControl; // Форма валидации
  searchResults: Movie[] = []; // Результаты поиска фильмов
  showContent: boolean = false; // Флаг для отображения контента
  isBusy: boolean = false; // Флаг, указывающий, занято ли приложение

  constructor(
    private movieService: MovieService, // Сервис для работы с фильмами
    private toastr: ToastrService, // Сервис для отображения уведомлений
    private router: Router // Сервис для управления маршрутизацией
  ) {
    this.movieNameControl = new FormControl('', [
      Validators.pattern(/^[a-zA-Z0-9\s-]*$/), // Валидатор для проверки на соответствие латинице
      Validators.maxLength(20) // Валидатор для проверки максимальной длины
    ]);

    this.initializeLastSearchResults(); // Запис предыдущих результатов поиска
  }

  private initializeLastSearchResults(): void {
    const lastSearchResults = this.movieService.getLastSearchResults();
    if (lastSearchResults.length > 0) {
      this.showContent = true;
      this.searchResults = lastSearchResults;
    }
  }

  // Поиск фильмов
  searchMovies(): void {
    const query = this.movieNameControl.value.trim();
    if (this.movieNameControl.valid && query.length > 0) {
      this.isBusy = true;

      this.movieService.searchMovies(query).subscribe({
        next: (data) => {
          this.handleSearchResponse(data); // Обработка ответа на поиск
        },
        error: (error) => {
          this.handleSearchError(error); // Обработка ошибки поиска
        }
      });
    } else {
      this.clearSearchResults(); // Очистка результатов поиска
    }
  }

  // Обработка успешного ответа на поиск фильмов
  private handleSearchResponse(data: any): void {
    this.isBusy = false;

    if (data.Response && data.Search) {
      this.searchResults = data.Search; // Загрузка результатов поиска
      this.showContent = true; // Отображение контента
      this.movieService.setLastSearchResults(data.Search); // Сохранение последних результатов поиска
    } else {
      this.handleSearchError(`Movie with name "${this.movieNameControl.value}" is not found`); // Обработка случая, когда фильм не найден
    }
  }

  // Обработка ошибки поиска фильмов
  private handleSearchError(error: string): void {
    this.isBusy = false;
    this.toastr.error(error); // Отображение уведомления об ошибке
    this.clearSearchResults(); // Очистка результатов поиска
  }

  // Очистка результатов поиска
  private clearSearchResults(): void {
    this.searchResults = []; // Очистка массива результатов поиска
    this.showContent = false; // Скрытие контента
    this.movieNameControl.reset(); // Сброс инпута
  }

  // Переход на страницу с подробной информацией о фильме
  goToMovieDetails(movieID: string): void {
    this.router.navigate(['/movie-details', movieID]);
  }
}
