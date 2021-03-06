import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SplashComponent } from "./splash/splash.component";
import { ChartsModule } from "ng2-charts";
import { TeamBuilderComponent } from "./team-builder/team-builder.component";
import { SurveyFormComponent } from "./survey-form/survey-form.component";
import { ProfileCardComponent } from "./profile-card/profile-card.component";
import { EmployerDashboardComponent } from "./employer-dashboard/employer-dashboard.component";
import { EmployeeBannerComponent } from "./employee-banner/employee-banner.component";
import { HeaderComponent } from "./header/header.component";
import { TeamManagementComponent } from "./team-management/team-management.component";

@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    TeamBuilderComponent,
    SurveyFormComponent,
    ProfileCardComponent,
    EmployerDashboardComponent,
    EmployeeBannerComponent,
    HeaderComponent,
    TeamManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
