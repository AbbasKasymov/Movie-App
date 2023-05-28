import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private movieService: MovieService,
    private router: Router
    ){}

  goToClearSearchPage(){
    this.movieService.clearLastSearchResults()
    this.router.navigate(['/search'])
  }
}
