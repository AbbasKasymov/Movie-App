import { ToastrService } from 'ngx-toastr';
import { Movie } from './../../models/movie';
import { MovieService } from './../../services/movie.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movieId: string = '';
  movieDetails: Movie | undefined;
  isBusy: boolean = true; // Переменная, указывающая на загрузку данных

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
      this.loadMovieDetails();
    });
  }

  loadMovieDetails() {
    this.isBusy = true; // Установка isBusy в true перед загрузкой данных

    this.movieService.getMovieDetails(this.movieId).subscribe({
      next: (data) =>  {
        this.movieDetails = data; // Присваивание полученных данных переменной movieDetails
        this.isBusy = false; // Установка isBusy в false после загрузки данных
      },
      error: (error) => {
        this.isBusy = false; // Установка isBusy в false в случае ошибки
        this.toastr.error('Failed to load movie details. Please try again later.') ; // Отображение сообщения об ошибке с помощью ToastrService
        console.error(error); // Вывод ошибки в консоль дебагинга
      }
    })
  }

  goBack() {
    this.router.navigate(['/search']); // Перенаправление пользователя на страницу поиска
  }
}
