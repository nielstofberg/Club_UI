import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MembersComponent } from './members/members.component';
import { MemberLogComponent } from './member-log/member-log.component';
import { AppConfigService } from './_services'
import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { FingerprintComponent } from './fingerprint/fingerprint.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MembersComponent,
    MemberLogComponent,
    FingerprintComponent,
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
      { path: 'fingerprint', component: FingerprintComponent },
      ])
    ],
  providers: [ 
    { 
      provide: APP_INITIALIZER, multi: true, deps: [AppConfigService], 
        useFactory: (appConfigService: AppConfigService) => {
          return () => {
          //Make sure to return a promise!
            return appConfigService.loadAppConfig();
          };
        }
    },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    //{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
