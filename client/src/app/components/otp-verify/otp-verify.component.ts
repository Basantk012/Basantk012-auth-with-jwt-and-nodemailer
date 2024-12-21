import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { VerifyEmitter } from '../emitter/verify_emiiter';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-otp-verify',
  templateUrl: './otp-verify.component.html',
  styleUrls: ['./otp-verify.component.css']
})
export class OtpVerifyComponent implements OnInit {
  form: FormGroup;  

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      otp: ""
    });
  }

  submit(): void {
    
    const otp = this.form.value.otp?.trim();
    if (!otp) {
      Swal.fire({
              title: 'Error!',
              text: 'OTP is required',
              icon: 'error',
              confirmButtonText: 'Try Again'
            });
      return;
    }
  
  
    this.http.post('http://localhost:8080/verifyEmail', { otp }, { withCredentials: true })
      .subscribe(
        (response: any) => {
          Swal.fire({
                  title: 'Success!',
                  text: response.message,
                  icon: 'success',
                  confirmButtonText: 'Okay'
                });
          // console.log('OTP Verification Success:', response.message);
          VerifyEmitter.isVerified.emit(true);
  
          this.router.navigate(['']);
        },
        (error: any) => {
          console.error('OTP Verification Failed:', error.error?.message);
          Swal.fire({
            title: 'Error!',
            text: error.error.message,
            icon: 'error',
            confirmButtonText: 'Try Again'
          });
        }
      );
  }
  
  
}
