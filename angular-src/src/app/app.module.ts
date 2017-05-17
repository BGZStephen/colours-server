import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { router } from "./app.routes"
import { FlashMessagesModule } from "angular2-flash-messages"

// modules
import { AppComponent } from './app.component';

// views
import { HomeViewComponent } from './views/views-barrel';

//components
import { SiteNavbarComponent, SiteIntroComponent, SiteRegisterComponent, SiteLoginComponent} from './components/components-barrel';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    SiteNavbarComponent,
    SiteIntroComponent,
    SiteRegisterComponent,
    SiteLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    router,
    FlashMessagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
