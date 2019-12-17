import { Component, OnInit } from "@angular/core";
import { Employee } from "../interfaces/employee";
import { ProfileService } from "../services/profile.service";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-employer-dashboard",
  templateUrl: "./employer-dashboard.component.html",
  styleUrls: ["./employer-dashboard.component.css"]
})
export class EmployerDashboardComponent implements OnInit {
  constructor(private profileService: ProfileService) { }
  employeeList: Employee[];
  defaultAvatar: string = "../../assets/defaultAvatar.png";
  filterText: string = "";

  ngOnInit() {
    this.employeeList = this.profileService.getEmployeeList();
    console.log(this.employeeList);
  }

  match: string;
  findMatch(form: NgForm) {
    this.match = form.value.filterText.trim().toLowerCase();
  }
  filterByName(): any {
    if (!this.match) {
      // if there is no filter text, just return the entire list
      return this.employeeList;
    } else {
      return this.employeeList.filter(
        employee =>
          employee.name.toLowerCase().includes(this.match) ||
          employee.dominantPersonality.toLowerCase().includes(this.match)
      );
    }
  }
}

// match: string;
// findMatch(form: NgForm) {
//   this.match = form.value.filterText.trim().toLowerCase();
// }
// filter() {
//   if (!this.match) {
//     return this.todos;
//   } else {
//     return this.todos.filter(todo =>
//       todo.task.toLowerCase().includes(this.match)
//     );
//   }
// }
// }
