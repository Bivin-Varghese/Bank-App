import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  // register success loading 
  regSuccessloading: string = ''

  //register  already exists message
  regErrorMsg: string = ''


  constructor(private registerFB: FormBuilder, private api: ApiService, private registerRoute: Router) { }

  //form group creation
  registerForm = this.registerFB.group({
    //array creation
    username: ['', [Validators.required, Validators.pattern('[a-zA-Z\\s]*')]],
    acno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
  })
  //control passes to register.html

  register() {
    alert('registered')
    // console.log(this.registerForm.value);

    if (this.registerForm.valid) {
      let username = this.registerForm.value.username
      let acno = this.registerForm.value.acno
      let password = this.registerForm.value.password

      this.api.register(acno, username, password).subscribe((result: any) => {
        alert(result.message)
        this.regSuccessloading = result.message //sucessfuly registerd

        setTimeout(() => {
          //redirect to login page
          this.registerRoute.navigateByUrl('')
        }, 2000);


      }, ((result: any) => {
        this.regErrorMsg = result.error.message
      }))

      setTimeout(() => {
        this.registerForm.reset()
        this.regErrorMsg = ''
      }, 2000)


    }


    else {
      alert('Invalid data')
    }


  }
}
