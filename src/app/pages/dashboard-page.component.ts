import { Component, OnInit } from '@angular/core';
import {AuthService} from "app/shared/auth.service";
import {DbfirebaseService} from "app/shared/database.service";
import {ActivityCount, IndividualUserActivityCount} from "app/shared/user-info";

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {
    private listOfActivitiesKeys: Array<any>;
    private listOfUsers: Array<any>;
    private arrayOfAllUserActivities: Array<any> = [];
    private allListOfActivities: object = {};
    private activityCount = new ActivityCount();
    private lineChartDataLoaded = false;
    private doughnutChartDataLoaded = false;
    private individualUserActivityCount = new IndividualUserActivityCount();
    public doughnutChartLabels: string[] = ['Favorite', 'UpVote', 'Search', 'QuestionClick', 'DownVote'];
    public doughnutChartData: number[] = [0, 0, 0, 0];
    public doughnutChartType: string = 'doughnut';
    private questionList: Array<any> = [];
    private questionCount: object = {};
  constructor(private authService: AuthService, private dbservice: DbfirebaseService) {
      this.activityCount.Favorite = 0;
      this.activityCount.UpVote = 0;
      this.activityCount.DownVote = 0;
      this.activityCount.Search = 0;
      this.activityCount.QuestionClick = 0;

      this.individualUserActivityCount.Favorite = 0;
      this.individualUserActivityCount.UpVote = 0;
      this.individualUserActivityCount.DownVote = 0;
      this.individualUserActivityCount.Search = 0;
      this.individualUserActivityCount.QuestionClick = 0;

      this.authService.currentUser().subscribe(user=>{
          this.dbservice.getListOfActivities().subscribe(listOfActivities=>{
              if(listOfActivities != null) {
                  for(let i = 0; i < listOfActivities.length; i++){
                      // if (listOfActivities[i].$key == user.uid) {
                      //     this.actualListOfActivities = listOfActivities[i];
                      //     this.listOfActivitiesKeys = Object.keys(listOfActivities[i]);
                      // }
                      this.allListOfActivities[listOfActivities[i].$key] = new IndividualUserActivityCount();
                      this.allListOfActivities[listOfActivities[i].$key].Favorite = 0;
                      this.allListOfActivities[listOfActivities[i].$key].UpVote = 0;
                      this.allListOfActivities[listOfActivities[i].$key].Search = 0;
                      this.allListOfActivities[listOfActivities[i].$key].QuestionClick = 0;
                      this.allListOfActivities[listOfActivities[i].$key].DownVote = 0;

                      this.listOfActivitiesKeys = Object.keys(listOfActivities[i]);
                      // console.log(listOfActivities[i]);
                      for(let j = 0; j < this.listOfActivitiesKeys.length; j++){
                          if (listOfActivities[i].$key === user.uid) {
                              if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'favorite-action'){
                                  this.individualUserActivityCount.Favorite += 1;
                              }
                              else if( listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'upvote-action' ){
                                  this.individualUserActivityCount.UpVote += 1;
                              }else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'downvote-action'){
                                this.individualUserActivityCount.DownVote += 1;
                              }
                              else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'fetch-action'){
                                  this.individualUserActivityCount.Search += 1;
                              }
                              else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'click-action'){
                                  this.individualUserActivityCount.QuestionClick += 1;
                              }
                          }
                          if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'favorite-action'){
                              this.activityCount.Favorite += 1;
                              this.allListOfActivities[listOfActivities[i].$key].Favorite += 1;
                          }
                          else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'upvote-action' ){
                              this.activityCount.UpVote += 1;
                              this.allListOfActivities[listOfActivities[i].$key].UpVote += 1;
                          }
                          else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'downvote-action' ){
                            this.activityCount.DownVote += 1;
                            this.allListOfActivities[listOfActivities[i].$key].DownVote += 1;
                          }
                          else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'fetch-action'){
                              this.activityCount.Search += 1;
                              this.allListOfActivities[listOfActivities[i].$key].Search += 1;
                          }
                          else if(listOfActivities[i][this.listOfActivitiesKeys[j]].action === 'click-action'){
                              this.activityCount.QuestionClick += 1;
                              if(this.questionList.indexOf(listOfActivities[i][this.listOfActivitiesKeys[j]].subject) == -1){
                                  this.questionList.push(listOfActivities[i][this.listOfActivitiesKeys[j]].subject);

                              }
                              this.allListOfActivities[listOfActivities[i].$key].QuestionClick += 1;

                          }
                      }

                      // console.log(this.allListOfActivities);
                  }
                  if (this.doughnutChartType === 'pie') {
                      this.doughnutChartData[0] = this.activityCount.Favorite;
                      this.doughnutChartData[1] = this.activityCount.UpVote;
                      this.doughnutChartData[2] = this.activityCount.Search;
                      this.doughnutChartData[3] = this.activityCount.QuestionClick;
                      this.doughnutChartData[4] = this.activityCount.DownVote;
                  }
                  else{
                      this.doughnutChartData[0] = this.individualUserActivityCount.Favorite;
                      this.doughnutChartData[1] = this.individualUserActivityCount.UpVote;
                      this.doughnutChartData[2] = this.individualUserActivityCount.Search;
                      this.doughnutChartData[3] = this.individualUserActivityCount.QuestionClick;
                      this.doughnutChartData[4] = this.individualUserActivityCount.DownVote;
                  }
                  this.doughnutChartDataLoaded = true;
                  this.listOfUsers = Object.keys(this.allListOfActivities);
                  //console.log(this.listOfUsers);
                  for(let k = 0; k < this.listOfUsers.length; k++){
                      this.arrayOfAllUserActivities[k] = [this.allListOfActivities[this.listOfUsers[k]].Favorite, this.allListOfActivities[this.listOfUsers[k]].UpVote, this.allListOfActivities[this.listOfUsers[k]].Search, this.allListOfActivities[this.listOfUsers[k]].QuestionClick, this.allListOfActivities[this.listOfUsers[k]].DownVote];
                      this.lineChartData[k].data = this.arrayOfAllUserActivities[k];
                  }
                  // this.lineChartData = this.arrayOfAllUserActivities;
                  console.log("---------");
                  console.log(this.lineChartData);
                  this.lineChartDataLoaded = true;
                  //console.log(this.questionList);
                  // console.log(listOfActivities);
              }
          });
      });
  }

  ngOnInit() {
  }

    public lineChartData:any[] = [
        { data: [0, 0, 0, 0], label: 'aaa'},
        { data: [0, 0, 0, 0], label: 'bbb'},
        { data: [0, 0, 0, 0], label: 'ccc'}
    ];
    public lineChartLabels:Array<any> = ['Favorite', 'UpVote', 'Search', 'Question Click', 'DownVote'];
    public lineChartType:string = 'line';
    public pieChartType:string = 'pie';
    public lineChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    

    public randomizeType():void {
        //this.lineChartType = this.lineChartType === 'line' ? 'bar' : 'line';
        this.pieChartType = this.pieChartType === 'doughnut' ? 'pie' : 'doughnut';
    }

    public dynamicChartClicked(e:any):void {
        console.log(e);
    }

    public dynamicChartHovered(e:any):void {
        console.log(e);
    }

    // events
    public chartClicked(e:any):void {
        console.log(e);
    }

    public chartHovered(e:any):void {
        console.log(e);
    }

    public userOrOverall(e:any):void {
        
        this.doughnutChartType = this.doughnutChartType === 'doughnut' ? 'pie' : 'doughnut';
        if (this.doughnutChartType === 'pie') {
            this.doughnutChartData[0] = this.activityCount.Favorite;
            this.doughnutChartData[1] = this.activityCount.UpVote;
            this.doughnutChartData[2] = this.activityCount.Search;
            this.doughnutChartData[3] = this.activityCount.QuestionClick;
            this.doughnutChartData[4] = this.activityCount.DownVote;
        }
        else{
            this.doughnutChartData[0] = this.individualUserActivityCount.Favorite;
            this.doughnutChartData[1] = this.individualUserActivityCount.UpVote;
            this.doughnutChartData[2] = this.individualUserActivityCount.Search;
            this.doughnutChartData[3] = this.individualUserActivityCount.QuestionClick;
            this.doughnutChartData[4] = this.individualUserActivityCount.DownVote;
        }
    }

    // Pie
//    public questionChartLabels:string[] = ['Best XML parser for Java', 'Views getWidth() and getHeight() returns 0', 'Iterate through a HashMap [duplicate]', 'How to add JTable in JPanel with null layout?'];
//    public questionChartData:number[] = [6, 3, 2, 2];
//    public questionChartType:string = 'pie';
    public donutColors: Array<any> = [{ backgroundColor: ["#b8436d", "#00d9f9", "#a4c73c", "#a4add3"] }];


    public questionChartLabels:string[] = [];   
    public questionChartData:any[] = [
    { data: [6], label: 'Best XML parser for Java', backgroundColor: "#8e5ea2"},
    { data: [6], label: 'Views getWidth() and getHeight() returns 0'},
    { data: [6], label: 'Iterate through a HashMap [duplicate]'},
    { data: [6], label: 'How to add JTable in JPanel with null layout?'}];
    public questionChartColors :Array<any> = [
        {
          backgroundColor: '#C3F546'
        },
        { 
          backgroundColor: '#467EF5'
        },
        { 
          backgroundColor: '#46F5F2'
        },{
            backgroundColor: '#F54675'
        }
      ];
    public questionChartType:string = 'bar';

    // for bar chart
    /*
    data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
          {
            label: "Population (millions)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [2478,5267,734,784,433]
          }
        ]
*/      

    // events
    public questionchartClicked(e:any):void {
        console.log(e);
    }

    public questionchartHovered(e:any):void {
        console.log(e);
    }
}
