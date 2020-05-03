import {Pipe, PipeTransform} from '@angular/core';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return formatDistanceToNow(new Date(value * 1000), {addSuffix: true});
  }

}
