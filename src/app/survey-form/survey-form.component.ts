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
  surveyError: boolean = false;
  questionArrayIndex: number = 0;
  questionArray: string[] = [
    "How do you de-stress?",
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

  constructor(private profileService: ProfileService) { }

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
    // Check if the survey is at the last question
    if (this.questionArrayIndex < this.questionArray.length - 1) {
      // If not, increment the array index for the questions to display the next question
      this.questionArrayIndex++;
    } else {
      // If so, an error is indicated, displays an error page
      this.surveyError = true;
    }

    // Try to add the employee to the list in the service and get the employee's index
    // For database, move this to the name input form
    let employeeIndex = this.profileService.findEmployeeIndex(
      this.employeeName
    );

    // If the employee doesn't exist, create them
    if (employeeIndex === -1) {
      employeeIndex = this.profileService.addEmployee(this.employeeName);
    }
    // Add the text data to the employee object in the textData object, contentItems array
    this.profileService.addTextData(formData.value.answer, employeeIndex);
    // Check if there is enough data for the personality profile analysis.
    // This will trigger creating a personality profile in the profile service
    // Which is added to the employee object and overwrites the dominant personality stored
    this.enoughData = this.profileService.checkIfEnoughDataForProfile(employeeIndex);
    if (this.enoughData) {
      // If enough text data has been collected switch to the finished survey screen,
      // Meaning flip the boolean surveyFormActive to remove the survey form from the view.
      // With enoughData being true, the congrats screen will appear
      this.surveyFormActive = false;
    }
    // Reset the form
    formData.reset();
  }

  onNameSubmit(formData: NgForm) {
    this.employeeName = formData.value.nameInput;
    // Check if the employee already exists and has completed the survey. Then just display an open ended prompt like "Tell us more about yourself."
    // After the submit it will reanalyze a new personality profile including the recently submitted text data
    // This requires making the boolean value changes after the check on the employee name comes back.
    // For database, this means it has to happen in the subscribe function callback of the database query.
    this.nameFormActive = false;
    this.surveyFormActive = true;
  } //no longer want name for active
  //want survey form active

  ngOnInit() { }
}
