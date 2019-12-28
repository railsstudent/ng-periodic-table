import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngular, faGithub } from '@fortawesome/free-brands-svg-icons';

@NgModule({
    imports: [CommonModule, FontAwesomeModule],
    exports: [FontAwesomeModule],
})
export class SharedModule {
    constructor(library: FaIconLibrary) {
        library.addIcons(faGithub, faAngular);
    }
}
