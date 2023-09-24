import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  deleteSuccessStatus: string = ''


  deleteConfirmStatus: boolean = false

  // to delete account 
  acno: any

  //hold logout status
  logoutStatus: boolean = false

  transferSuccess: string = ''
  trasnferError: string = ''

  balance: any

  //to hold currentAcno
  currentAcno: any;

  //to hold curret user name
  user: string = ''


  isCollapse: boolean = true

  collapse() {
    this.isCollapse = !this.isCollapse
  }

  constructor(private transactionFb: FormBuilder, private api: ApiService, private dashboardRouter: Router) { }

  ngOnInit(): void {

    if (!localStorage.getItem('token')) {
      alert('please login')
      this.dashboardRouter.navigateByUrl('')
    }

    if (localStorage.getItem('currentUser')) {
      this.user = localStorage.getItem('currentUser') || ''
    }

    if (localStorage.getItem('currentAcno')) {
      this.currentAcno = localStorage.getItem('currentAcno') || ''
    }

  }

  // form group creation 
  transactionForm = this.transactionFb.group({
    creditAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]],
    amount: ['', [Validators.required, Validators.pattern('[0-9]*')]]
  })

  getBalance() {
    this.api.getBalance(this.currentAcno).subscribe((result: any) => {
      console.log(result);
      this.balance = result.balance

    },
      (result: any) => {
        alert(result.error.message)
      }
    )
  }

  fundTransfer() {
    if (this.transactionForm.valid) {
      // get details from fund transfer form
      let creditAcno = this.transactionForm.value.creditAcno
      let password = this.transactionForm.value.password
      let amount = this.transactionForm.value.amount

      this.api.fundTrasnsfer(creditAcno, password, amount).subscribe((result: any) => {
        // console.log(result);
        this.transferSuccess = result.message

        setTimeout(() => {
          this.transactionForm.reset()
          this.transferSuccess = ''
        }, 3000)



      }, (result: any) => {
        // console.log(result.error.message);
        this.trasnferError = result.error.message

        setTimeout(() => {
          this.transactionForm.reset()
          this.trasnferError = ''
        }, 3000)

      })


    }
    else {
      alert('invalid form')
    }
  }


  reset() {
    this.transactionForm.reset()
  }

  logout() {
    //clear the local storage
    localStorage.clear()

    this.logoutStatus = true


    setTimeout(() => {
      this.dashboardRouter.navigateByUrl('')

    }, 2000);
  }


  deleteAccount() {
    this.acno = localStorage.getItem('currentAcno')
    this.deleteConfirmStatus = true
  }

  cancelDeleteAccount() {
    //back to normla
    this.acno = ''
    this.deleteConfirmStatus = false
  }


  deleteFromParent() {
    this.api.deleteUser().subscribe((result:any) => {
      localStorage.clear()

      this.deleteSuccessStatus=result.message

      setTimeout(() => {
        this.dashboardRouter.navigateByUrl('')

      }, 2000)

    })
  }
}
