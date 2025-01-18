import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'find',
  standalone: true,
})
export class FindPipe implements PipeTransform {
  /**
   * Transforms an array by finding an object that matches a specific condition.
   *
   * @param value - The array to search.
   * @param property - The property to match against.
   * @param matchValue - The value to match.
   * @returns The first matching object or `null` if not found.
   */
  transform<T>(value: T[], property: keyof T, matchValue: unknown): T | null {
    if (!Array.isArray(value) || !property) {
      return null;
    }
    return value.find((item) => item[property] === matchValue) || null;
  }
}
