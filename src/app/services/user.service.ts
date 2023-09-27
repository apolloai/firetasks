import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { User } from '@firetasks/models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  readonly users$ = collectionData(collection(this.firestore, 'users')).pipe(
    map((data) => data.map((item) => item as User)),
  );
}
