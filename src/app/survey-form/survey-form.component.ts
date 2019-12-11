import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";
import { NgForm } from "@angular/forms";
import { ContentItem } from "../interfaces/content-item";

@Component({
  selector: "app-survey-form",
  templateUrl: "./survey-form.component.html",
  styleUrls: ["./survey-form.component.css"]
})
export class SurveyFormComponent implements OnInit {
  outputText;
  employeeName: string;
  nameFormActive: boolean = true;
  surveyFormActive: boolean = false;
  enoughData: boolean = false;
  questionArrayIndex: number = 0;
  questionArray: string[] = [
    "How do you handle conflict?",
    "What is your favorite animal, why?"
  ];

  constructor(private profileService: ProfileService) {}

  // createProfile() {
  //   this.profileService.createProfile(this.employeeName);
  // }

  // Adds the submitted survey text to the employee's textdata
  // If the employee does not exist, it creates them in the list
  onSubmit(formData: NgForm) {
    // Check if the form data is empty, do nothing if so (may change later)
    if (!formData.value.answer || formData.value.answer === "") {
      console.log("Survey Submission invalid. The survey field is empty.");
      return;
    }
    if (this.questionArrayIndex < this.questionArray.length - 1) {
      this.questionArrayIndex++;
    }

    // Try to add the employee to the list in the service and get the employee's index
    let employeeIndex = this.profileService.findEmployeeIndex(
      this.employeeName
    );

    // If the employee doesn't exist, create them
    if (employeeIndex === -1) {
      employeeIndex = this.profileService.addEmployee(this.employeeName);
    }
    // Add the text data to the employee
    this.profileService.addTextData(formData.value.answer, employeeIndex);
    // Check if there is enough data for the profile and enable the button if so.
    this.enoughData = this.profileService.checkIfEnoughDataForProfile(
      employeeIndex
    );
    if (this.enoughData) {
      this.surveyFormActive = false;
    }
    // Reset the form
    formData.reset();
  }

  onNameSubmit(formData: NgForm) {
    this.employeeName = formData.value.nameInput;
    this.nameFormActive = false;
    this.surveyFormActive = true;
  }

  ngOnInit() {}
}
