import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Employee } from "../interfaces/employee";
// Import call for example data from static JSON
import * as exampleData from "src/assets/example.json";
import { ContentItem } from "../interfaces/content-item";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly BASE_URL = environment.expressServerBaseUrl;
  employeeList: Employee[] = [];
  nextDataId: number = 0;
  date: Date = new Date();

  personalityTypes = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
    "Any"
  ];

  constructor(private http: HttpClient) { }

  findEmployeeIndex(name: string): number {
    // Check if the employee name already exists, case insensitive
    const nameLower: string = name.toLowerCase();
    // Call findIndex array method to try to find an employee with the input name
    // Returns -1 if not found
    return this.employeeList.findIndex(
      employee => employee.name.toLowerCase() === nameLower
    );
  }

  // Send the profile text from the employee profile object to the express server.
  // The server will pass the text along to Watson which will return a profile JSON, which the server passes back here
  createProfile(employeeName: string): void {
    // Find employee index
    let employeeIndex = this.findEmployeeIndex(employeeName);
    let employee: Employee;
    // If the employee doesn't exist (findIndex returns -1)...
    if (employeeIndex === -1) {
      // If the employee doesn't exist, let the user know and return
      console.log("Employee Doesn't exist!!!");
      return;
    } else {
      employee = this.employeeList[employeeIndex];
    }
    // Make post request to Watson to create the personality profile
    this.http
      .post(`${this.BASE_URL}/profile`, employee.textData)
      .subscribe((response: any) => {
        // DEBUG until get proper display for the profile
        console.log(response.result);
        // Save the personality profile to the employee object
        employee.personalityProfile = response.result;
        this.assignDominantPersonality(employee);
      });
  }

  // returns a reference to the service's employeeList array
  getEmployeeList(): Employee[] {
    return this.employeeList;
  }

  getEmployee(employeeName: string): Employee | number {
    let employeeIndex = this.findEmployeeIndex(employeeName);
    if (employeeIndex === -1) {
      return employeeIndex;
    } else {
      return this.employeeList[employeeIndex];
    }
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
      dominantPersonality: "None"
    };
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
    // DEBUG
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
    // DEBUG
    console.log("Word Count: ", wordCount);
    if (wordCount >= numRequiredWords) {
      // Once enough text data is collected, set enough data to true to indicate to the caller
      enoughData = true;
      // And create a personality profile for the employee
      this.createProfile(this.employeeList[employeeIndex].name);
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

  assignDominantPersonality(employee: Employee) {
    // Check the profile exists
    if (employee.personalityProfile) {
      // If it exists...
      let highestPersonalityIndex: number = -1;
      let highestPersonalityPercentile = -Infinity;
      let personalityArray = employee.personalityProfile.personality;
      // Go through the personality array to find the highest percentile
      for (let i = 0; i < personalityArray.length; i++) {
        if (personalityArray[i].percentile > highestPersonalityPercentile) {
          // If the current percentile being checked is higher than the recorded max percentile
          // Put the current index into highestPersonalityIndex
          highestPersonalityIndex = i;
          // And replace the max with the current percentile
          highestPersonalityPercentile = personalityArray[i].percentile;
        }
      }
      employee.dominantPersonality = this.personalityTypes[
        highestPersonalityIndex
      ];
      console.log(
        `${employee.name}'s dominant personality type is now ${this.personalityTypes[highestPersonalityIndex]}`
      );
    } else {
      // If it doesn't someone did an oopsie
      console.log(
        `Sometinhg is wrong. There is no personality profile for ${employee.name}`
      );
    }
  }
}
