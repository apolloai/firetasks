import { groupBy, mapValues } from 'lodash';
import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, doc, setDoc, deleteDoc } from '@angular/fire/firestore';
import { Task, TaskModel, TaskStatus } from '@firetasks/models';
import { map } from 'rxjs/operators';

export interface TasksGrouped {
  [key: string]: TaskList;
}
export interface TaskList {
  label: string;
  status: string;
  order: number;
  tasks: TaskModel[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: Firestore) {}

  readonly taskLists$ = collectionData(collection(this.firestore, 'tasks')).pipe(
    map((data) => data.map((item) => TaskModel.fromFirestore(item))),
    map((tasks) => groupBy(tasks, 'status')),
    map((tasksByStatus) => mapValues(tasksByStatus, (tasks, status) => ({
      ...this.getStatusInfo(status),
      tasks,
    })) as TasksGrouped),
    map((tasksGrouped) => Object.values(tasksGrouped).sort((a, b) => a.order - b.order)),
  );


  save(task: Task) {
    let taskRef = task.id ? doc(this.firestore, `tasks/${task.id}`) : doc(collection(this.firestore, 'tasks'));
    task.id = task.id || taskRef.id;
    return setDoc(taskRef, task.toFirestore());
  }

  delete(task: Task) {
    return deleteDoc(doc(this.firestore, `tasks/${task.id}`));
  }

  private getStatusInfo(statusEnum: string) {
    switch (statusEnum) {
      case TaskStatus.TODO:
        return {label: 'To do', order: 0, status: statusEnum};
      case TaskStatus.IN_PROGRESS:
        return {label: 'In progress', order: 1, status: statusEnum};
      case TaskStatus.DONE:
        return {label: 'Done', order: 2, status: statusEnum};
      default:
        return null;
    }
  }
}
