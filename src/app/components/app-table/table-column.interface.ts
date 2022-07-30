import {TemplateRef} from '@angular/core';

export interface TableColumn<T> {
  label: string;
  property: string | number | symbol;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'renderer' |'actions';
  visible?: boolean;
  cssClasses?: string[];
  template?: TemplateRef<any>;
}
