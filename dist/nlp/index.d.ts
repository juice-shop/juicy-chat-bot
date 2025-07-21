declare const fs: any;
declare const containerBootstrap: any;
declare const Language: any;
declare const Nlp: any;
declare const Evaluator: any, Template: any;
declare const requestfs: any;
declare const SentimentManager: any;
type Action = {
    name: string;
    parameters?: Record<string, any>;
    fn?: (...args: any[]) => any;
};
declare class NlpManager {
    settings: any;
    container: any;
    nlp: any;
    sentimentManager: any;
    constructor(settings?: any);
    addDocument(locale: string, utterance: string, intent: string): void;
    removeDocument(locale: string, utterance: string, intent: string): void;
    addLanguage(locale: string): string[];
    assignDomain(locale: string, intent: string, domain: string): void;
    getIntentDomain(locale: string, intent: string): string | undefined;
    getDomains(): any;
    guessLanguage(text: string): string;
    addAction(intent: string, action: string, parameters: Record<string, any>, fn?: (...args: any[]) => any): any;
    getActions(intent: string): Action[];
    removeAction(intent: string, action: string, parameters: Record<string, any>): any;
    removeActions(intent: string): Action[];
    addAnswer(locale: string, intent: string, answer: string, opts?: Record<string, any>): any;
    removeAnswer(locale: string, intent: string, answer: string, opts?: Record<string, any>): any;
    findAllAnswers(locale: string, intent: string): string[];
    getSentiment(locale: string, utterance: string): Promise<any>;
    addNamedEntityText(entityName: string, optionName: string, languages: string[] | string, texts: string[] | string): any;
    removeNamedEntityText(entityName: string, optionName: string, languages: string[] | string, texts: string[] | string): any;
    addRegexEntity(entityName: string, languages: string[] | string, regex: RegExp | string): any;
    addBetweenCondition(locale: string, name: string, left: string[] | string, right: string[] | string, opts?: Record<string, any>): any;
    addPositionCondition(locale: string, name: string, position: number, words: string[] | string, opts?: Record<string, any>): any;
    addAfterCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    addAfterFirstCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    addAfterLastCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    addBeforeCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    addBeforeFirstCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    addBeforeLastCondition(locale: string, name: string, words: string[] | string, opts?: Record<string, any>): any;
    describeLanguage(locale: string, name: string): any;
    beginEdit(): void;
    train(): any;
    classify(locale: string, utterance: string, settings?: Record<string, any>): any;
    process(locale: string, utterance: string, context?: any, settings?: any): Promise<any>;
    extractEntities(locale: string, utterance: string, context?: any, settings?: any): any;
    toObj(): any;
    fromObj(obj: any): any;
    /**
     * Export NLP manager information as a string.
     * @param {Boolean} minified If true, the returned JSON will have no spacing or indentation.
     * @returns {String} NLP manager information as a JSON string.
     */
    export(minified?: boolean): string;
    /**
     * Load NLP manager information from a string.
     * @param {String|Object} data JSON string or object to load NLP manager information from.
     */
    import(data: string | object): void;
    /**
     * Save the NLP manager information into a file.
     * @param {String} srcFileName Filename for saving the NLP manager.
     */
    save(srcFileName?: string, minified?: boolean): void;
    /**
     * Load the NLP manager information from a file.
     * @param {String} srcFilename Filename for loading the NLP manager.
     */
    load(srcFileName?: string): void;
}
