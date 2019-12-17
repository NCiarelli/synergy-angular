import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { VirtualTimeScheduler, Observable } from "rxjs";
import { Team } from '../interfaces/team';
import { Employee } from '../interfaces/employee';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class TeamService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly EXPRESS_URL = environment.expressServerBaseUrl;
  savedTeams: Team[] = [];


  constructor(private http: HttpClient) { }

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

  // teamDatabaseStructureToLocal(databaseTeam: any): Team {

  // }

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

  // getAllSavedTeamsFromDatabase(): Observable<any> {
  //   // Make HTTP Request to Express Server to get all the teams saved in the database
  // }
}
