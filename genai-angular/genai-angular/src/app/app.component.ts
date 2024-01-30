
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'genai-angular';
  file : File | null = null
  responseData = ""
  constructor() {
    // this.file = null;
  }
  
  onFileChange(event: any) {
    this.file = event.target.files[0];
    console.log(this.file)
  
    
  }

  uploadPDF() {
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
    })
    .catch(error => {
      console.error(error);
      // Handle error appropriately
    });
    
    
    
    
  }

}
