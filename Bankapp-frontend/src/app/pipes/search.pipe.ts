import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(allTransactions: any[], searchTearm: string, propertyName: string): any[] {


    const result: any = []


    if (!allTransactions || searchTearm == '' || propertyName == '') {
      return allTransactions
    }
    allTransactions.forEach((item: any) => {
      if (item[propertyName].trim().toLowerCase().includes(searchTearm.trim().toLowerCase())) {
        result.push(item)
      }
    })

    return result;
  }

}
