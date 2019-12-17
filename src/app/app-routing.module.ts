import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SplashComponent } from "./splash/splash.component";
import { EmployerDashboardComponent } from "./employer-dashboard/employer-dashboard.component";
import { SurveyFormComponent } from "./survey-form/survey-form.component";
import { TeamBuilderComponent } from "./team-builder/team-builder.component";
import { ProfileCardComponent } from "./profile-card/profile-card.component";
import { TeamManagementComponent } from "./team-management/team-management.component";

const routes: Routes = [
  { path: "employer-dashboard", component: EmployerDashboardComponent },
  { path: "employee-survey", component: SurveyFormComponent },
  //temporary switch
  { path: "profile", component: ProfileCardComponent },
  { path: "team-builder", component: TeamBuilderComponent },
  { path: "team-management", component: TeamManagementComponent },
  { path: "", component: SplashComponent },
  { path: "**", redirectTo: "" }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
