import { Component, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";
import { Team } from "../interfaces/team";

@Component({
  selector: "app-team-management",
  templateUrl: "./team-management.component.html",
  styleUrls: ["./team-management.component.css"]
})
export class TeamManagementComponent implements OnInit {
  activeTeam: Team;
  overlayDisplay: boolean = false;
  modalDisplay: boolean = false;
  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.activeTeam = this.teamService.getNewestSavedTeam();
  }

  loadModal() {
    this.overlayDisplay = true;
    this.modalDisplay = true;
  }

  closeModal() {
    this.overlayDisplay = false;
    this.modalDisplay = false;
  }
}
