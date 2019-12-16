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
  activeEmployee: Employee;
  nameFormActive: boolean = true;
  surveyFormActive: boolean = false;
  enoughData: boolean = false;
  surveyError: boolean = false;
  questionArrayIndex: number = 1;
  questionArray: string[] = [
    "Please tell us more about yourself.",
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


    // Add the text data to the employee object in the textData object, contentItems array, as well as the database
    this.profileService.addTextData(formData.value.answer, this.activeEmployee).subscribe(() => {
      // Check if there is enough data for the personality profile analysis.
      // This will trigger creating a personality profile in the profile service
      // Which is added to the employee object and overwrites the dominant personality stored
      this.enoughData = this.profileService.checkIfEnoughDataForProfile(this.activeEmployee);
      if (this.enoughData) {
        // If enough text data has been collected...
        // Create the personality profile for the employee
        this.profileService.createProfile(this.activeEmployee);
        // And flip the boolean surveyFormActive to remove the survey form from the view.
        // With enoughData being true, the congrats screen will appear
        this.surveyFormActive = false;
      }
      // Reset the form
      formData.reset();
    });
  }

  onNameSubmit(formData: NgForm) {
    this.employeeName = formData.value.nameInput;
    // Check if the employee already exists and has completed the survey. Then just display an open ended prompt like "Tell us more about yourself."
    // After the submit it will reanalyze a new personality profile including the recently submitted text data
    // This requires making the boolean value changes after the check on the employee name comes back.
    // For database, this means it has to happen in the subscribe function callback of the database query.

    // Try to find the employee in the local list in the service and get the employee
    this.activeEmployee = this.profileService.getEmployee(this.employeeName);

    // If the employee doesn't exist, create them
    if (this.activeEmployee.name === "") {
      this.profileService.addEmployee(this.employeeName).subscribe(() => {
        // When an employee has finished being added to both the database anad local list
        // Get the added (newest) employee on the list
        this.activeEmployee = this.profileService.getNewestEmployee()
        // Then activate the survey form
        this.nameFormActive = false;
        this.surveyFormActive = true;
      });
    } else {
      // If the employee exists, check how much survey data they have entered already
      // Retrieve the data from the database
      this.profileService.getSurveyEntriesByEmployeeId(this.activeEmployee).subscribe(() => {
        // Check if there is enough data for the personality profile analysis.
        this.enoughData = this.profileService.checkIfEnoughDataForProfile(this.activeEmployee);
        if (this.enoughData) {
          // If enough text data has been collected, change the survey question index to 0 to display the generic prompt for more info
          this.questionArrayIndex = 0;
        }
        // Activate the survey form
        this.nameFormActive = false;
        this.surveyFormActive = true;
      })

    }

  }

  ngOnInit() { }
}
