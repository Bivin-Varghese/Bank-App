import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  //to hold login error message
  loginErrorMsg: string = ""

  //to hold spinner in  login button
  loginSuccessStatus: boolean = false


  constructor(private registerFB: FormBuilder, private api: ApiService, private loginRoute: Router) { }


  //form group creation
  loginForm = this.registerFB.group({
    //array creation
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })

  //control passes to register.html


  login() {
    // alert('loged in')
    // console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      let acno = this.loginForm.value.acno
      let password = this.loginForm.value.password
      this.api.login(acno, password).subscribe((result: any) => {

        this.loginSuccessStatus = true

        //store current user inthe local storage
        localStorage.setItem('currentUser',result.currentUser)

        //store token in local storage
        localStorage.setItem("token",result.token)

        //store acno in local storage
        localStorage.setItem("currentAcno",result.currentAcno)



        
        setTimeout(()=>{

          this.loginRoute.navigateByUrl('/dashboard') //redirect to dashboard

        },2000)

      },
        (result: any) => {
          this.loginErrorMsg = result.error.message

          setTimeout(() => {
            this.loginForm.reset()
            this.loginErrorMsg = ""
          }, 1500)
        }
      )
    }
    else {
      alert('Invalid data')
    }
  }


}
