import type { VM } from 'vm2';

interface Response {
    action: string;
    handler: string;
    body: string;
}

interface Training {
    state: boolean;
    data: unknown;
}

export class Bot {
    public factory: VM;
    public training: Training;

    constructor(name: string, greeting: string, trainingSet: string, defaultResponse: string);
    addUser(id: string, name: string): void;
    greet(id: string): string;
    respond(query: string, id: string): Promise<Response>;
    train(): unknown;
}
