import { Component, OnInit } from "@angular/core";
import { Employee } from "../interfaces/employee";
import { ProfileService } from "../services/profile.service";

@Component({
  selector: "app-employer-dashboard",
  templateUrl: "./employer-dashboard.component.html",
  styleUrls: ["./employer-dashboard.component.css"]
})
export class EmployerDashboardComponent implements OnInit {
  constructor(private profileService: ProfileService) { }
  employeeList: Employee[];
  defaultAvatar: string = "../../assets/defaultAvatar.png";

  ngOnInit() {
    this.employeeList = this.profileService.getEmployeeList();
    console.log(this.employeeList);
  }
}
