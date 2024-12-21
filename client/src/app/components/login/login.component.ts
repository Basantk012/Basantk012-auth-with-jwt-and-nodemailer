import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  form :FormGroup;
  constructor(
   private formBuilder :FormBuilder,
       private http :HttpClient,
       private router :Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email :'',
      password : ''
    })
  }

  submit(): void {
    const user = this.form.getRawValue();
  
    this.form.reset();
  
    this.http.post("http://localhost:8080/login", user, { withCredentials: true })
      .subscribe(
        (res: any) => {
          console.log(res);
          Swal.fire({
            title: 'Success!',
            text: res.message,
            icon: 'success',
            confirmButtonText: 'Okay'
          });
          this.router.navigate(['']);
        },
        (error: any) => {
          Swal.fire({
            title: 'Error!',
            text: error.error?.message || 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
          // console.log(`${error.error?.message}`);
        }
      );
  }

  Forgot(){
    this.router.navigate(['forgetpassword']);
  }
  

}
