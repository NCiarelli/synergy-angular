import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Employee } from "../interfaces/employee";
// Import call for example data from static JSON
import * as exampleData from "src/assets/example.json";
import { ContentItem } from "../interfaces/content-item";

@Injectable({
  providedIn: "root"
})
export class ProfileService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly EXPRESS_URL = environment.expressServerBaseUrl;
  employeeList: Employee[] = [];
  nextDataId: number = 0;

  personalityTypes = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
    "Any"
  ];

  constructor(private http: HttpClient) {}

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
  createProfile(employee: Employee): void {
    // Make post request to Watson to create the personality profile
    this.http
      .post(`${this.EXPRESS_URL}/profile`, employee.textData)
      .subscribe((response: any) => {
        // DEBUG until get proper display for the profile
        console.log(response.result);
        // Save the personality profile to the employee object
        employee.personalityProfile = response.result;
        this.assignDominantPersonality(employee);
        // Update the database with the new personality data
        this.updateEmployeeDatabasePersonalityProfile(employee).subscribe(
          response => {
            // DEBUG
            console.log(response);
          }
        );
      });
  }

  // returns a reference to the service's employeeList array
  getEmployeeList(): Employee[] {
    return this.employeeList;
  }

  // returns an employee object if found by name
  getEmployee(employeeName: string): Employee {
    let employeeIndex = this.findEmployeeIndex(employeeName);
    if (employeeIndex === -1) {
      return {
        name: "",
        textData: { contentItems: [] },
        dominantPersonality: ""
      };
    } else {
      return this.employeeList[employeeIndex];
    }
  }

  // Function to add employees to the list
  // A check if employee already exists should go here
  // Returns the named employee's index in the array
  addEmployee(newName: string): Observable<any> {
    // Add the new employee to the database
    return this.addEmployeeToDatabase(newName).pipe(
      map(response => {
        // Restructure the returned employee data to local structure
        let newEmployee: Employee = this.employeeDatabaseStructureToLocal(
          response
        );
        // Add the new employee to the employee list
        this.employeeList.push(newEmployee);
        // The new employee index will be the last index of the array now
        const employeeIndex = this.employeeList.length - 1;
        // DEBUG
        console.log(this.employeeList[employeeIndex]);
      })
    );
  }

  addTextData(inputTextData: string, employee: Employee): Observable<any> {
    // Single employee code
    // Create the new text data object
    let newTextData: ContentItem = {
      // Get the text data from the form
      content: inputTextData,
      contenttype: "text/plain",
      // Get the current timestamp
      created: Date.now(),
      language: "en",
      employeeId: employee.databaseId
    };
    // Send the new text entry to the database
    return this.addSurveyEntryToDatabase(newTextData).pipe(
      map(response => {
        let returnedEntry: ContentItem = this.surveyEntryDatabaseStructureToLocal(
          response
        );
        // Add the new text data entry to the contentItems array of the employee
        employee.textData.contentItems.push(returnedEntry);
        // DEBUG
        console.log(employee.textData.contentItems);
      })
    );
  }

  checkIfEnoughDataForProfile(employee: Employee): boolean {
    let enoughData: boolean = false;
    // Setting for how many required text data words for profile generation
    const numRequiredWords = 100;
    let wordCount = 0;
    // Creating a variable to shorten refernces to the array of survey text entries
    const dataArray = employee.textData.contentItems;
    // Go through the array of entries
    for (const contentItem of dataArray) {
      // Add the number of words in the entry to the total count for this employee
      wordCount += this.countWords(contentItem.content);
    }
    // DEBUG
    // console.log("Word Count: ", wordCount);
    if (wordCount >= numRequiredWords) {
      // Once enough text data is collected, set enoughData to true for the return value
      enoughData = true;
    }
    // Pass the boolean result back to the calling code
    return enoughData;
  }

  // Small function to count up all space seperated words
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
      // Setup variable for temporary maximum value tracking
      let highestPersonalityIndex: number = -1;
      let highestPersonalityPercentile = -Infinity;
      // For ease of code reading, A variable for shortcutting references to the used array in the the personality profile of the employee
      let personalityArray = employee.personalityProfile.personality;
      // Go through the personality array to find the highest percentile personality
      for (let i = 0; i < personalityArray.length; i++) {
        if (personalityArray[i].percentile > highestPersonalityPercentile) {
          // If the current percentile being checked is higher than the recorded max percentile
          // Put the current index into highestPersonalityIndex
          highestPersonalityIndex = i;
          // And replace the saved max with the percentile currently being checked
          highestPersonalityPercentile = personalityArray[i].percentile;
        }
      }
      // Stores the Name of the personality type with the highest percentile in the dominantPersonality of the employee
      employee.dominantPersonality = this.personalityTypes[
        highestPersonalityIndex
      ];
      // DEBUG
      console.log(
        `${employee.name}'s dominant personality type is now ${this.personalityTypes[highestPersonalityIndex]}`
      );
    } else {
      // If the personality profile doesn't exist someone did an oopsie
      console.log(
        `Sometinhg is wrong. There is no personality profile for ${employee.name}`
      );
    }
  }

  // Gets the entire employee list from the database
  retrieveEmployeeList(): Observable<any> {
    return this.http.get(`${this.EXPRESS_URL}/employees`).pipe(
      map((response: any) => {
        // Force the employee list to be empty
        this.employeeList.length = 0;
        // Add all the employees retrieved from the database to the local service employee list
        for (let databaseEmployee of response) {
          this.employeeList.push(
            this.employeeDatabaseStructureToLocal(databaseEmployee)
          );
        }
      })
    );
  }

  employeeDatabaseStructureToLocal(employee: any): Employee {
    return {
      name: employee.name,
      textData: { contentItems: [] },
      dominantPersonality: employee.dominant_personality,
      personalityProfile: JSON.parse(employee.personality_profile),
      headShot: employee.head_shot_url,
      databaseId: employee.id
    };
  }

  addEmployeeToDatabase(employeeName: string): Observable<any> {
    return this.http.post(`${this.EXPRESS_URL}/employees`, {
      name: employeeName
    });
  }

  getNewestEmployee(): Employee {
    return this.employeeList[this.employeeList.length - 1];
  }

  surveyEntryDatabaseStructureToLocal(surveyEntry: any): ContentItem {
    return {
      content: surveyEntry.content,
      contenttype: "text/plain",
      created: surveyEntry.created,
      language: "en",
      id: surveyEntry.id
    };
  }

  addSurveyEntryToDatabase(surveyEntry: ContentItem): Observable<any> {
    return this.http.post(
      `${this.EXPRESS_URL}/employees/${surveyEntry.employeeId}/survey-entries`,
      surveyEntry
    );
  }

  getSurveyEntriesByEmployeeId(employee: Employee): Observable<any> {
    return this.http
      .get(
        `${this.EXPRESS_URL}/employees/${employee.databaseId}/survey-entries`
      )
      .pipe(
        map((response: any) => {
          for (let surveyEntry of response) {
            // Add the retrieved survey entries to the contentItems array after translating the structure
            employee.textData.contentItems.push(
              this.surveyEntryDatabaseStructureToLocal(surveyEntry)
            );
          }
        })
      );
  }

  // Send an update to the database to include the personality profile and dominant personality
  updateEmployeeDatabasePersonalityProfile(
    employee: Employee
  ): Observable<any> {
    return this.http.put(
      `${this.EXPRESS_URL}/employees/${employee.databaseId}/personality-profile`,
      {
        personalityProfile: employee.personalityProfile,
        dominantPersonality: employee.dominantPersonality
      }
    );
  }

  setSelectedFalseAllEmployees() {
    this.employeeList.forEach(employee => (employee.selected = false));
  }

  // /employees/:id/update-all
  // Using to populate example data
  updateEmployeeDatabaseEntry(employee: Employee): Observable<any> {
    let headShot = employee.headShot ? employee.headShot : null;
    let updateParams = {
      name: employee.name,
      dominantPersonality: employee.dominantPersonality,
      personalityProfile: null,
      headShot: headShot,
      notes: ""
    };
    return this.http.put(
      `${this.EXPRESS_URL}/employees/${employee.databaseId}/update-all`,
      updateParams
    );
  }

  // FOR EXPORTING ENTIRE LOCAL EMPLOYEE LIST TO DATABASE
  // sendEmployeesToDatabase() {
  //   for (let employee of this.employeeList) {
  //     this.addEmployeeToDatabase(employee.name).subscribe(response => {
  //       let newEmployee: Employee = this.employeeDatabaseStructureToLocal(
  //         response
  //       );
  //       employee.databaseId = newEmployee.databaseId;
  //       // console.log("Added ", newEmployee.name, " to the Database.");
  //       this.updateEmployeeDatabaseEntry(employee).subscribe(() => {
  //         for (let surveyEntry of employee.textData.contentItems) {
  //           surveyEntry.employeeId = employee.databaseId;
  //           this.addSurveyEntryToDatabase(surveyEntry).subscribe(() => {
  //             console.log("Added survey entry for ", employee.name);
  //           });
  //         }
  //       });
  //     });
  //   }
  // }
}
