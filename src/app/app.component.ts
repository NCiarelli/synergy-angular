import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./services/profile.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "synergy-angular";

  constructor(private profileService: ProfileService) {}
  ngOnInit() {
    // // Import all employee data from the database when the site starts up anywhere
    this.profileService.retrieveEmployeeList().subscribe(() => {
      console.log(this.profileService.getEmployeeList());
    });
    // // Import from local assets/example.json
    // this.profileService.importExampleData();
    // console.log(this.profileService.getEmployeeList());
  }
}
