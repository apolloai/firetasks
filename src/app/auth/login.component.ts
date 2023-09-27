import { Component, OnInit } from '@angular/core';
import { signInWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from '@firetasks/models';
import { Observable } from 'rxjs';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  readonly users$ = this.userService.users$;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  async loginAs(user: User) {
    console.log('loginAs', user);
    const credentials = await signInWithEmailAndPassword(getAuth(), user.email, (user as any).password);
    console.log('credentials', credentials);

    this.router.navigate(['/']);
  }
}
