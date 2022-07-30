import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToolbarService {
  public createSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
