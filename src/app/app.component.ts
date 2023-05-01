import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FileUpload';

  myFile: any[] = [];

  private apiUrl = 'http://localhost:5189/api/Upload';

  constructor(private http: HttpClient) { }

  handleFileInput(event: any) {
    this.myFile = event.target.files;
  }

  Upload() {
    var file = this.myFile[0];
    var FileName = file.name;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);

        const byteLength = 52428800;

        // Calculate the number of byte arrays that will be created
        const numArrays = Math.ceil(byteArray.length / byteLength);

        // Initialize an array to hold the new byte arrays
        const newArray = new Array(numArrays);

        // Loop through the original array and create new byte arrays
        for (let i = 0; i < numArrays; i++) {
          const start = i * byteLength;
          const end = start + byteLength;
          newArray[i] = byteArray.slice(start, end);
        }

        //var myBytes = Array.from(byteArray);

        let data = {
          FileBytes: newArray,
          FileName: FileName
        };
        // let FileData = {
        //   FileData: JSON.stringify(data)
        // };
        //console.log(FileData);
        this.postData(data).subscribe(res => {
          alert(res);
        },
          err => {
            alert(err)
          });

      }; reader.readAsArrayBuffer(file);
      (<HTMLInputElement>document.getElementById("file")).value = "";
    }

  }

  postData(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
