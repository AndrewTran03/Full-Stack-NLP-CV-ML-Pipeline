import { Component, Input, OnDestroy, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Data } from "../../shared/models/data.model";
import { DataService } from "../../shared/services/data.service";
import { SimpleMLService } from "../../shared/services/simple_ml.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-data",
  imports: [CommonModule],
  templateUrl: "./data.component.html",
  styleUrl: "./data.component.css"
})
export class DataComponent implements OnDestroy {
  @Input() dataArr = signal<Data[]>([]);
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly dataService: DataService,
    private readonly simpleMLService: SimpleMLService
  ) {}

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  getAllData() {
    const subscription = this.dataService.getAllData().subscribe((resultDataArr) => {
      console.log(resultDataArr);
      this.dataArr.set(resultDataArr);
    });
    this.subscriptions.push(subscription);
  }

  getQueriedData() {
    const subscription = this.dataService.getQueriedData({ age: 25, name: "Jane" }).subscribe((resultData) => {
      console.log(resultData);
      this.dataArr.set(resultData);
    });
    this.subscriptions.push(subscription);
  }

  getDataError() {
    const subscription = this.dataService.getDataError().subscribe((resultData) => {
      console.log(resultData);
    });
    this.subscriptions.push(subscription);
  }

  getSpecifiedData() {
    const subscription = this.dataService.getSpecifiedData({ age: 20, name: "Alice" }).subscribe((resultData) => {
      console.log(resultData);
    });
    this.subscriptions.push(subscription);
  }

  getSimpleMLRequestData() {
    const subscription = this.simpleMLService.getSimpleMLRequest().subscribe((resultData) => {
      console.log(resultData);
    });
    this.subscriptions.push(subscription);
  }

  getTime(date: Date): string {
    return date.getTime().toString();
  }

  clearDataArrLocally() {
    this.dataArr.set([]);
    console.log("Data Arr Cleared");
    console.log(this.dataArr());
  }
}
