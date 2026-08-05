import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';
import { SignIn } from './components/sign-in/sign-in';
import { ForgotPass } from './components/forgot-pass/forgot-pass';
import { NewPass } from './components/new-pass/new-pass';
import { Layout } from './components/layout/layout';
import { Projects } from './components/projects/projects';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SignUp, SignIn, ForgotPass, NewPass, Layout, Projects],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Taskly');
}
