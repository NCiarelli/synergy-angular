import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { ProfileService } from "../services/profile.service";
import { ChartsModule } from "ng2-charts";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-profile-card",
  templateUrl: "./profile-card.component.html",
  styleUrls: ["./profile-card.component.css"]
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  name: string;
  sub: any;
  defaultAvatar: string = "../../assets/default_img.png";
  showGraph: boolean = false;

  returnedEmployee;
  // personalityData:
  radarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false }
  };
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
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    console.log(this.showGraph);
    this.sub = this.route.params.subscribe(params => {
      this.name = params.name;
      this.returnedEmployee = this.profileService.getEmployee(this.name);
      if (this.returnedEmployee.personalityProfile) {
        this.radarChartData = [
          {
            data: [
              this.returnedEmployee.personalityProfile.personality[0]
                .raw_score * 100,
              this.returnedEmployee.personalityProfile.personality[1]
                .raw_score * 100,
              this.returnedEmployee.personalityProfile.personality[2]
                .raw_score * 100,
              this.returnedEmployee.personalityProfile.personality[3]
                .raw_score * 100,
              this.returnedEmployee.personalityProfile.personality[4]
                .raw_score * 100
            ],
            // label: this.returnedEmployee,
            backgroundColor: "rgb(253,156,60,0.6)",
            borderColor: "#fd9c3c",
            pointBorderColor: "#000000",
            pointBackgroundColor: "#fd9c3c"
          }
        ];
      } else if (!this.returnedEmployee.name) {
        // If the employee has no name (doesn't exist), return to the employer dashboard
        this.router.navigate(["employer-dashboard"]);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
