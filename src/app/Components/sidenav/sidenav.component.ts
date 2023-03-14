import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent {

  ngDoCheck(){
    if(localStorage.getItem("isLoggedIn")!=null){
      this.isLoggedIn=true;
    }else{
      this.isLoggedIn=false;
    }
  }

  @ViewChild('drawer') drawer: MatSidenav | any;

  isHandset: boolean = false;

  isLoggedIn:boolean | any=localStorage.getItem('isLoggedIn');

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe('(max-width: 812px)')
    .pipe(map((result) => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$.subscribe((value) => {
      this.isHandset = value;
    });
  }

  toggleSidenav() {
    if (this.isHandset) {
      this.drawer.toggle();
    }
  }

  logout(){
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("myData");
  }
}
