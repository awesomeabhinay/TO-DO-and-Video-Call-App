import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthServiceService } from './auth/auth-service.service';
import { AuthGuard } from './auth/auth-guard.service';
import { TodoComponent } from './todo/todo.component';
import { AccountsComponent } from './accounts/accounts.component';
import { TodoService } from './todo/todo.service';
import { AccountsService } from './accounts/accounts.service';
import { GalleryComponent } from './home/gallery/gallery.component';
import { HomePageService } from './home/home-page.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    TodoComponent,
    AccountsComponent,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatCheckboxModule,
    CommonModule
  ],
  providers: [AuthServiceService, AuthGuard, TodoService, AccountsService, HomePageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
