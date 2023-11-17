import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatComponent } from './components/chat/chat.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { UserService } from './services/user.service';
import { ConversationhistoryComponent } from './components/conversationhistory/conversationhistory.component';
import { ConversationService } from './services/conversation.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { RequestloggingComponent } from './components/requestlogging/requestlogging.component';
import { MaterialModule } from './material/material.module';
import { ThreadComponent } from './components/thread/thread.component';
import { CreateGroupDialogComponent } from './components/create-group-dialog/create-group-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { RemoveMembersBoxComponent } from './components/remove-members-box/remove-members-box.component';
import { UserAdminBoxComponent } from './components/user-admin-box/user-admin-box.component';
import { EditGroupNameComponent } from './components/edit-group-name/edit-group-name.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    ChatComponent,
    UserlistComponent,
    ConversationhistoryComponent,
    RequestloggingComponent,
    ThreadComponent,
    CreateGroupDialogComponent,
    RemoveMembersBoxComponent,
    UserAdminBoxComponent,
    EditGroupNameComponent,
   
   
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    CommonModule,
    MaterialModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule, 
    MatMenuModule 
  ],
  providers: [UserService,ConversationService,AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
