import {Injectable, Inject} from "@angular/core";
import * as firebase from 'firebase/app';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseListObservable} from  'angularfire2/database';
import {Timeinfo, UserInfo} from "./user-info";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import {DbfirebaseService} from "./database.service";
// import {CookieOptions, CookieService} from 'ngx-cookie';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthService {
    static UNKNOWN_USER = {
        isAnonymous: true,
        email: null,
        displayName: null,
        providerId: null,
        uid: null
    };

    userInfo = new BehaviorSubject<UserInfo>(<UserInfo>AuthService.UNKNOWN_USER);
    private user: firebase.User;

    constructor(private angularFireAuth: AngularFireAuth, private dbservice: DbfirebaseService, private _cookieService:CookieService) {
        this.angularFireAuth.authState.subscribe(user => {
            // console.log("user: ", JSON.stringify(user));
            this.user = user;
            // this._cookieService.put("userId", this.user.uid);
            let userInfo = new UserInfo();
            if (user != null) {

                userInfo.isAnonymous = user.isAnonymous;
                userInfo.email = user.email;
                userInfo.displayName = user.displayName;
                userInfo.providerId = user.providerId;
                userInfo.photoURL = user.photoURL;
                userInfo.uid = user.uid;
            } else {
                this.user = null;
                userInfo.isAnonymous = true;
            }
            this.userInfo.next(userInfo);
        });
    }

    login(email: string, password: string): Observable<string> {
        let result = new Subject<string>();
        if(email == "aaa"){
            email = "aaa@aaa.com";
            password = "123456";
        }
        if(email == "bbb"){
            email = "bbb@bbb.com";
            password = "123456";
        }
        if(email == "ccc"){
            email = "ccc@ccc.com";
            password = "123456";
        }
        this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
            .then(() => {
            result.next("success");
            this.dbservice.updateItem();
        })
            .catch(err => result.error(err));
        return result.asObservable();
    }

    currentUser(): Observable<UserInfo> {
        return this.userInfo.asObservable();
    }

    putCookie(){
        this.angularFireAuth.authState.first().subscribe(user => {
            this._cookieService.set("userId", this.user.uid);
        })
    }

    removeCookie(){
        this._cookieService.delete("userId");
    }
    logout(): Observable<string> {
        let result = new Subject<string>();
        this.userInfo.next(<UserInfo>AuthService.UNKNOWN_USER);
        this.angularFireAuth.auth.signOut()
            .then(() =>{ result.next("success");
                this._cookieService.delete("userId");
            })
            .catch(err => result.error(err));
        return result.asObservable();
    }

    isLoggedIn(): Observable<boolean> {
        return this.userInfo.map(userInfo => !userInfo.isAnonymous);
    }

    updateDisplayName(displayName: string): Observable<string> {
        let result = new Subject<string>();
        this.user.updateProfile({displayName: displayName, photoURL: null})
            .then(() => {result.next("success")})
            .catch(err => result.error(err));
        return result;
    }

    createUser(email: string, password: string, displayName: string): Observable<string> {
        let result = new Subject<string>();
        let current_login_time_object = new Timeinfo();
        current_login_time_object.login_time = Date.now().toString();

        this.angularFireAuth.authState.subscribe(user => {
            // console.log("Update: ", user);
            if (user != null) {
                user.updateProfile({displayName: displayName, photoURL: null});
            }
        });
        this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                //auth.auth.updateProfile({displayName: displayName, photoURL: null});
                result.next("success");
                this.dbservice.pushItem();
            })
            .catch(err => result.error(err));

        return result.asObservable();
    }

    updateEmail(email: string): Observable<string> {
        let result = new Subject<string>();
        this.user.updateEmail(email)
            .then(() => result.next("success"))
            .catch(err => result.error(err));
        return result.asObservable();
    }

    updatePassword(password: string): Observable<string> {
        let result = new Subject<string>();
        this.user.updatePassword(password)
                .then(a => {
                    result.next("success");
                })
                .catch(err => result.error(err));
        return result.asObservable();
    }

    sendPasswordResetEmail(email: string): Observable<string> {
        let result = new Subject<string>();
        this.angularFireAuth.auth.sendPasswordResetEmail(email)
            .then(() => result.next("success"))
            .catch(err => result.error(err));
        return result;
    }

    loginViaProvider(provider: string): Observable<String> {
        let result = new Subject<string>();
        if (provider === "google") {
            this.angularFireAuth
                .auth
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then(auth => result.next("success"))
                .catch(err => result.error(err));
            return result.asObservable();
        }
        else if (provider === "twitter") {
            this.angularFireAuth
                .auth
                .signInWithPopup(new firebase.auth.TwitterAuthProvider())
                .then(auth => result.next("success"))
                .catch(err => result.error(err));
            return result.asObservable();
        }
        result.error("Not a supported authentication method: " + provider)
        return result.asObservable();
    }
}
