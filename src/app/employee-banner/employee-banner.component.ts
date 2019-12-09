import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";

@Component({
  selector: "app-employee-banner",
  templateUrl: "./employee-banner.component.html",
  styleUrls: ["./employee-banner.component.css"]
})
export class EmployeeBannerComponent implements OnInit {
  constructor(private profileService: ProfileService) {}
  employeeList: Employee[];
  defaultAvatar: string = "../../assets/defaultAvatar.png";

  ngOnInit() {
    this.employeeList = this.profileService.getEmployeeList();
  }
}
