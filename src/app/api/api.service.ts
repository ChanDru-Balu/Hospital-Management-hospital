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
  updateDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private fireStore: Firestore) {}

  async getHospitals() {
    let q = query(collection(this.fireStore, 'hospital'));
    const snapshot = await getDocs(q);
    console.log({ snapshot });
    let hospitals: any[] = [];
    if (!snapshot.empty) {
      // The query returned one or more documents
      snapshot.forEach((doc) => {
        // Access the document Id using doc.data()
        const id = doc.id;
        // Access the document data using doc.data()
        let data = doc.data();
        data['id'] = id;
        hospitals.push(data);
      });
    }
    return hospitals;
  }

  async addAppointment(data: any) {
    try{
      const dataRef: any = collection(this.fireStore, 'appointments');
      console.log({ dataRef });
      const addData = await addDoc(dataRef, data);
      console.log('response', addData);
      let response = {
        status: true,
        message: 'Appointment Getting Successfully!',
        data: data
      }
      return response
    } catch(e){
      console.log(e)
      let response = {
        status: false,
        message: 'Getting Appointment Failed!',
        error: e,
      }
      return response
    }
    

  }

  async getAppointments(data:any){

    console.log({data});
    let q : any;
    let response : any ;
    console.log("hospitalId:",data['id']);

    try {
      if(data['page'] == 'upcoming'){
        q = query(collection(this.fireStore, 'appointments'),
          where('status', '==', 0 ),
          where('hospitalId', '==', data['id'] )
        );
      }else{
        // Define an array of status values you want to match
        const statusValues = ['cancelled', 'completed'];
        console.log("History")
          q = query(collection(this.fireStore, 'appointments'),
            where('status', '>', 0),
            where('hospitalId', '==', data['id'] )
          );
        console.log({q})
      }
      console.log({q})
      let snapshot = await getDocs(q);
      console.log({ snapshot });
      if (!snapshot.empty) {
        let appointments: any[] = [];
        // The query returned one or more documents
        snapshot.forEach((doc) => {
          // Access the document data using doc.data()
          console.log('Document data:', doc.data());
          let data: any = doc.data();
          data['id'] = doc.id;
          appointments.push(data) 
        });
        console.log({appointments})
        response = {
          status: true,
          message: 'Appointments',
          data: appointments
        };
        return response;
      } else {
        // The query result is empty
        console.log('No documents found');
      }

      return response;
    } catch (e) {
      console.log({ e });
      response = {
        status: false,
        message: 'Failed to Get data',
        error: e,
      };
      return response;
    }
  }

  async changeAppointment(data:any){
    try{
      const dataRef: any = collection(this.fireStore, 'appointments');
      console.log({ dataRef });
      let appointRef = doc(this.fireStore ,  `appointments/${data.id}`)
      let updatedResult = await updateDoc(appointRef , {
        status : 1
      }) 
      console.log({updatedResult})
      return  {
        status : true,
        message : 'Appointment Cancelled Successfully',
        result : updatedResult
      }
    } catch(e){
      console.log(e)
      return  {
        status : false,
        message : 'Appointment Cancelled Failed',
        error : e
      }
    }
  }
}
