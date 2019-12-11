import { Component, OnInit, ComponentFactoryResolver } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";

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

  defaultAvatar: string = "../../assets/defaultAvatar.png";

  //   big5 trait order key
  // 0. openness
  // 1. conscientiousness = pragmatic
  // 2. extraversion = distruptive
  // 3. agreeableness = relationship
  // 4. neuroticism =
  // 5. any
  //default to an array with empty string which applies no class
  headerBackgroundClass: string[] = [""];

  constructor(private profileService: ProfileService) {}

  ngOnInit() {}

  // Sets up the structure of the team builder for this team type by using the pre-defined team types object
  // Uses the HTML templates to populate
  createBuilder(teamName: string) {
    this.teamSlots = [...this.teamTypes[teamName]];
    this.changeBackground(teamName);
  }

  // Add an employee to the team's slots for the current personality type
  addEmployee(employee: Employee, personalityTypeSlots: any[]): void {
    // Try to add the employee to one of the slots for the current personality type
    for (let i = 0; i < personalityTypeSlots.length; i++) {
      // If a slot is empty...
      if (this.isSlotOpen(personalityTypeSlots[i])) {
        // Put the employee in the slot
        personalityTypeSlots[i] = employee;
        // And exit the function
        return;
      } else {
        // If a slot is not empty, check if the employee is already in this slot
        if (personalityTypeSlots[i].name === employee.name) {
          console.log(`${employee.name} is already in this team!`);
          // If so, exit the function
          return;
        }
      }
    }
    // If all slots are full, say something (should change this)
    console.log("All slots full for this personality type.");
  }

  getSrcLink(slotObject) {
    if (this.isSlotOpen(slotObject)) {
      // If the slot is open/empty, display the default Avatar picture
      return this.defaultAvatar;
    } else {
      // Otherwise check if the slot's employee object has a picture and return the appropriate link
      return slotObject.headShot ? slotObject.headShot : this.defaultAvatar;
    }
  }

  getPersonalityClass(slotObject): string[] {
    if (!this.isSlotOpen(slotObject)) {
      // If the slot is filled, pass on the dominant personality as the class
      return [slotObject.dominantPersonality];
    } else {
      // Otherwise, use the None class
      return ["None"];
    }
  }

  isSlotOpen(slotObject): boolean {
    if (
      Object.entries(slotObject).length === 0 &&
      slotObject.constructor === Object
    ) {
      return true;
    } else {
      return false;
    }
  }
  changeBackground(teamType) {
    if (this.teamNames[0] === teamType) {
      this.headerBackgroundClass = ["efficiency"];
    } else if (this.teamNames[1] === teamType) {
      this.headerBackgroundClass = ["relationship"];
    } else if (this.teamNames[2] === teamType) {
      this.headerBackgroundClass = ["creativity"];
    } else if (this.teamNames[3] === teamType) {
      this.headerBackgroundClass = ["risk"];
    }
  }
}
