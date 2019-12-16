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
    // Import all employee data from the database
    this.profileService.retrieveEmployeeList();
    console.log(this.profileService.getEmployeeList());
  }
}
