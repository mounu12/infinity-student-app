import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.css']
})
export class DonutChartComponent implements OnInit {

  // Doughnut
  public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
  ];
  public doughnutChartType: ChartType = 'doughnut';
  //  public doughnutChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80], label: 'Series A', barThickness: 0.2 }
  // ];
  public doughnutcolors: Color[] = [
    {
      backgroundColor: ['#6CD5B1', '#ff8c8c', '#e5e9ec'],
      borderWidth: 0
    }
  ]

  public options: ChartOptions = {
    responsive: true, 
    //aspectRatio: 1,
    cutoutPercentage: 90,
    legend: {
      display: false,
      position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true,
        padding: 30,
      }
    }
  };

  @Input('donchd') donchd: any;

  constructor() { }

  ngOnInit(): void {

    this.doughnutChartLabels = this.donchd.labels;
    this.doughnutChartData = this.donchd.data;


    this.donchd.count;
    this.donchd.wronganswercount;
    this.donchd.correctanswercount;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes)
  }

}
