import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGridEditDoneEventArgs, IGX_GRID_ACTION_STRIP_DIRECTIVES, IGX_GRID_DIRECTIVES, IRowDataEventArgs } from '@infragistics/igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { ToyModel } from '../models/my-api/toy-model';
import { MyAPIService } from '../services/my-api.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [IGX_GRID_ACTION_STRIP_DIRECTIVES, IGX_GRID_DIRECTIVES],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public myAPIToyModel: ToyModel[] = [];

  constructor(
    private myAPIService: MyAPIService,
  ) {}

  ngOnInit() {
    this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.myAPIToyModel = data
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public apiToysCreateToyRowAdded(args: IRowDataEventArgs) {
    this.myAPIService.postToyModel(args.rowData).pipe(takeUntil(this.destroy$)).subscribe(
      _ => this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(data => this.myAPIToyModel = data)
    );
  }

  public apiToysDeleteToyByIdRowDeleted(args: IRowDataEventArgs) {
    this.myAPIService.deleteToyModel(args.rowKey).pipe(takeUntil(this.destroy$)).subscribe(
      _ => this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(data => this.myAPIToyModel = data)
    );
  }

  public apiToysUpdateToyRowEditDone(args: IGridEditDoneEventArgs) {
    if(args.isAddRow == false) {
      this.myAPIService.putToyModel(args.rowData).pipe(takeUntil(this.destroy$)).subscribe(
        _ => this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(data => this.myAPIToyModel = data)
      );
    }
  }
}
