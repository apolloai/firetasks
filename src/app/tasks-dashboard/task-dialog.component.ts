import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, TaskStatus } from '@firetasks/models';
import { TaskService } from '../services/task.service';

export interface DialogData {
  task: Task;
  userId?: string;
}

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent {

  isLoading = false;
  task: Task = this.data.task;
  readonly taskForm = inject(FormBuilder).nonNullable.group({
    title: [this.task.title || '', Validators.required],
    status: [this.task.status || TaskStatus.TODO, Validators.required],
  });

  get isOwner() {
    return this.data.userId && this.data.userId === this.task.owner.id;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private taskService: TaskService,
  ) { }

  save() {
    this.isLoading = true;
    this.task = this.task.copyWith({
      ...this.taskForm.value,
      updatedAt: new Date(),
    });

    this.taskService.save(this.task).finally(() => {
      this.isLoading = false;
    }).catch(console.error);
  }

  cancel() {
    this.taskForm.reset();
  }

  delete() {
    this.isLoading = true;
    this.taskService.delete(this.task).finally(() => {
      this.isLoading = false;
      this.dialogRef.close();
    }).catch(console.error);
  }
}
