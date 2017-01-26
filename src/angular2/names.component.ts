import {Component, AfterViewChecked, OnInit} from '@angular/core';
import * as faker from 'faker';

@Component({
  selector: 'app',
  // templateUrl: './names.component.html'
  template: `<div>Saying Hello to <b>{{names}}</b> names</div>
            <ul>
              <li *ngFor="let name of testData">
                <span>{{ name.first}}</span> <span>{{name.last}}</span> <span>{{name.suffix}}</span>
              </li>
            </ul>`
})

export class Names {
  public testData;
  public renderTime;
  public names = 10000;
  private start;

  constructor() {
    setInterval(() => {
      console.log('rendering angular app');
      this.start = performance.now();
      this.testData = this.getNewNames();
    }, 10);
  }

  public ngAfterViewChecked() {
    var end = performance.now();
    var time = (end - this.start).toFixed(3) + 'ms';
    console.log(`angular app start peformance: ${time}`);
    document.getElementById("timeclient").innerHTML = time;
  }

  public getNewNames() {
    let testData = [];
    let totalNames = 10000;

    [...Array(totalNames)].forEach((_, i) => {
      testData.push(
        {first: faker.name.firstName(), last: faker.name.lastName(), suffix: faker.name.suffix()}
      );
    });
    return testData;
  }
}
