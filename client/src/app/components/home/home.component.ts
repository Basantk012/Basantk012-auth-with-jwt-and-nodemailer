import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output } from '@angular/core';
import { Emitter } from '../emitter/emitter';
import { VerifyEmitter } from '../emitter/verify_emiiter';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
      isLoggedIn = false;
      userName= '';
  
      
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.http.get('http://localhost:8080/home',{withCredentials:true})
    .subscribe((res :any)=>{
      console.log(res);
      this.isLoggedIn = true;
      this.userName = res.name;
      Emitter.authenticatd.emit(true);
      VerifyEmitter.isVerified.emit(res.user.isVerified);
    }),
    (err:any)=>{
      console.log(err);
      this.isLoggedIn = false;
      Emitter.authenticatd.emit(false);
    }
  }

}
