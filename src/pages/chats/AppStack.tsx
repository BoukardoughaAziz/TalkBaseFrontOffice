import { isEqual } from "lodash";

export default class AppStack<T> {  
  
    private items: T[] = [];
   
     private isEqual(a: object, b: object): boolean {
        return isEqual(a, b) // Deep equality comparison for objects
      }
    push(element: T): void {
      this.items.push(element);
    }
  
    pop(): T | undefined {
      return this.items.pop();
    }
  
    peek(): T | undefined {
      return this.items[this.items.length - 1];
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    size(): number {
      return this.items.length;
    }
  
    clear(): void {
      this.items = [];
    }
  
    getItems(): T[] {
      return [...this.items].reverse(); // Return a copy of the items to prevent direct modification
    }
  }
  