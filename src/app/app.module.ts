import { BrowserModule, Title } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { SelectionBarComponent } from "./selection-bar/selection-bar.component";
import { PeriodicTableComponent } from "./periodic-table/periodic-table.component";
import { AtomComponent } from "./atom/atom.component";
import { AtomDetailsComponent } from "./atom-details/atom-details.component";

@NgModule({
  declarations: [
    AppComponent,
    SelectionBarComponent,
    PeriodicTableComponent,
    AtomComponent,
    AtomDetailsComponent
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [Title],
  bootstrap: [AppComponent]
})
export class AppModule {}
