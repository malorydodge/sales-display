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
  sale_price =[]; 
  country ="";
  make = [];
  unique_makes=[];
  sales_by_make=[];
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
    this.make =[]; // clear arrays for new values
    this.model=[];
    this.sale_price =[];
    this.country = this.selectedCountry; // get user's selection
    document.getElementById("chartTitle").innerHTML = 
    "Sales by Make of "+ this.country;
    this._sales.getSalesByCountry(this.country).subscribe((res: Data[]) => {
      res.forEach(y => {
        this.make.push(y.make);
        this.model.push(y.model);
        this.sale_price.push(y.sale_price);
      });
    this.unique_makes = [...new Set(this.make)]; // create new array without duplicate makes
    this.unique_makes.sort();
    this.sales_by_make = new Array(this.unique_makes.length);
    this.sales_by_make.fill(0);
    for(var i=0; i < this.make.length; i++){
      for (var j=0; j <this.unique_makes.length; j++){
        if (this.make[i] == this.unique_makes[j]){
            this.sales_by_make[j]+=this.sale_price[i]; // add total sales of each model
        }
      }
    }
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.unique_makes, 
        datasets: [ {
          backgroundColor: "pink",
          borderColor: "red",
          borderWidth: 1,
          data: this.sales_by_make
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
    var c = <HTMLCanvasElement> document.getElementById("canvas");
    c.style.display = "none";
    var givenMake = this.unique_makes[index];
    document.getElementById("chartTitle").innerHTML = 
    givenMake+" sales by Model in "+ this.country;
    document.getElementById("instructions").innerHTML = 
    "";
    var models_by_make = [];
    for(var i =0;i<this.model.length;i++){ // loop through all models
      if(this.make[i] === givenMake){ // if the make of this model is the given make 
        models_by_make.push(this.model[i]); // add to list of make's models
      }
    }
    var unique_models = [...new Set(models_by_make.sort())]; // create new array without duplicate models
    var sales_by_model = new Array(unique_models.length);
    sales_by_model.fill(0);
    for(var i=0; i < this.model.length; i++){
      for (var j=0; j <unique_models.length; j++){
        if (this.model[i] == unique_models[j]){
            sales_by_model[j]+=this.sale_price[i]; // add total sales of each model
        }
      }
    }
    var c2 = <HTMLCanvasElement> document.getElementById("canvas2");
    var ctx = c2.getContext("2d");    
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          data: sales_by_model,
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
        labels: unique_models
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
