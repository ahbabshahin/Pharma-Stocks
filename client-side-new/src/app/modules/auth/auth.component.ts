import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

  constructor(private router: Router) { }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    const token = sessionStorage.getItem('accessToken');
    console.log('token: ', token);
    if (token) this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(){}
}
