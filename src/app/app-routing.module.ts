import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { UserlistComponent } from './components/userlist/userlist.component';
import { ConversationhistoryComponent } from './components/conversationhistory/conversationhistory.component';
import { RequestloggingComponent } from './components/requestlogging/requestlogging.component';
import { LogService } from './services/log.service';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'registration', component: RegistrationComponent},
  {path: 'chat', component: ChatComponent, children:[
    { path: '', component: UserlistComponent },
    {path: 'user/:userId', component: ConversationhistoryComponent}
  ] },
  
  {path: 'requestlogging', component: RequestloggingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
