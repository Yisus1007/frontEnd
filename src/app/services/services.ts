import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class Services{

    private BASE_URL = environment.url;
    //private BASE_URL = 'http://localhost:8080/';
    //private BASE_URL = 'http://ec2-3-136-25-68.us-east-2.compute.amazonaws.com:8080/'
    private headers: any;

    constructor(private http: HttpClient){

    }
    getPeopleList()
    {
        console.log("services - getPeopleList - Init");
        return new Promise((resolve, reject)=>{
            this.headers = new HttpHeaders();
            this.headers = this.headers.append('Content-Type', 'application/json');
            let url = `${this.BASE_URL}`
            console.log("services - getPeopleList - completedUrl",url + "list-people");
            this.http.get(url + "list-people").subscribe(res=>{
                resolve(res);
                console.log("services - getPeopleList - resolve: ",res);
            },(err)=>{
                reject(err);
            });            
        });
    }
    deletePeople(rut)
    {
        console.log("services - deletePeople - Init");
        return new Promise((resolve, reject)=>{
            this.headers = new HttpHeaders();
            this.headers = this.headers.append('Content-Type', 'application/json');
            let url = `${this.BASE_URL}`
            console.log("services - deletePeople - completedUrl",url + "list-people");
            this.http.get(url + "delete-people?rut="+rut).subscribe(res=>{
                resolve(res);
                console.log("services - deletePeople - resolve: ",res);
            },(err)=>{
                reject(err);
            });            
        });
    }
    addPeople(peopleToAdd){
        return new Promise((resolve, reject)=>{
            this.headers = new HttpHeaders();
            console.log("services - addPeople - param: ", JSON.stringify(peopleToAdd));
            this.headers = this.headers.append('Content-Type', 'application/json');
            let url = `${this.BASE_URL}`
            console.log("services - addPeople - completedUrl",url + "new-people");
            this.http.post(url + "new-people", JSON.stringify(peopleToAdd),{ headers: this.headers }).subscribe(res=>{
                resolve(res);
                console.log("services - addPeople - resolve: ",res);
            },(err)=>{
                reject(err);
            });            
        });
    }    
    editPeople(peopleToEdit,rut){
        return new Promise((resolve, reject)=>{
            this.headers = new HttpHeaders();
            console.log("services - editPeople - param: ", JSON.stringify(peopleToEdit) + " rut: " + rut);
            peopleToEdit['rut'] = rut;
            console.log("services - editPeople - tal despues: ", peopleToEdit);
            this.headers = this.headers.append('Content-Type', 'application/json');
            let url = `${this.BASE_URL}`
            console.log("services - editPeople - completedUrl",url + "edit-people");
            this.http.post(url + "edit-people", JSON.stringify(peopleToEdit),{ headers: this.headers }).subscribe(res=>{
                resolve(res);
                console.log("services - editPeople - resolve: ",res);
            },(err)=>{
                reject(err);
            });            
        });

    }
}