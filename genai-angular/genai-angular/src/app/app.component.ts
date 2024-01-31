
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'genai-angular';
  file : File | null = null
  responseData : any = ""
  dataExists : boolean = false
  landlordNameDefault = 'No Name';
  tenantNameDefault = 'No Name';
  startDateDefault = '';
  endDateDefault = '';
  rentDefault = '';
  propertyAddressDefault = 'No Address';

  leaseForm: FormGroup ;
  constructor() {
    this.leaseForm = new FormGroup({
      landlordName: new FormControl(this.responseData["landlord_name"], ),
        tenantName: new FormControl(this.responseData["tenant_name"]),
        startDate: new FormControl(this.responseData["starting_date"]),
        endDate: new FormControl(this.responseData["ending_date"]),
        rent: new FormControl(this.responseData["rent"]),
        propertyAddress: new FormControl(this.responseData["property_name"]),
    })
      
    // this.file = null;
  }
  
    
  onSubmit() {
    if (this.leaseForm.valid) {
      // Form is valid, submit data or perform other actions
      console.log(this.leaseForm.value);
    } else {
      // Handle form validation errors
      console.error('Form is invalid!', this.leaseForm.errors);
    }
  }

  
  onFileChange(event: any) {
    this.file = event.target.files[0];
    console.log(this.file)
  
    
  }

  

  uploadPDF() {
    this.dataExists = false;
    console.log('Uploading PDF...');
      const formData = new FormData();
      if(this.file){formData.append('pdf', this.file);}
      axios.post('http://localhost:3000/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(response => {
      this.responseData = response.data;
      console.log(response)
      console.log(this.responseData);
      this.dataExists = true;
      this.leaseForm = new FormGroup({
        landlordName: new FormControl(this.responseData["landlord_name"], ),
        tenantName: new FormControl(this.responseData["tenant_name"]),
        startDate: new FormControl(this.responseData["starting_date"]),
        endDate: new FormControl(this.responseData["ending_date"]),
        rent: new FormControl(this.responseData["rent"]),
        propertyAddress: new FormControl(this.responseData["property_name"]),
      });
    })
    .catch(error => {
      console.error(error);
      // Handle error appropriately
    }); 
  }

}
