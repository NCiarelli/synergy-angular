import { Component, OnInit, Inject } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { ChartsModule } from "ng2-charts";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"]
})
export class ProfileCardComponent implements OnInit {
  urlArray = this.document.location.href.split("/");
  parsedEmployeeName = this.urlArray[this.urlArray.length - 1].replace(
    "%20",
    " "
  );
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

  constructor(
    private profileService: ProfileService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // console.log(this.document.location.href.split("/"));
  }

  getChart(employee: string) {
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
    console.log(this.parsedEmployeeName);
    console.log(this.urlArray);
    this.returnedEmployee = this.profileService.getEmployee(
      this.parsedEmployeeName
    );
  }
}
