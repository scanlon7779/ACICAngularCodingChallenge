import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { InMemoryDataService } from '../in-memory-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private inMemoryDataService: InMemoryDataService 
  ) { }

  ngOnInit() {
    this.getPopularLinesOfBusiness();
  }

  getPopularLinesOfBusiness(): void {
    this.lineOfBusinessService.getLinesOfBusiness()
      .subscribe(allLines => {
        const lineFrequency: { [key: number]: number } = {};

        const recentQuotes = this.inMemoryDataService.getRecentQuotes();

        recentQuotes.forEach(quote => {
          if (lineFrequency.hasOwnProperty(quote.lineOfBusiness)) {
            lineFrequency[quote.lineOfBusiness]++;
          } else {
            lineFrequency[quote.lineOfBusiness] = 1;
          }
        });

        const sortedLines = allLines.sort((a, b) => lineFrequency[b.id] - lineFrequency[a.id]);
        this.linesOfBusiness = sortedLines.slice(0, 2);
      });
  }
}
