import { Injectable } from '@angular/core';

@Injectable()
export class ArrayService {

  constructor() { }
  average(arr) {
    const arrLength = arr.length;
    let sum = 0;
    for (let i = 0; i < arrLength; i += 1) {
      sum += arr[i];
    }

    return sum / arrLength;
  }

}
