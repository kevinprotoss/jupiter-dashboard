import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { StrategyRoutingModule } from './strategy-routing.module';

const COMPONENTS = [];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    StrategyRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class StrategyModule { }
