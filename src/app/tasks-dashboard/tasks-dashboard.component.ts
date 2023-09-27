import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Task, TaskModel, TaskStatus } from '@firetasks/models';

import { TaskService, TaskList } from '../services/task.service';
import { TaskDialogComponent } from './task-dialog.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss']
})
export class TasksDashboardComponent implements OnInit {
  taskLists$?: Observable<TaskList[]>;
  user?: { uid: string, displayName?: string };

  constructor(
    private dialog: MatDialog,
    private auth: AngularFireAuth,
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.auth.currentUser.then(user => this.user = user as any);
    this.taskLists$ = this.taskService.taskLists$;
  }

  async addNewTask(status: string) {
    this.dialog.open(TaskDialogComponent, {
      width: '450px',
      height: '600px',
      data: {
        task: new TaskModel({
          status: status as TaskStatus,
          owner: {
            id: this.user!.uid,
            name: this.user!.displayName!,
          },
        }),
        userId: this.user?.uid,
      },
    });
  }

  async showTaskDetail(task: Task) {
    // console.log('showTaskDetail', task);
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      height: '600px',
      data: {
        task,
        userId: this.user?.uid,
      },
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed', result);
    // });
  }
}
