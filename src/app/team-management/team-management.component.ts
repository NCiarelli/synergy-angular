import { Component, OnInit } from "@angular/core";
import { TeamService } from "../services/team.service";

@Component({
  selector: "app-team-management",
  templateUrl: "./team-management.component.html",
  styleUrls: ["./team-management.component.css"]
})
export class TeamManagementComponent implements OnInit {
  constructor(private teamService: TeamService) {}

  ngOnInit() {}
}
