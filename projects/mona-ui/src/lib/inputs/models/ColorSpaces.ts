import { WritableSignal } from "@angular/core";

export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBA extends RGB {
    a: number;
}

export interface RGBSignal {
    r: WritableSignal<number>;
    g: WritableSignal<number>;
    b: WritableSignal<number>;
}

export interface HSV {
    h: number;
    s: number;
    v: number;
}

export interface HSVSignal {
    h: WritableSignal<number>;
    s: WritableSignal<number>;
    v: WritableSignal<number>;
}

export type Channel = keyof RGBA | keyof HSV;
