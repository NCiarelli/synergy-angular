import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-survey-form",
  templateUrl: "./survey-form.component.html",
  styleUrls: ["./survey-form.component.css"]
})
export class SurveyFormComponent implements OnInit {
  employeeList: Employee[] = [];
  nextDataId: number = 0;
  outputText;

  constructor(private profileService: ProfileService) {}

  getProfile(employeeIndex) {
    this.profileService
      .getProfile(this.employeeList[employeeIndex].textData)
      .subscribe(profile => {
        this.outputText = profile;
        console.log(profile);
      });
  }

  onSubmit(formData: NgForm) {
    //find if employee exists with given name
    //  if exists add text data entry
    //  else create employee and add text data entry
  }
  ngOnInit() {}
}
