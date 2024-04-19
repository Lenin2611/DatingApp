import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ListsComponent } from './pages/lists/lists.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { authGuard } from './guards/auth.guard';
import { MemberListComponent } from './pages/members/member-list/member-list.component';
import { MemberDetailComponent } from './pages/members/member-detail/member-detail.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { UnauthorizedComponent } from './errors/unauthorized/unauthorized.component';
import { MemberEditComponent } from './pages/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', runGuardsAndResolvers: 'always', canActivate: [authGuard], children: [
        { path: 'members', component: MemberListComponent },
        { path: 'members/:username', component: MemberDetailComponent },
        { path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard] },
        { path: 'lists', component: ListsComponent },
        { path: 'messages', component: MessagesComponent }
    ]},
    { path: 'not-found', component: NotFoundComponent },
    { path: 'server-error', component: ServerErrorComponent },
    { path: '**', component: NotFoundComponent, pathMatch: 'full' }
];
