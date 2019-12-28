import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@NgModule({
    imports: [CommonModule, FontAwesomeModule],
    exports: [FontAwesomeModule],
})
export class SharedModule {
    constructor() {
        library.add(faGithub);
    }
}
