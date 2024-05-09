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
  FullData: any = [];
  Message:string = 'Please Wait...';
  showtable:boolean = false;
  showloading:boolean = true;

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
        console.log('GET Request Response:', response);
        this.ExcelData += response?.Data;
        return response?.LastRecord;
      } catch (error) {
        handleError(error, 'GET Request Error');
        return null;
      }
    };

    try {
      const response: any = await this.http.get(baseUrl).toPromise();
      this.Message = `File Count ${response?.Filepaths.length}`

      for (let e of response?.Filepaths) {
        this.Message = `Reading File ${e}...  - pleace wait -`;
        let LastRecord = await getData(`${baseUrl}?filepath=${e}&start_position=0`);

        while (LastRecord && LastRecord < 800000) {
          LastRecord = await getData(`${baseUrl}?filepath=${e}&start_position=${LastRecord}`);
        }

        this.FullData.push(this.ExcelData);

        console.log(`Final List ${this.FullData.length}`);
        for (let index = 0; index < 100; index++) {
          const element = this.FullData[index];
          for (let index = 0; index < element.length; index++) {
            const elem = element[index];
            console.log(elem);
          }
        }
        
      }
    } catch (getError) {
      handleError(getError, 'GET Request Error');
    }
    this.showloading = false;
    this.showtable = true;
    this.Message = '';
    if (this.FullData.length === 0) {
      this.Message = 'Backend Error...';
    }
    return null;
  }
}