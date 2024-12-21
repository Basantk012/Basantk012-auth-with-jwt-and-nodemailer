import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface ServerResponse {
  message: string;
  [key: string]: any; // Allows additional properties if needed
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit {
form : FormGroup;
  constructor(
    private formBuilder :FormBuilder,
    private http :HttpClient,
    private router :Router
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fname :"",
      email : "",
      password : ""
    })
  }

  submit(): void {
    const user = this.form.getRawValue();

    this.http.post<ServerResponse>('http://localhost:8080/register', user).subscribe({
      next: (response) => {
       
        // console.log(response.message);
        // alert(response.message); 
        // Swal.fire("success",response.message)
        Swal.fire({
          title: 'Success!',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'Okay'
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        
        // Swal.fire("error",error.error?.message)
        Swal.fire({
          title: 'Error!',
          text: error.error?.message,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
        
        
      }
    });
  }
}