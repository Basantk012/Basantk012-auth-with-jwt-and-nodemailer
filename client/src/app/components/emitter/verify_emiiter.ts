import { EventEmitter } from "@angular/core";

export class VerifyEmitter{
    static isVerified : EventEmitter<boolean> = new EventEmitter();
}