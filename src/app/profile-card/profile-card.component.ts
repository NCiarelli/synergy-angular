import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { ChartsModule } from "ng2-charts";

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"]
})
export class ProfileCardComponent implements OnInit {
  returnedEmployee;
  // personalityData:
  radarChartLabels: string[] = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism"
  ];
  radarChartData: any;
  public radarChartType: string = "radar";

  constructor(private profileService: ProfileService) {}

  getChart(employee: string) {
    this.returnedEmployee = this.profileService.getEmployee(employee);
    this.radarChartData = [
      {
        data: [
          this.returnedEmployee.personalityProfile.personality[0].raw_score *
            100,
          this.returnedEmployee.personalityProfile.personality[1].raw_score *
            100,
          this.returnedEmployee.personalityProfile.personality[2].raw_score *
            100,
          this.returnedEmployee.personalityProfile.personality[3].raw_score *
            100,
          this.returnedEmployee.personalityProfile.personality[4].raw_score *
            100
        ],
        label: employee,
        backgroundColor: "rgb(253,156,60,0.6)",
        borderColor: "#fd9c3c",
        pointBorderColor: "#000000",
        pointBackgroundColor: "#fd9c3c"
      }
    ];
    console.log(this.returnedEmployee);
  }

  ngOnInit() {
    this.returnedEmployee = this.getChart("Colin Sords");
  }
}
