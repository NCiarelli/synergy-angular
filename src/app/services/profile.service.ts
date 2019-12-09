import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Employee } from '../interfaces/employee';
// Import call for example data from static JSON
import * as exampleData from 'src/assets/example.json';
import { ContentItem } from '../interfaces/content-item';


@Injectable({
  providedIn: "root"
})
export class ProfileService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly BASE_URL = environment.cartApiBaseUrl;
  employeeList: Employee[] = [];
  nextDataId: number = 0;
  date: Date = new Date;



  constructor(private http: HttpClient) { }

  findEmployeeIndex(name: string): number {
    // Check if the employee name already exists, case insensitive
    const nameLower: string = name.toLowerCase();
    // Call findIndex array method to try to find an employee with the input name
    // Returns -1 if not found
    return this.employeeList.findIndex((employee) => employee.name.toLowerCase() === nameLower);
  }

  // Send the profile text from the employee profile object to the express server.
  // The server will pass the text along to Watson which will return a profile JSON, which the server passes back here
  createProfile(employeeName: string): void {

    // Find employee index
    let employeeIndex = this.findEmployeeIndex(employeeName);

    // If the employee doesn't exist (findIndex returns -1)...
    if (employeeIndex === -1) {
      // If the employee doesn't exist, let the user know and return
      console.log("Employee Doesn't exist!!!");
      return;
    }
    // Make post request to Watson to create the personality profile
    this.http.post(`${this.BASE_URL}/profile`, this.employeeList[employeeIndex].textData)
      .subscribe(profile => {
        console.log(profile);
        // Save the personality profile to the employee object
        this.employeeList[employeeIndex].personalityProfile = profile;
      });
  }

  // returns a reference to the service's employeeList array
  getEmployeeList(): Employee[] {
    return this.employeeList;
  }

  // Function to add employees to the list
  // A check if employee already exists should go here
  // Returns the named employee's index in the array
  addEmployee(newName: string): number {

    // Create a new employee with the input name
    let newArray: ContentItem[] = [];
    let newEmployee: Employee = {
      name: newName,
      textData: { contentItems: newArray },
    }
    // Add the new employee to the employee list
    this.employeeList.push(newEmployee);
    // The new employee index will be the last index of the array now
    const employeeIndex = this.employeeList.length - 1;
    // DEBUG
    console.log(this.employeeList[employeeIndex].name);
    return employeeIndex;
  }

  addTextData(inputTextData: string, employeeIndex: number): void {
    // Single employee code
    // Create the new text data object
    let newTextData: ContentItem = {
      // Get the text data from the form
      content: inputTextData,
      contenttype: "text/plain",
      // Get the current timestamp
      created: this.date.getTime(),
      // Get an id for this entry
      id: `${this.nextDataId}`,
      language: "en"
    };
    // Increment ID counter
    this.nextDataId++;
    // Add the new text data entry to the contentItems array of the employee
    this.employeeList[employeeIndex].textData.contentItems.push(newTextData);
    console.log(this.employeeList[employeeIndex].textData.contentItems);
  }

  checkIfEnoughDataForProfile(employeeIndex: number): boolean {
    let enoughData: boolean = false;
    const numRequiredWords = 100;
    let wordCount = 0;
    const dataArray = this.employeeList[employeeIndex].textData.contentItems;
    for (const contentItem of dataArray) {
      wordCount += this.countWords(contentItem.content);
    }
    console.log("Word Count: ", wordCount);
    if (wordCount >= numRequiredWords) {
      enoughData = true;
    }
    return enoughData;
  }

  countWords(str) {
    return str.split(" ").length;
  }

  // Sets the employeeList to the example data from static JSON
  importExampleData() {
    this.employeeList = exampleData.employeeList;
  }
}
