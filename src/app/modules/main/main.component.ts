import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { Services } from '../../services/services';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  formPeople: FormGroup;
  formPeopleEdit: FormGroup;
  constructor(private services: Services,private formBuilder: FormBuilder) { }
  public peopleList: Array<string>;
  public rutString: string;
  public name: string;
  public lastName: string;
  public age: string;
  public adress: string;
  public isNew: boolean = false;


  ngOnInit(): void {
    console.log('ngOnInit - ingreso');
    this.getPeopleList();
    this.createForm();
  }
  createForm(){
    this.formPeople = this.formBuilder.group ({
      rut: '',
      name: '',
      lastName: '',
      age: '',
      adress: '',
    });
    this.formPeopleEdit= this.formBuilder.group ({
      rut: {value: '', disable: true},
      name: '',
      lastName: '',
      age: '',
      adress: '',
    });
    

  }
  /**
   * Call the services and load the data extracted 
   * in the main table
   */
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
  
  /**
   * Call the services delete-people and delete the people selected
   * from main table.
   */
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

  /**
   * Does age validation, if the age is less 18 return an alert
   */
  public validateAge(){
    if(this.formPeople.value.age < 18 && this.formPeople.value.age != null){
      alert("You must be over 18 years old");
      return false;
    }
  }
  
  /**
   * Send the new register to the services, and wait for an asnwer
   * if service answer OK, show a message with the correct inserte
   * and reload the main table
   */
  public addPeople(){
    console.log('Main - addPeople - Init');    
    this.formPeople.value.rut = this.rutString; 
    console.log("Main - addPeople - params: ", this.formPeople.value);
    this.services.addPeople(this.formPeople.value).then((addResponse)=>{
      console.log("Main - addPeople - addResponse: ", addResponse);
      if(addResponse['statusCode'] == 200){
        this.getPeopleList();
        this.formPeople.reset();
      }
    }).catch((errorResponse)=>{
      console.log("Main - addPeople - errorResponse: ", errorResponse);
      alert("Error trying to insert: "+ errorResponse);
    });

  }

  /**
   * Validate the RUT and call other 2 method.
   * The first method validate the verification digit and 
   * respond true or false.
   * the second give format to RUT with points and hyphen
   * befor verficator digit
   */
  validateRut(){
    console.log("Main - validateRut - Init")
    if(this.formPeople.value.rut != null)
    {
      var rut = this.formPeople.value.rut;
      console.log("rut.charAt('-'): ",rut.indexOf('-'))
      if(rut.indexOf('-') == -1){
        alert("RUT must be contain a hyphen");
      }
      console.log("rut size: ", rut.length);
      console.log("rut: ", rut);
      if(rut.length < 9){
        alert("It's not a valid RUT");
      }
      rut = rut.replace('-','');
      var rutBody = rut.substring(0,rut.length -1);
      var rutDv: string = rut.substring(rut.length,rut.length -1);
      var dvValidation: boolean = this.validateVD(rutBody, rutDv);
      if(!dvValidation){
        console.log("verification digit is invalid");
        alert("verification digit is invalid");
      }
      this.rutString = this.formatRut(rutBody) + "-" + rutDv.toUpperCase(); 
      this.formPeople.value.rut = this.rutString; 
      console.log("Main - validateRut - End")
    }
    
  }

  /**
   * Validate if the verification digit entered match with 
   * calculated digit
   */
  private validateVD(rut, vd: string): boolean{
    var addition = 0;
    var multiplo = 2;

    for(var i = 1; i <= rut.length; i++){
      var index = multiplo * rut.charAt(rut.length -i);
      var addition = addition + index;
      if(multiplo < 7){
        multiplo = multiplo +1;
      }
      else{
        multiplo = 2;
      }
      
    }
    var elevenFactor = 11 - (addition % 11);
    var verificatorDigit = elevenFactor.toString();
    if(elevenFactor == 11){
      verificatorDigit = '0';
    }
    else if(elevenFactor == 10){
      verificatorDigit = 'K';
    }    
    if(vd.toUpperCase() != verificatorDigit){
      return false;
    }
    return true;
  }
  /**
   * Gives format to RUT.
   */
  private formatRut(rutBody){    
    if(rutBody.length == 8){
      var rut1 = rutBody.substring(0,2);
      var rut2 = rutBody.substring(2,5);
      var rut3 = rutBody.substring(5,rutBody.length);
      console.log("formatted Rut: ",rut1 + "."+ rut2 + "." + rut3);
      return rut1 + "."+ rut2 + "." + rut3;
    }
    if(rutBody.length == 7){
      var rut1 = rutBody.substring(0,1);
      var rut2 = rutBody.substring(1,4);
      var rut3 = rutBody.substring(4,rutBody.length);
      console.log("formatted Rut: ",rut1 + "."+ rut2 + "." + rut3);
      return rut1 + "."+ rut2 + "." + rut3;
    }
  }
  /**
   * Load a form to edit modal to fianally show it.
   * @param items 
   */
  selectedToEdit(items){
    console.log("Main - selectedToEdit - init");
    console.log("Main - selectedToEdit - param: ",items);
    this.formPeopleEdit.controls.rut.disable();
    this.formPeopleEdit.setValue({
      rut: items.rut,
      name: items.name, 
      lastName: items.lastName, 
      age: items.age, 
      adress: items.adress
    });
    this.rutString = items.rut;
  }
  /**
   * This method invoke to editPeople services and send 
   * by parameter the list with person that need it edit.
   */
  public editPeople(){
    console.log('Main - editPeople - Init');   
    console.log("Main - editPeople - params: ", this.formPeopleEdit.value);    
    this.services.editPeople(this.formPeopleEdit.value,this.rutString).then((editPeopleResponse)=>{   
      console.log("Main - editPeople - editPeople: ", editPeopleResponse);
      if(editPeopleResponse['statusCode'] == 200){
        this.getPeopleList();
      }
    }).catch((errorResponse)=>{
      console.log("Main - editPeople - errorResponse: ", errorResponse);
      alert("Error trying to update: "+ errorResponse);
    });

  }

}
