import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Emitter } from '../emitter/emitter';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { VerifyEmitter } from '../emitter/verify_emiiter';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  isVerified: boolean = false;
  verificationCode: String;
  isAuthenticatd = false;

  constructor(private http:HttpClient,
    private router:Router

  ) { }

  ngOnInit(): void {
   Emitter.authenticatd.subscribe((auth:boolean)=>{
      this.isAuthenticatd = auth;
    })    
    VerifyEmitter.isVerified.subscribe((verify:boolean)=>{
      this.isVerified = verify;
    })
  }




  logout(){
    this.http.post('http://localhost:8080/logout',{},{withCredentials:true})
    .subscribe((res:any)=>{
      Emitter.authenticatd.emit(false);
      Swal.fire({
                title: 'Success!',
                text: res.message,
                icon: 'success',
                confirmButtonText: 'Okay'
              });
      this.router.navigate(['/login']);
  }),
  (error:any)=>{
    Emitter.authenticatd.emit(true);
    Swal.fire({
      title: 'Error!',
      text: error.error?.message,
      icon: 'error',
      confirmButtonText: 'Try Again'
    });
  }
  }

  sendEmail(){
    this.http.post('http://localhost:8080/vermail', {}, { withCredentials: true })

    .subscribe((res:any)=>{
      console.log(res);
      Swal.fire({
        title: 'Success!',
        text: res.message,
        icon: 'success',
        confirmButtonText: 'Okay'
      });
    }),
    (error:any)=>{
      console.log(error);
      Swal.fire({
        title: 'Error!',
        text: error.error?.message,
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }

}

}