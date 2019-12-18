import { Component, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";
import { Team } from "../interfaces/team";
import { NgForm } from "@angular/forms";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-team-management",
  templateUrl: "./team-management.component.html",
  styleUrls: ["./team-management.component.css"]
})
export class TeamManagementComponent implements OnInit {
  activeTeam: Team;
  overlayDisplay: boolean = false;
  modalDisplay: boolean = false;
  notesText: string = "";
  savedTeams: Team[];
  defaultAvatar: string = "../../assets/defaultAvatar.png";
  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.activeTeam = this.teamService.getNewestSavedTeam();
    if (this.activeTeam) {
      this.notesText = this.activeTeam.notes;
    }

    this.savedTeams = this.teamService.getSavedTeams();
  }
  makeTeamActive(team) {
    this.activeTeam = team;
    if (this.activeTeam.notes) {
      this.notesText = this.activeTeam.notes;
    } else {
      this.notesText = "";
    }
  }
  loadModal() {
    this.overlayDisplay = true;
    this.modalDisplay = true;
  }

  closeModal() {
    this.overlayDisplay = false;
    this.modalDisplay = false;
  }

  postNote() {
    this.overlayDisplay = false;
    this.modalDisplay = false;
    this.activeTeam.notes = this.notesText;
    this.teamService.updateTeamNotesInDatabase(this.activeTeam).subscribe();
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
