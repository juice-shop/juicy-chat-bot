interface TrainingData {
    lang: string;
    data: QueryData[];
}
interface QueryData {
    intent: string;
    utterances: string[];
    answers: string[];
}
interface Training {
    state: boolean;
    data: TrainingData;
}
interface BotResponse {
    action: string;
    body: string;
    intent?: string;
    answer?: string;
    score?: number;
}
declare class Bot {
    private name;
    private greeting;
    private defaultResponse;
    training: Training;
    factory: any;
    constructor(name: string, greeting: string, trainingSet: TrainingData | string, defaultResponse: string);
    greet(token: string): string;
    addUser(token: string, name: string): void;
    getUser(token: string): string | undefined;
    private render;
    respond(query: string, token: string): Promise<BotResponse>;
    train(): Promise<void>;
}
export { Bot };
