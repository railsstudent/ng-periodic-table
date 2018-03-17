import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SelectionBarComponent } from './selection-bar/selection-bar.component';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { AtomComponent } from './atom/atom.component';


@NgModule({
  declarations: [
    AppComponent,
    SelectionBarComponent,
    PeriodicTableComponent,
    AtomComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
