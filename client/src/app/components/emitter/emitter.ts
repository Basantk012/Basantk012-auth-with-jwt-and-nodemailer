import { EventEmitter } from "@angular/core";

export class Emitter{
    static authenticatd : EventEmitter<boolean> = new EventEmitter();
}