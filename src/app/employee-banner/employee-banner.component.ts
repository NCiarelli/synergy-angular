import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";

@Component({
  selector: "app-employee-banner",
  templateUrl: "./employee-banner.component.html",
  styleUrls: ["./employee-banner.component.css"]
})
export class EmployeeBannerComponent implements OnInit {
  @Input() personalityFilter: string;
  @Output() pickEmployee = new EventEmitter<Employee>();

  constructor(private profileService: ProfileService) { }
  employeeList: Employee[];
  defaultAvatar: string = "../../assets/defaultAvatar.png";

  ngOnInit() {
    this.employeeList = this.profileService.getEmployeeList();
  }

  filterEmployeeList(): Employee[] {
    // Filter the employee list based on any personlity type that was given as an input binding

    // If there is not filter type or the type is "Any"
    if (!this.personalityFilter || this.personalityFilter === "Any") {
      // Get all employees from the list in the service
      return this.employeeList;
    } else {
      // Otherwise
      // Get only the employees that match the personality type filter
      return this.employeeList.filter((employee: Employee) => {
        return employee.dominantPersonality === this.personalityFilter;
      });
    }
  }

  clickEmployee(employee: Employee): void {
    this.pickEmployee.emit(employee);
  }
}
