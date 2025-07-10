import {Pipe, PipeTransform} from '@angular/core';
import {formatDistanceToNow} from 'date-fns';

@Pipe({name: 'relativeTime'})
export class RelativeTimePipe implements PipeTransform {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(value: any, args?: any): any {
    return formatDistanceToNow(new Date(value * 1000), {addSuffix: true});
  }

}
