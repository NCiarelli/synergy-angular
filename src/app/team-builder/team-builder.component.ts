import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-team-builder",
  templateUrl: "./team-builder.component.html",
  styleUrls: ["./team-builder.component.css"]
})
export class TeamBuilderComponent implements OnInit {
  teamTypes = {
    efficiency: [[{}], [{}, {}, {}], [], [{}], [], []],
    relationshipBuilding: [[{}], [], [{}, {}], [{}, {}], [], []],
    creativity: [[{}, {}], [], [{}, {}], [], [], [{}]],
    riskManagement: [[], [{}, {}], [], [], [{}, {}], [{}]]
  };

  //   team_types = {
  //     Efficiency: [1, 3, 0, 1, 0, 0];
  //     Relationship_building: [1, 0, 2, 2, 0, 0];
  //     Creativity: [2, 0, 2, 0, 0, 1];
  //     Risk_management: [0, 2, 0, 0, 2, 1]
  // }

  //   big5 trait order key
  // 1. openness
  // 2. conscientiousness = pragmatic
  // 3. extraversion = distruptive
  // 4. agreeableness = relationship
  // 5. neuroticism =
  // 6. any

  constructor() {}

  ngOnInit() {}
}
