import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {position:'bottom', display: false},
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'June',
            fontStyle: 'bold'
         },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
              },
            display: true,
            ticks: {
              fontStyle: 'bold'
            }
        }
      ],
       yAxes: [
         
          {
            ticks: {
              stepSize: 45,
              max: 225,
              beginAtZero: true,
              fontStyle: 'bold'
           },
            display: true,
        }]
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = []

  //   { data: [ 170, 0, 0 ], label: 'Series A',  barThickness: 15, backgroundColor:'#54eab7' },
  //   { data: [ 0, 110, 0 ], label: 'Series B', barThickness: 15, backgroundColor:'#fdd327' },
  //   { data: [ 0, 0, 105 ], label: 'Series C', barThickness: 15, backgroundColor:'#ff8c8c' },
  // ];

  @Input() testsforchart: any;
  @Input() barChartLabels_: any;

  // public barChartColors: Color[] = [
  //   { backgroundColor: 'red' },
  //   { backgroundColor: 'green' },
  // ]

  constructor() { }

  ngOnInit(): void {
    this.barChartData = this.testsforchart;
    this.barChartLabels = this.barChartLabels_;
  }

}
