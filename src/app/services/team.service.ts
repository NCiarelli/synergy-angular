import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VirtualTimeScheduler } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TeamService {
  savedTeams = [];

  addCreatedTeam(doneTeam) {
    this.savedTeams.push(doneTeam);
  }
  getSavedTeams() {
    return this.savedTeams;
  }
  constructor(private http: HttpClient) {}
}
