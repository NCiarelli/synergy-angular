import { Component, OnInit } from '@angular/core';
import { ProfileService } from './services/profile.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'synergy-angular';

  constructor(private profileService: ProfileService) { }
  ngOnInit() {
    // Import some static example data from the JSON to the service employeeList array
    // REMOVE WHEN WE GET A DATABASE WORKING
    this.profileService.importExampleData();
    console.log(this.profileService.getEmployeeList());
  }
}
