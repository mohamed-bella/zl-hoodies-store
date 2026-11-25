declare module 'node:sqlite' {
  export class StatementSync {
    run(...params: (string|number|null|Uint8Array)[]): {changes:number|bigint;lastInsertRowid:number|bigint};
    get(...params: (string|number|null|Uint8Array)[]): Record<string,unknown>|undefined;
    all(...params: (string|number|null|Uint8Array)[]): Record<string,unknown>[];
  }
  export class DatabaseSync {
    constructor(path:string);
    exec(sql:string):void;
    prepare(sql:string):StatementSync;
    close():void;
  }
}
