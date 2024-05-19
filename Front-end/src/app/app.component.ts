import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Front-end';
  ExcelData: any = [];
  Message:string = 'Please Wait...';
  showtable:boolean = false;
  showloading:boolean = true;
  File_Count: string = "";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.makeApiRequest();
  }

  async makeApiRequest() {
    const baseUrl = "http://localhost:8000/excelread/";

    const handleError = (error: any, message: string) => {
      console.error(`${message}:`, error);
    };

    const getData:any = async (url: string) => {
      try {
        const response: any = await this.http.get(url).toPromise();
        this.ExcelData.push(response?.Data);
        console.log('Data Length',response);
        return response?.LastRecord;
      } catch (error) {
        handleError(error, 'GET Request Error');
        return null;
      }
    };

    try {
      const response: any = await this.http.get(baseUrl).toPromise();
      this.File_Count = `File Count ${response?.Filepaths.length}`

      for (let e of response?.Filepaths) {
        let parts = e.split("\\");
        let fileName = parts[parts.length - 1];
        this.Message = `Reading File ${fileName}...`;
        let LastRecord = await getData(`${baseUrl}?filepath=${e}&start_position=0`);

        while (LastRecord && LastRecord < 1000) {
          LastRecord = await getData(`${baseUrl}?filepath=${e}&start_position=${LastRecord}`);
        }

        this.ExcelData = this.ExcelData.flat();
        console.log('All Length',this.ExcelData.length);
        
      }
    } catch (getError) {
      handleError(getError, 'GET Request Error');
    }
    this.showloading = false;
    this.showtable = true;
    this.Message = '';
    this.File_Count = "";
    if (this.ExcelData.length === 0) {
      this.Message = 'Backend Error...';
    }
    return null;
  }
}