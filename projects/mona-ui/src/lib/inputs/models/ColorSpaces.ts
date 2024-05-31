import { WritableSignal } from "@angular/core";

export interface RGB {
    r: number | null;
    g: number | null;
    b: number | null;
}

export interface RGBA extends RGB {
    a: number | null;
}

export interface RGBSignal {
    r: WritableSignal<number | null>;
    g: WritableSignal<number | null>;
    b: WritableSignal<number | null>;
}

export interface HSV {
    h: number | null;
    s: number | null;
    v: number | null;
}

export interface HSVA extends HSV {
    a: number | null;
}

export interface HSVSignal {
    h: WritableSignal<number | null>;
    s: WritableSignal<number | null>;
    v: WritableSignal<number | null>;
}

export type Channel = keyof RGBA | keyof HSV;

export interface HSL {
    h: number | null;
    s: number | null;
    l: number | null;
}

export interface HSLA extends HSL {
    a: number | null;
}
