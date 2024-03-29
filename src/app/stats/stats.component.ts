import { Component, OnInit } from '@angular/core';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { DataService } from '../data.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})

export class StatsComponent implements OnInit {

  // Pool Space chart options
  spaceLegend: boolean = false;
  spaceShowLabels: boolean = false;
  spaceAnimations: boolean = true;
  spaceAxisX: boolean = false;
  spaceAxisY: boolean = true;
  spaceShowAxisXLabel: boolean = true;
  spaceShowAxisYLabel: boolean = false;
  spaceShowTimeline: boolean = false;
  spaceData: any[] = null;
  spaceDays: number = 7;

  // New pool space chart
  ngSpaceLegend: boolean = true;
  nxSpaceLegendPosition: string = 'below';
  nxSpaceLegendTitle: string = '';
  ngSpaceShowLabels: boolean = true;
  ngSpaceAnimations: boolean = true;
  ngSpaceAxisX: boolean = false;
  ngSpaceAxisY: boolean = true;
  ngSpaceShowAxisXLabel: boolean = true;
  ngSpaceShowAxisYLabel: boolean = false;
  ngSpaceShowTimeline: boolean = false;
  ngSpaceData: any[] = null;
  ngSpaceDays: number = 7;

  netspaceLegend: boolean = false;
  netspaceShowLabels: boolean = true;
  netspaceAnimations: boolean = true;
  netspaceAxisX: boolean = false;
  netspaceAxisY: boolean = true;
  netspaceShowAxisXLabel: boolean = true;
  netspaceShowAxisYLabel: boolean = false;
  netspaceShowTimeline: boolean = false;
  netspaceData: any[] = null;
  netspaceDays: number = 7;

  priceLegend: boolean = true;
  priceLegendPosition: string = 'below';
  priceLegendTitle: string = '';
  priceShowLabels: boolean = true;
  priceAnimations: boolean = true;
  priceAxisX: boolean = false;
  priceAxisY: boolean = true;
  priceShowAxisXLabel: boolean = true;
  priceShowAxisYLabel: boolean = false;
  priceShowTimeline: boolean = false;
  priceData: any[] = null;
  priceDays: number = 7;

  blocksGradient: boolean = true;
  blocksAxisX: boolean = false;
  blocksAxisY: boolean = true;
  blocksShowAxisXLabel: boolean = true;
  blocksShowAxisYLabel: boolean = false;
  blocksData: any[] = null;

  mempoolDays: number = 1;
  mempoolAxisX: boolean = false;
  mempoolAxisY: boolean = true;
  mempoolShowAxisXLabel: boolean = true;
  mempoolShowAxisYLabel: boolean = false;
  mempoolData: any[] = null;

  poolEffortPerDayLegend: boolean = false;
  poolEffortPerDayAnimations: boolean = true;
  poolEffortPerDayGradient: boolean = true;
  poolEffortPerDayAxisX: boolean = false;
  poolEffortPerDayAxisY: boolean = true;
  poolEffortPerDayAxisYLabel: string = $localize`Per Day`;
  poolEffortPerDayShowAxisXLabel: boolean = false;
  poolEffortPerDayShowAxisYLabel: boolean = true;
  poolEffortPerDayData: any[] = null;

  poolEffortPerBlockLegend: boolean = false;
  poolEffortPerBlockAnimations: boolean = true;
  poolEffortPerBlockGradient: boolean = true;
  poolEffortPerBlockAxisX: boolean = false;
  poolEffortPerBlockAxisY: boolean = true;
  poolEffortPerBlockAxisYLabel: string = $localize`Per Block`;
  poolEffortPerBlockShowAxisXLabel: boolean = false;
  poolEffortPerBlockShowAxisYLabel: boolean = true;
  poolEffortPerBlockData: any[] = null;

  oneColorScheme = { domain: ['#149b00'] };
  multiColorScheme = { domain: ['#006400', '#9ef01a', '#008000', '#70e000'] };

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.refreshSize(7);
    this.getNetspace(7);
    this.getXchPrice(7);
    this.getMempool(1);
    this.getBlocks();
  }

  refreshSize(days: number) {
    this.dataService.getPoolSize(days).subscribe((d) => {
      this.ngSpaceDays = days;
      var data: Map<String, Array<any>> = new Map();
      (<any[]>d).map((i) => {
        if(!data.has(i['field'])) {
          data.set(i['field'], new Array());
        }
        data.get(i['field']).push({ 'name': new Date(i['datetime']).toLocaleString(), 'value': i['value'], 'label': i['field'] + ': ' + (i['value'] / 1024 ** 5).toFixed(2).toString() + ' PiB' });
      });
      this.ngSpaceData = [];
      data.forEach((v, k) => {
        this.ngSpaceData.push({
          "name": k,
          "series": v,
        })
      })
    })
  }

  getMempool(days: number) {
    this.dataService.getMempool(days).subscribe((d) => {
      this.mempoolDays = days;
      this.mempoolData = [{
        "name": "Full Percentage",
        "series": (<any[]>d).filter(item => item['field'] == 'full_pct').map((item) => {
          return ({
            "name": (new Date(item['datetime']).toLocaleString()),
            "value": item['value'],
            "label": `${item['value']}%`,
          })
        })
      }];
    })
  }

  getXchPrice(days: number) {
    this.dataService.getXchPrice(days).subscribe((d) => {
      this.priceDays = days;
      var data: Map<String, Array<any>> = new Map();
      (<any[]>d).map((i) => {
        if(!data.has(i['field'])) {
          data.set(i['field'], new Array());
        }
        data.get(i['field']).push({
          'name': new Date(i['datetime']).toLocaleString(),
          'value': i['value'].toFixed((['btc', 'eth'].includes(i['field'])) ? 5 : 2),
          'label': i['field'] + ': ' + i['value'].toFixed((['btc', 'eth'].includes(i['field'])) ? 5 : 2),
        });
      });
      this.priceData = [];
      data.forEach((v, k) => {
        this.priceData.push({
          "name": k,
          "series": v,
        })
      })
    })
  }

  getNetspace(days: number) {
    this.dataService.getNetspace(days).subscribe((d) => {
      this.netspaceDays = days;
      this.netspaceData = [{
        "name": "Size",
        "series": (<any[]>d).map((item) => {
          return ({
            "name": (new Date(item['datetime']).toLocaleString()),
            "value": item['value'],
            "label": (item['value'] / 1024 ** 4).toFixed(2).toString() + ' EiB',
          })
        })
      }];
    })
  }

  getBlocks() {
    var blocksPerDay: Map<String, number> = new Map();
    var effortPerDay: Map<String, number> = new Map();
    this.dataService.getBlocks().subscribe(d => {
      // used in blocks per day chart
      (<any[]>d['results']).map((item) => {
        var date = new Date(Math.floor(item['timestamp']) * 1000).toLocaleDateString();
        blocksPerDay.set(date, (blocksPerDay.get(date) || 0) + 1);
        effortPerDay.set(date, (effortPerDay.get(date) || 0) + item['luck']);
      });
      var seriesBlocks = [];
      blocksPerDay.forEach((v, k) => {
        seriesBlocks.push({
          'name': k,
          'value': v,
          'label': `${v.toString()} Block(s)`
        })
      });
      this.blocksData = seriesBlocks.reverse();
      // used in pool effort chart (per day)
      var seriesEffort = [];
      effortPerDay.forEach((v, k) => {
        seriesEffort.push({
          'name': k,
          'value': v / (blocksPerDay.get(k)),
          'label': `Average ${(v / (blocksPerDay.get(k))).toString()}%`
        })
      });
      this.poolEffortPerDayData = seriesEffort.reverse();
      // used in pool effort chart (per block)
      var seriesPoolEffortPerBlock = [];
      (<any[]>d['results']).map((item) => {
        seriesPoolEffortPerBlock.push({
          "name": item['farmed_height'].toString() + ", " + (new Date(Math.floor(item['timestamp']) * 1000).toLocaleDateString()),
          "value": item['luck'],
          "label": `Effort ${item['luck']}%`
        })
      })
      this.poolEffortPerBlockData = seriesPoolEffortPerBlock.reverse();
    });
  }

  spaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 5).toFixed(0).toString() + ' PiB';
  }

  ngSpaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 5).toFixed(0).toString() + ' PiB';
  }

  netspaceFormatAxisY(spaceData: number) {
    return (spaceData / 1024 ** 4).toFixed(0).toString() + ' EiB';
  }

  mempoolFormatAxisY(data: number) {
    return (data).toFixed(0).toString() + '%';
  }

  poolEffortFormatAxisY(data: number) {
    return (data).toFixed(0).toString() + '%';
  }

}
