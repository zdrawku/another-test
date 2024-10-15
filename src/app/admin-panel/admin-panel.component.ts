import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IGridEditDoneEventArgs, IGX_GRID_ACTION_STRIP_DIRECTIVES, IGX_GRID_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IGX_SELECT_DIRECTIVES, IgxRadioComponent, IgxRadioGroupDirective, IRowDataEventArgs } from 'igniteui-angular';
import { Subject, takeUntil } from 'rxjs';
import { ToyModel } from '../models/my-api/toy-model';
import { CategoryModel } from '../models/ng-conf-toy-store-api/category-model';
import { NgConfToyStoreAPIService } from '../services/ng-conf-toy-store-api.service';
import { MyAPIService } from '../services/my-api.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [IGX_GRID_ACTION_STRIP_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IGX_SELECT_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxRadioGroupDirective, IgxRadioComponent, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  public myAPIToyModel: ToyModel[] = [];
  public selectVisible: boolean = false;
  public ngConfToyStoreAPICategoryModel: CategoryModel[] = [];

  constructor(
    private myAPIService: MyAPIService,
    private ngConfToyStoreAPIService: NgConfToyStoreAPIService,
  ) {}

  ngOnInit() {
    this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.myAPIToyModel = data
    );
    this.ngConfToyStoreAPIService.getCategoryModelList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.ngConfToyStoreAPICategoryModel = data
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

  public apiToysUpdateToyRowEditDone(args: IGridEditDoneEventArgs) {
    if(args.isAddRow == false) {
      this.myAPIService.putToyModel(args.rowData).pipe(takeUntil(this.destroy$)).subscribe(
        _ => this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(data => this.myAPIToyModel = data)
      );
    }
  }

  public apiToysDeleteToyByIdRowDeleted(args: IRowDataEventArgs) {
    this.myAPIService.deleteToyModel(args.rowKey).pipe(takeUntil(this.destroy$)).subscribe(
      _ => this.myAPIService.getToyModelList1().pipe(takeUntil(this.destroy$)).subscribe(data => this.myAPIToyModel = data)
    );
  }
}
