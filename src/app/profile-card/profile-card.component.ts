import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { ChartsModule } from "ng2-charts";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"]
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  id: string;
  private sub: any;
  showGraph: boolean = false;

  returnedEmployee;
  // personalityData:
  radarChartLabels: string[] = [
    "Openness",
    "Conscientiousness",
    "Extraversion",
    "Agreeableness",
    "Neuroticism"
  ];
  radarChartData: any = [
    {
      data: [, , , ,],
      backgroundColor: "rgb(253,156,60,0.6)",
      borderColor: "#fd9c3c",
      pointBorderColor: "#000000",
      pointBackgroundColor: "#fd9c3c"
    }
  ];
  public radarChartType: string = "radar";

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log(this.showGraph);
    this.sub = this.route.params.subscribe(params => {
      this.id = params.index;
      console.log(params.index);
    });
    this.returnedEmployee = this.profileService.getEmployee(this.id);

    setTimeout(() => {
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
          // label: this.returnedEmployee,
          backgroundColor: "rgb(253,156,60,0.6)",
          borderColor: "#fd9c3c",
          pointBorderColor: "#000000",
          pointBackgroundColor: "#fd9c3c"
        }
      ];
    }, 2000);
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
