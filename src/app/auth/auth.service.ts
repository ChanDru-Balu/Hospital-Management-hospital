import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private auth: Auth, 
    private firestore: Firestore
    ) {}

  async register(data: any) {
    console.log({ data });
    let user: any = {};
    let response: any = {};
    let email = data.email;
    let password = data.password;
    console.log(email, password);
    try {
      let q = query(
        collection(this.firestore, 'users'),
        where('mobile', '>=', data.mobile)
      );
      let snapshot = await getDocs(q);
      console.log({ snapshot });
      if (!snapshot.empty) {
        // The query returned one or more documents
        snapshot.forEach((doc) => {
          // Access the document data using doc.data()
          console.log('Document data:', doc.data());
          response = {
            status: false,
            message: 'Mobile Number Already Exist',
            error: 'mobile number exist',
          };
          return response;
        });
      } else {
        // The query result is empty
        console.log('No documents found');

        try {
          user = await createUserWithEmailAndPassword(
            this.auth,
            email,
            password
          );
          console.log({ user });
          response = {
            status: true,
            message: 'Registration Successful',
            user: user,
          };
          const dataRef: any = collection(this.firestore, 'users');
          console.log({ dataRef });
          const addData = await addDoc(dataRef, data);
          console.log('response', addData);
        } catch (e: any) {
          console.error('Error creating user account');
          let message = 'Registration Failed';
          if (e.code == 'auth/email-already-in-use')
            message = 'Email Alreay Used';
          response = {
            status: false,
            message: message,
            error: e,
          };
        }
      }

      return response;
    } catch (e) {
      console.log({ e });
      response = {
        status: false,
        message: 'Registration Failed',
        error: e,
      };
      return response;
    }
  }

  async login(data: any) {
    let response: any = {};
    console.log({ data });
  
    let resultsWithIds: any[] = [];
  
    try {
      let q = query(
        collection(this.firestore, 'users'),
        where('mobile', '==', data.mobile)
      );
  
      let snapshot = await getDocs(q);
      console.log({ snapshot });
  
      if (!snapshot.empty) {
        // The query returned one or more documents
        snapshot.forEach((doc) => {
          // Access the document data using doc.data()
          const id = doc.id;
          console.log('Document data:', doc.data());
          let userDetails = doc.data();
  
          // Store the document ID and data
          resultsWithIds.push({ id, userDetails });
        });
      } else {
        // The query result is empty
        console.log('No documents found');
        response = {
          status: false,
          message: 'Login Failed',
          error: 'Invalid Credential',
        };
      }
  
      try {
        let user = await signInWithEmailAndPassword(
          this.auth,
          resultsWithIds[0]['userDetails']['email'],
          data.password
        );
  
        response = {
          status: true,
          message: 'LoggedIn Successful',
          user: resultsWithIds[0],
        };
      } catch (e) {
        console.log(e);
        response = {
          status: false,
          message: 'Login Failed',
          error: 'Invalid Credentials',
        };
      }
    } catch (e) {
      // Handle any exceptions from the outer try block here
      response = {
        status: false,
        message: 'Login Failed',
        error: e
      };
    }
  
    console.log({ resultsWithIds }); // Log results after populating the array
  
    return response;
  }
  
  
}
