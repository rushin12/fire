import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from './user.model';
import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyCrXkYVqxLz4tniFCsNjUf7kkoeVhGAFjw',
  authDomain: 'angularfire-fa5e3.firebaseapp.com',
  databaseURL: 'https://angularfire-fa5e3.firebaseio.com  ',
  projectId: 'angularfire-fa5e3',
  storageBucket: 'angularfire-fa5e3.appspot.com',
  messagingSenderId: '223441234782',
  appId: "1:223441234782:web:fc15d3a303fdf465ddbdcf",
  measurementId: "G-P5M5MTDZEV",
};
firebase.initializeApp(config);
var db = firebase.firestore();
@Injectable({
  providedIn: 'root'
})
export class AuthService {




  user$: Observable<any>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private firestore: AngularFirestore

  ) {

    this.user$ = this.afAuth.authState.pipe(

      switchMap(user => {

        if (user) {

          return this.afs.doc<User>('users/${user.uid}').valueChanges();
        } else {

          return of(null);
        }
      })
    );
  }

  async googleSignin() {

    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  async signOut() {

    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/${uid}');

    const data = {

      uid,
      email,
      displayName,
      photoURL
    };

    return userRef.set(data, { merge: true });
  }

    async deleteUser() {

      

      db.collection("users").doc("${uid}").delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });

  }

}
