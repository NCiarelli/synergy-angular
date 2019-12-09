import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";
import { NgForm } from "@angular/forms";
import { ContentItem } from '../interfaces/content-item';

@Component({
  selector: "app-survey-form",
  templateUrl: "./survey-form.component.html",
  styleUrls: ["./survey-form.component.css"]
})
export class SurveyFormComponent implements OnInit {
  employeeList: Employee[] = [];
  nextDataId: number = 0;
  outputText;
  date: Date = new Date;
  employeeName: string;

  constructor(private profileService: ProfileService) { }

  getProfile(employeeIndex) {
    this.profileService
      .getProfile(this.employeeList[employeeIndex].textData)
      .subscribe(profile => {
        this.outputText = profile;
        console.log(profile);
      });
  }

  // Function to add employees to the list
  // A check if employee already exists should go here
  addEmployee(newName: string): void {
    let newArray: ContentItem[] = [];
    let newEmployee: Employee = {
      name: newName,
      textData: { contentItems: newArray },
    }
    this.employeeList.push(newEmployee);
    console.log(this.employeeList[0].name);
  }

  // Wrapper to call on button click
  addEmployeeEvent() {
    this.addEmployee(this.employeeName);
  }

  onSubmit(formData: NgForm) {
    //find if employee exists with given name
    //  if exists add text data entry
    //  else create employee and add text data entry

    // Single employee code
    // Create the new text data object
    let newTextData: ContentItem = {
      // Get the text data from the form
      content: formData.value.answer,
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
    this.employeeList[0].textData.contentItems.push(newTextData);
    console.log(this.employeeList[0].textData.contentItems);
  }

  ngOnInit() { }
}
