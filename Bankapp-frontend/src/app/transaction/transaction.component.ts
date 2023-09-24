import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jspdf from 'jspdf'
import 'jspdf-autotable'
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  allTransactions: any = []

  //to hold user search
  searchTerm: string = ''

  constructor(private api: ApiService,private transactionRouter:Router) { }

  ngOnInit(): void {
    
    if(!localStorage.getItem('token')){
      alert('please login')
      this.transactionRouter.navigateByUrl('')
    }

    this.api.getTransaction().subscribe((result: any) => {
      console.log(result);
      this.allTransactions = result.transaction

    },
      (result: any) => {
        console.log(result.error.message);

      })
  }

  exportPdf() {
    //1.create an object for jspdf
    var pdf = new jspdf()

    //2.setup title row for table
    let thead = ['Type', 'From Account', 'To Account', 'Amount']

    let tbody = [] //transaction details

    //3.properties for pdf
    pdf.setFontSize(16)
    pdf.text('Mini Statements', 15, 16)

    //4.to display as table , neeed to convert array of objects to nested array
    for (let item of this.allTransactions) {
      let temp = [item.type, item.fromAcno, item.toAcno, item.amount]
      tbody.push(temp)//nested array
    }

    //5.convert nested array to table structure using jspdf-autotable
    (pdf as any).autoTable(thead, tbody)


    //6.to open pdf in another tab
    pdf.output('dataurlnewwindow')

    //7.to download or save pdf
    pdf.save('Transaction history.pdf')
  }

  logout(){
    this.transactionRouter.navigateByUrl('')
    //clear the local storage
    localStorage.clear()
  }
}
