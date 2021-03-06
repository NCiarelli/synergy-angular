import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-splash",
  templateUrl: "./splash.component.html",
  styleUrls: ["./splash.component.css"]
})
export class SplashComponent implements OnInit {
  overlayDisplay: boolean = false;
  modalDisplay: boolean = false;

  constructor() {}

  loadModal() {
    this.overlayDisplay = true;
    this.modalDisplay = true;
  }

  closeModal() {
    this.overlayDisplay = false;
    this.modalDisplay = false;
  }

  ngOnInit() {}
}
