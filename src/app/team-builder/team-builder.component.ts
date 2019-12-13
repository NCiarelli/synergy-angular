import { Component, OnInit, ComponentFactoryResolver } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { Employee } from "../interfaces/employee";

@Component({
  selector: "app-team-builder",
  templateUrl: "./team-builder.component.html",
  styleUrls: ["./team-builder.component.css"]
})
export class TeamBuilderComponent implements OnInit {
  teamTypes = [
    {
      name: "Efficiency",
      structure: [[{}], [{}, {}, {}], [], [{}], [], []],
      backgroundClass: ["efficiency"],
      buttonActiveClass: [""]
    },
    {
      name: "Relationship Building",
      structure: [[{}], [], [{}, {}], [{}, {}], [], []],
      backgroundClass: ["relationship"],
      buttonActiveClass: [""]
    },
    {
      name: "Creativity",
      structure: [[{}, {}], [], [{}, {}], [], [], [{}]],
      backgroundClass: ["creativity"],
      buttonActiveClass: [""]
    },
    {
      name: "Risk Management",
      structure: [[], [{}, {}], [], [], [{}, {}], [{}]],
      backgroundClass: ["risk"],
      buttonActiveClass: [""]
    }
  ];
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
  activeHeaderText: string = "";
  teamBuilt: boolean = false;
  doneTeam: any[] = [];
  activeTeamTypeName: string = "";
  constructor(private profileService: ProfileService) { }

  ngOnInit() { }

  // Sets up the structure of the team builder for this team type by using the pre-defined team types object
  // Uses the structure property  of the teamType object to populate the team slot structure
  // Also does some changes for styling the buttons so that one button displays as active when clicked
  createBuilder(teamType) {
    // Set up structure of employee slots for the team type
    // Uses the spread operator to generate a clean structure each time a button is clicked
    this.teamSlots = [...teamType.structure];
    // Set what the background color should be for this team type, NOT IN USE RIGHT NOW
    this.headerBackgroundClass = teamType.backgroundClass;
    // Clear out any previous team selection for the button styling
    for (let teamType of this.teamTypes) {
      teamType.buttonActiveClass = [""];
    }
    // Gives styling for the clicked team type to the active button, CHANGE TO ALL THE SAME BACKGROUND
    teamType.buttonActiveClass = teamType.backgroundClass;
    // Reset the built team boolean and array
    // this.teamBuilt = false;
    this.doneTeam = [];
    this.activeTeamTypeName = teamType.name;
  }

  // Add an employee to the team's slots for the current personality type
  addEmployee(employee: Employee, personalityTypeSlots: any[]): void {
    // Check if the employee is already in a slot somewhere
    if (this.checkTeamSlots(slot => employee.name === slot.name)) {
      // If so, notify the user.
      console.log(`${employee.name} is already in this team!`);
      // And exit the function
      return;
    }
    // Try to add the employee to one of the slots for the current personality type
    for (let i = 0; i < personalityTypeSlots.length; i++) {
      // If a slot is empty...
      if (this.isSlotOpen(personalityTypeSlots[i])) {
        // Put the employee in the slot
        personalityTypeSlots[i] = employee;
        // Check if all slots are full
        if (!this.checkTeamSlots(slot => this.isSlotOpen(slot))) {
          // Push all the employees in slots to the finished team array
          for (let PersonalityTypeSlots of this.teamSlots) {
            for (let slot of PersonalityTypeSlots) {
              this.doneTeam.push(slot);
            }
          }
          // Change to the finished team display
          this.teamBuilt = true;
        }
        // And exit the function
        return;
      }
    }
    // If all slots are full, say something (should change this)
    console.log("All slots full for this personality type.");
  }

  // Give a function to check all slots against
  // Returns true if the function returns true for any slot
  // Returns false otherwise
  checkTeamSlots(checkFunction) {
    for (let PersonalityTypeSlots of this.teamSlots) {
      for (let slot of PersonalityTypeSlots) {
        if (checkFunction(slot)) {
          return true;
        }
      }
    }
    return false;
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
}
