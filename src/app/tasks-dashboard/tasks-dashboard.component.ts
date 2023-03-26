import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Task, TaskModel, TaskStatus } from '@firetasks/models';

import { TaskService, TaskList } from '../services/task.service';
import { TaskDialogComponent } from './task-dialog.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-tasks-dashboard',
  templateUrl: './tasks-dashboard.component.html',
  styleUrls: ['./tasks-dashboard.component.scss']
})
export class TasksDashboardComponent implements OnInit {

  taskLists$?: Observable<TaskList[]>;
  user?: { uid: string, displayName?: string };
  loading = false; // can be used to show a spinner in the future

  constructor(
    private dialog: MatDialog,
    private auth: AngularFireAuth,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.auth.currentUser.then(user => this.user = user as any);
    this.taskLists$ = this.taskService.subscribeToTasks();
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

  /**
   * Drag and Drop Task Functions
   * * drag & drop for tasks between status list on the task dashboard to update their status
   * * * all signed-in users should be allowed to change/move a task to another status list
   * * * the position within a list is irrelevant and does not need to be persisted
   */

  drop(event: CdkDragDrop<Task[]>, listStatus: string) {

    if (event.previousContainer === event.container) {
      // handles the sorting within the same list
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // handles the transfer of the item to another list with respect to the new index
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // save the new status of the task
      const task = event.container.data[event.currentIndex];
      task.status = listStatus as TaskStatus;
      this.save(task);
    }
  }

  save(task: Task) {
    this.loading = true;
    task.updatedAt = new Date();
    this.taskService.save(task).finally(() => {
      this.loading = false;
    }).catch(console.error);
  }



}
