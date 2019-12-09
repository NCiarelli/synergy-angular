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
  outputText;
  employeeName: string;
  enoughData: boolean = false;

  constructor(private profileService: ProfileService) { }

  createProfile() {
    this.profileService.createProfile(this.employeeName);
  }


  // Adds the submitted survey text to the employee's textdata
  // If the employee does not exist, it creates them in the list
  onSubmit(formData: NgForm) {

    // Check if the form data is empty, do nothing if so (may change later)
    if (!formData.value.employeeName || !formData.value.answer || (formData.value.employeeName === "") || (formData.value.answer === "")) {
      console.log("Survey Submission invalid. A required text field is empty.");
      return
    }

    // Try to add the employee to the list in the service and get the employee's index 
    let employeeIndex = this.profileService.findEmployeeIndex(formData.value.employeeName);

    // If the employee doesn't exist, create them
    if (employeeIndex === -1) {
      employeeIndex = this.profileService.addEmployee(formData.value.employeeName);
    }
    // Add the text data to the employee
    this.profileService.addTextData(formData.value.answer, employeeIndex);
    // Check if there is enough data for the profile and enable the button if so.
    this.enoughData = this.profileService.checkIfEnoughDataForProfile(employeeIndex);
  }





  ngOnInit() { }
}
