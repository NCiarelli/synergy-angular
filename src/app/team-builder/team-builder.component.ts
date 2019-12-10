import { Component, OnInit } from "@angular/core";
import { ProfileService } from '../services/profile.service';

@Component({
  selector: "app-team-builder",
  templateUrl: "./team-builder.component.html",
  styleUrls: ["./team-builder.component.css"]
})
export class TeamBuilderComponent implements OnInit {
  teamTypes = {
    Efficiency: [[{}], [{}, {}, {}], [], [{}], [], []],
    "Relationship Building": [[{}], [], [{}, {}], [{}, {}], [], []],
    Creativity: [[{}, {}], [], [{}, {}], [], [], [{}]],
    "Risk Management": [[], [{}, {}], [], [], [{}, {}], [{}]]
  };
  //   team_types = {
  //     Efficiency: [1, 3, 0, 1, 0, 0];
  //     Relationship_building: [1, 0, 2, 2, 0, 0];
  //     Creativity: [2, 0, 2, 0, 0, 1];
  //     Risk_management: [0, 2, 0, 0, 2, 1]
  // }
  teamNames = Object.keys(this.teamTypes);
  teamSlots: any[] = [[], [], [], [], [], []];
  personalityTypes = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism",
    "Any"
  ];

  //   big5 trait order key
  // 0. openness
  // 1. conscientiousness = pragmatic
  // 2. extraversion = distruptive
  // 3. agreeableness = relationship
  // 4. neuroticism =
  // 5. any

  constructor(private profileService: ProfileService) { }

  ngOnInit() { }

  // Sets up the structure of the team builder for this team type by using the pre-defined team types object
  // Uses the HTML templates to populate
  createBuilder(teamName: string) {
    this.teamSlots = [...this.teamTypes[teamName]];
  }

  // Add an employee to the team's slots for the current personality type
  addEmployee(employeeName: string, personalityTypeSlots: any[]): void {
    // Get the employee object from the profile service based on employee name
    let employeeObject = this.profileService.getEmployee(employeeName);
    // Check if the employee exists (should be extra, should only be possible if coding did something wrong)
    if (employeeObject === -1) {
      console.log("Something is wrong, no employee found!");
    } else {
      // If employee exists, try to add it to one of the slots for the current personality type
      for (let i = 0; i < personalityTypeSlots.length; i++) {
        // If a slot is empty...
        if (personalityTypeSlots[i] === {}) {
          // Put the employee in the slot
          personalityTypeSlots[i] = employeeObject;
          // And exit the function
          return;
        }
      }
      // If all slots are full, say something (shoould change this)
      console.log("All slots full for this personality type.");
    }
  }
}
