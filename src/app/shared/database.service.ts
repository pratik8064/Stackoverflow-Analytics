import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Timeinfo} from "./user-info";
import {AngularFireAuth} from "angularfire2/auth";
import {element} from "protractor";
@Injectable()
export class DbfirebaseService {

    list_of_login_times: FirebaseListObservable<any[]>;
    actual_element: FirebaseObjectObservable<any>;
    list_of_activities: FirebaseListObservable<any[]>;

    constructor(private db: AngularFireDatabase, private angularFireAuth: AngularFireAuth) {
        this.list_of_login_times = db.list('/list_of_login_times');
        this.list_of_activities = db.list('/list_of_activities');

    }

    currentLoginTimes():FirebaseListObservable<any[]>{
        return this.list_of_login_times;
    }

    updateItem() {
        this.angularFireAuth.authState.first().subscribe(user => {
        if (!user.uid) return;
            this.actual_element = this.db.object(`/list_of_login_times/${user.uid}`);
            this.actual_element.first().subscribe(element=>{
                console.log(element);
                let current_key = element[element.length - 1].key + 1;
                element.push({key: current_key, login_time:new Date().toLocaleString()});
                const toSend = this.db.object(`/list_of_login_times/${user.uid}`);
                toSend.set(element);
            });
            console.log(this.actual_element);

        });
    }

    pushItem(){
        this.angularFireAuth.authState.first().subscribe(user => {
            console.log(user);
            if (!user.uid) return;
            const toSend = this.db.object(`/list_of_login_times/${user.uid}`);
            toSend.set([{key:1, login_time:new Date().toLocaleString()}]);
            
        });

    }

    getListOfActivities(): FirebaseListObservable<any[]>{
        return this.list_of_activities;
    }
}

