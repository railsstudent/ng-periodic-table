import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppPhaseComponent } from './app-phase/app-phase.component';
import { AppWikiComponent } from './app-wiki/app-wiki.component';
import { AppComponent } from './app.component';
import { AtomDetailsComponent } from './atom-details/atom-details.component';
import { AtomComponent } from './atom/atom.component';
import { FooterComponent } from './footer/footer.component';
import { PeriodicTableComponent } from './periodic-table/periodic-table.component';
import { SelectionBarComponent } from './selection-bar/selection-bar.component';

@NgModule({
    declarations: [
        AppComponent,
        SelectionBarComponent,
        PeriodicTableComponent,
        AtomComponent,
        AtomDetailsComponent,
        FooterComponent,
        AppPhaseComponent,
        AppWikiComponent,
    ],
    imports: [BrowserModule, HttpClientModule],
    providers: [Title],
    bootstrap: [AppComponent],
})
export class AppModule {}
