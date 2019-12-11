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
    "When you are stressed, what things do you do to calm down?",
    "If you were an animal, which animal would you be? Why?",
    "How do you behave at a party?",
    "How do you handle conflict?",
    "What's a personal accomplishment you are proud of? Why?",
    "What's something that irritates you? Why?",
    "What is the major factor that determines if you trust someone? Why?",
    "Are you quick to take risks? Why?",
    "How do you feel when you meet new people? Why?",
    "Do you often second guess your decisions? Why?"
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
