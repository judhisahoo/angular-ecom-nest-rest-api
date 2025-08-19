import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  //private readonly pageTitle = signal('Home page for Dynamic tutle');
  public title = 'angular-ecom-nest-JS';
  constructor(private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Home page for Dynamic tutle');
  }
}
