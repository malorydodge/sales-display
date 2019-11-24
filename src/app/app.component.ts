import { Component, NgModule, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SalesService } from './sales.service';
import { Chart } from 'chart.js';
import { Data } from './Data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedCountry: string = '';
  //event handler for the select element's change event
  selectChangeHandler (event: any) {
    //update the ui
    this.selectedCountry = event.target.value;
  }
  public chart:Chart;
  sale_price =[];
  make = [];
  model = [];
  import_country =[];
  title = 'Vandelay Industries';
  public data:any =[];
  constructor(private _sales:SalesService) {}
  ngOnInit() {
    this._sales.getSales().subscribe((res: Data[]) => {
      res.forEach(y => {
        this.import_country.push(y.import_country);
      });
      let unique = [...new Set(this.import_country.sort())];
      console.log(unique)
      var select = document.getElementById("selectCountry");
      select.removeChild(select.childNodes[1]);
      for(var i = 0; i < unique.length; i++) {
        var opt = unique[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
    }​
    });
  }
  drawChart(){
    var c = <HTMLCanvasElement> document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height); // clear canvas for new chart
    
    if(this.chart != undefined || this.chart != null){
      this.chart.destroy();
    }
    this.make =[]; // clear arrays for new values
    this.model=[];
    this.sale_price =[];
    var country = this.selectedCountry;
    this._sales.getSalesByCountry(country).subscribe((res: Data[]) => {
      res.forEach(y => {
        this.make.push(y.make);
        this.model.push(y.model);
        this.sale_price.push(y.sale_price);
      });
    let unique_makes = [...new Set(this.make.sort())];
    var sales_by_make = new Array(unique_makes.length);
    sales_by_make.fill(0);
    for(var i=0; i < this.make.length; i++){
      for (var j=0; j <unique_makes.length; j++){
        if (this.make[i] == unique_makes[j]){
            sales_by_make[j]+=this.sale_price[i];
        }
      }
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: unique_makes, 
        datasets: [ {
          backgroundColor: "pink",
          borderColor: "red",
          borderWidth: 1,
          data: sales_by_make
        },
        ]
      },
      options: {
        responsive: true,
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
    });
  }
}