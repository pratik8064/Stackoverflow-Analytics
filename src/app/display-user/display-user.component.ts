import {Component, EventEmitter, Output} from "@angular/core";
import {AuthService} from "app/shared/auth.service";
import {UserInfo, Timeinfo} from "app/shared/user-info";
import {Observable} from "rxjs";
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import {DbfirebaseService} from "app/shared/database.service";

@Component({
    selector: 'app-display-user',
    templateUrl: './display-user.component.html',
    styleUrls: ['./display-user.component.css']
})
export class DisplayUserComponent{
    @Output() onLoggedOut = new EventEmitter();
    private listOfActivitiesKeys: Array<any>;
    private actualListOfActivities: object;



    constructor(private authService: AuthService, private dbservice: DbfirebaseService) {
        this.authService.currentUser().subscribe(user=>{
            this.dbservice.getListOfActivities().subscribe(listOfActivities=>{
                if(listOfActivities != null) {
                    for(let i = 0; i < listOfActivities.length; i++){
                        if (listOfActivities[i].$key == user.uid) {
                            this.actualListOfActivities = listOfActivities[i];
                            this.listOfActivitiesKeys = Object.keys(listOfActivities[i]);
                        }
                    }

                }
            })
        });

    }



    currentUser(): Observable<UserInfo> {
        console.log("-------------------------");
        console.log(this.authService.currentUser());
        return this.authService.currentUser();
    }

    currentLoginTimes(): FirebaseListObservable<any[]>{
        return this.dbservice.currentLoginTimes();
    }


    logout() {
        this.authService.logout().subscribe(() => this.onLoggedOut.emit("success"));
    }

    navigateToStackOverflow(){
        window.open("https://stackoverflow.com/questions/tagged/java?sort=frequent&pageSize=15", "_blank");
    }

    navigateToDashboard(){

    }

    getListOfActivities(){
        return this.dbservice.getListOfActivities();
    }
}
