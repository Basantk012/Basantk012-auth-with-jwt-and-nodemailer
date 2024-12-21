import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, } from '@angular/common/http';
import { FormBuilder, FormGroup} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.component.html',
  styleUrls: ['./forget-pass.component.css']
})
export class ForgetPassComponent implements OnInit {
  isMailed = false;
    form :FormGroup;
  constructor(
    private http : HttpClient,
    private router : Router,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email :'',
      otp : '',
      password : '',
    })
  }
submit(){
    const data = this.form.getRawValue();
    console.log(data);
    this.http.post('http://localhost:8080/forgetPassword',  data )
    .subscribe(
      (res:any)=>{
        // console.log(res);
        Swal.fire({
                    title: 'Success!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  });
        this.router.navigate(['/login']);
      },
      (error:any)=>{
        Swal.fire({
          title: 'Error!',
          text: error.error?.message || 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
        // console.log(error);
      }
    )
}
sendOtp(){
    const email = this.form.get('email')?.value;
    console.log(email);
    this.http.post('http://localhost:8080/sendotp', { email })
    .subscribe(
      (res: any) => {
        this.isMailed = true;
        // console.log(res);
        Swal.fire({
                    title: 'Success!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'Okay'
                  });
      },
      (error: any) => {
        this.isMailed = false;
        Swal.fire({
                    title: 'Error!',
                    text: error.error?.message || 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Try Again'
                  });
        // console.log(error);
      }
    );
  }
}

