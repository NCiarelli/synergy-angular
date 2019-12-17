import { Component, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";
import { Team } from '../interfaces/team';

@Component({
  selector: "app-team-management",
  templateUrl: "./team-management.component.html",
  styleUrls: ["./team-management.component.css"]
})
export class TeamManagementComponent implements OnInit {
  activeteam: Team;

  constructor(private teamService: TeamService) { }

  ngOnInit() {
    this.activeteam = this.teamService.getNewestSavedTeam();
  }
}
