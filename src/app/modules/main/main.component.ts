import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators,FormBuilder} from '@angular/forms';
import { Services } from '../../services/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  formPeople: FormGroup;
  constructor(private services: Services) { }
  public peopleList: Array<String>;

  ngOnInit(): void {
    console.log('ngOnInit - ingreso');
    this.getPeopleList();
  }
  createForm(){


  }
  private getPeopleList() {
    console.log('Main - getPeopleList - Init');
    this.services.getPeopleList().then((peopleListResponse)=>{
      console.log('Main - getPeopleList - response: ',peopleListResponse);
      this.peopleList = peopleListResponse['people'];  
      console.log('Main - getPeopleList - peopleList: ',this.peopleList);    
    }).catch((errorResponse)=>{
      console.log('Main - getPeopleList - errorResponse: ',errorResponse);
    });
    
  }
  private deletePeople(rut){
    console.log('Main - deletePeople - Init');
    console.log('Rut: ',rut);
    this.services.deletePeople(rut).then((deleteResponse)=>{
      console.log('Main - deletePeople - response: ',deleteResponse);
      if(deleteResponse['statusCode']=200){
        alert("Register: " + rut + " successfully removed")
        this.getPeopleList();
      }
    }).catch((errResponse)=>{
      console.log('Main - deletePeople - response: ',errResponse);
    });
  }

}
