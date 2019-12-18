import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VirtualTimeScheduler, Observable } from "rxjs";
import { Team } from '../interfaces/team';
import { Employee } from '../interfaces/employee';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: "root"
})
export class TeamService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly EXPRESS_URL = environment.expressServerBaseUrl;
  savedTeams: Team[] = [];


  constructor(private http: HttpClient, private profileService: ProfileService) { }

  addCreatedTeam(doneTeam: Employee[], teamTypeInput: string, teamName: string): Observable<any> {
    // Construct a team object from the inputs
    let teamObject: Team = { members: doneTeam, teamType: teamTypeInput, name: teamName };

    // Save team in database
    return this.sendTeamToDatabase(teamObject).pipe(map((response: any) => {
      teamObject.id = response.id;
      // Save team locally
      this.savedTeams.push(teamObject);
    }));
  }



  getSavedTeams() {
    return this.savedTeams;
  }

  getNewestSavedTeam() {
    return this.savedTeams[this.savedTeams.length - 1];
  }

  sendTeamToDatabase(team: Team): Observable<any> {
    // Setup the data needed by the Express Server to send to the database
    let requestData = { name: team.name, memberIds: [], teamType: team.teamType };
    for (let member of team.members) {
      // Pull out just the ids from the employee members of a team
      requestData.memberIds.push(member.databaseId);
    }
    // Make HTTP Request to Express Server to add a saved team entry to the database
    return this.http.post(`${this.EXPRESS_URL}/teams`, requestData);
  }

  // MUST RUN AFTER EMPLOYEES HAVE BEEN RETRIEVED FROM THE DATABASE
  getAllSavedTeamsFromDatabase(): Observable<any> {
    // Make HTTP Request to Express Server to get all the teams saved in the database
    return this.http.get(`${this.EXPRESS_URL}/teams`).pipe(map((response: any) => {
      // Force the teams list to be empty
      this.savedTeams.length = 0;
      // Add all the teams retrieved from the database to the local service teams list
      for (let databaseTeam of response) {
        this.savedTeams.push(this.teamDatabaseStructureToLocal(databaseTeam));
      }
    }));
  }

  teamDatabaseStructureToLocal(databaseTeam: any): Team {
    let teamObject: Team = {
      name: databaseTeam.team_name,
      teamType: databaseTeam.team_type,
      id: databaseTeam.id,
      notes: databaseTeam.notes,
      members: []
    }
    for (let memberId of databaseTeam.member_ids) {
      teamObject.members.push(this.profileService.findEmployeeById(memberId));
    }
    return teamObject;
  }

  updateTeamNotesInDatabase(team: Team): Observable<any> {
    return this.http.put(`${this.EXPRESS_URL}/teams/${team.id}/notes`, { notes: team.notes });
  }
}
