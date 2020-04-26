import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MembersComponent } from './members/members.component';
import { MemberLogComponent } from './member-log/member-log.component';
import { AppConfigService } from './_services'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MembersComponent,
    MemberLogComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: MemberLogComponent, pathMatch: 'full' },
      { path: 'members', component: MembersComponent },
      ])
    ],
  providers: [ {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }

    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
