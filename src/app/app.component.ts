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
  public pieChart:Chart;
  country ="";
  import_country =[];
  public sales:Data[] = [];
  makes = [];
  models = [];
  model_sales=[];
  make_sales=[];
  title = 'Vandelay Industries';
  public data:any =[];
  constructor(private _sales:SalesService) {}
  ngOnInit() {
    this._sales.getSales().subscribe((res: Data[]) => {
      res.forEach(y => {
        this.import_country.push(y.import_country);
      });
      let unique = [...new Set(this.import_country.sort())];
      var select = document.getElementById("selectCountry");
      select.removeChild(select.childNodes[1]);
      for(var i = 0; i < unique.length; i++) { // create list of import countries 
        var opt = unique[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el); // populate drop down
    }​
    });
  }
  drawChart(){ // create bar chart for given country's total sales by make
    this.makes=[];
    this.make_sales =[];
    this.sales =[];
    document.getElementById("instructions").innerHTML = 
    "<br>For sales information on which models of each make are selling best, click on the make in the graph!<br><br>";
    var c = <HTMLCanvasElement> document.getElementById("canvas");
    var ctx = c.getContext("2d");    
    if(this.chart != undefined || this.chart != null){
      this.chart.destroy();
    }
    if(this.pieChart != undefined || this.pieChart != null){
      this.pieChart.destroy();
    }
    var btn =document.getElementById("back");
    if(btn != undefined || btn != null){
      btn.hidden = true;
    }
    this.country = this.selectedCountry; // get user's selection
    document.getElementById("chartTitle").innerHTML = 
    "Sales by Make of "+ this.country;
    this._sales.getSalesByCountry(this.country).subscribe((res: Data[]) => {
      res.forEach(y => {
        this.sales.push(y); // add sale object to array
      });
    this.makes = [...new Set(this.sales.map(function getMakes(sale) { // get each make in sales
      return sale.make;
    }))].sort();
    var sales_of=[]
    this.makes.forEach(make => {
      sales_of = this.sales.map(function getMakes(sale) { // filter to match sales of given make
        if(sale.make == make) return sale.sale_price;
      });      
      var filtered = sales_of.filter(function (el) { // filter out nonmatching sales
        return el != null;
      });
      function getSum(total, num) { 
        return total + Math.round(num);
      }
      var make_sale_total = filtered.reduce(getSum, 0); // total up sales
      this.make_sales.push(make_sale_total);
    });
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.makes, 
        datasets: [ {
          backgroundColor: "pink",
          borderColor: "red",
          borderWidth: 1,
          data: this.make_sales
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
            display: true,
            ticks: {
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                  return '$' + value;
              }
          },
        }]
        }
      }
    });
    let self = this; // store current scope
    c.onclick = function(evt) {
      var activePoints = self.chart.getElementsAtEvent(evt);
      if (activePoints[0]) {
        var idx = activePoints[0]['_index'];
        self.drawPieChart(idx);
      }
    };
    }); 
    }
  drawPieChart(index){
    this.models =[];
    this.model_sales =[];
    var c = <HTMLCanvasElement> document.getElementById("canvas");
    c.style.display = "none";
    var givenMake = this.makes[index];
    document.getElementById("chartTitle").innerHTML =  givenMake+" sales by Model in "+ this.country;
    document.getElementById("instructions").innerHTML =  "";
    var _models = [...new Set(this.sales.map(function getModels(sale) { // get each make in sales
      if (sale.make == givenMake) return sale.model;
    }))].sort();
    this.models = _models.filter(function (el) { // filter out any null results
      return el != undefined;
    });
    var sales_of=[]
    this.models.forEach(model => {
        sales_of = this.sales.map(function getMakes(sale) { // filter to match sales of given model
          if(sale.model == model) return sale.sale_price;
        });      
        var filtered = sales_of.filter(function (el) { // filter out nonmatching sales
          return el != null;
        });
        function getSum(total, num) { 
          return total + Math.round(num);
        }
        var make_sale_total = filtered.reduce(getSum, 0); // total up sales
        this.model_sales.push(make_sale_total);
    }); 
    var c2 = <HTMLCanvasElement> document.getElementById("canvas2");
    var ctx = c2.getContext("2d");    
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: this.model_sales,
          backgroundColor: [
            "#F7464A", "#46BFBD", "#FDB45C", '#e6194b', 
            '#3cb44b', '#ffe119', '#4363d8', '#f58231', 
            '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', 
            '#fabebe', '#008080', '#e6beff', '#9a6324', 
            '#fffac8', '#800000', '#aaffc3', '#808000', 
            '#ffd8b1', '#000075', '#808080', '#ffffff',
            '#000000', "#F7464A", "#46BFBD", "#FDB45C",
            '#e6194b', '#3cb44b', '#ffe119', '#4363d8', 
            '#f58231', '#911eb4', '#46f0f0', '#f032e6', 
            '#bcf60c', '#fabebe', '#008080', '#e6beff', 
            '#9a6324', '#fffac8', '#800000',  '#aaffc3', 
            '#808000', '#ffd8b1', '#000075',  '#808080', 
            '#ffffff', '#000000'
          ]
        }],
        labels: this.models
      },
      
      options: {
        responsive: true,
      }
    });
    var btn =document.getElementById("back");
    if(btn != undefined || btn != null){
      btn.innerHTML = "Back to Sales by Make of "+this.country;
      btn.hidden = false;
    }
    else{
      btn = document.createElement("BUTTON");
      btn.style.justifyContent="center";
      btn.id ="back";
      btn.innerHTML = "Back to Sales by Make in "+this.country;
      var self=this; // store current scope
      document.getElementById("instructions").appendChild(btn);
      btn.onclick = function(evt){
        self.pieChart.destroy();
        c.style.display = "block";
        document.getElementById("instructions").innerHTML = 
        "<br>For sales information on which models of each make are selling best, click on the make in the graph!<br><br>";
        document.getElementById("chartTitle").innerHTML = 
        "Sales by Make of "+ self.country;
      }}
    
  }

}
