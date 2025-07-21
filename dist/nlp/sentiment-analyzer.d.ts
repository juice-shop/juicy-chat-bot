declare const SentimentAnalyzerBase: any;
declare const LangEn: any;
declare const Nlu: any;
interface SentimentSettings {
    [key: string]: any;
}
interface SentimentInput {
    utterance: string;
    locale: string;
    [key: string]: any;
}
interface SentimentResult {
    score: number;
    numWords: number;
    numHits: number;
    average: number;
    type: string;
    locale: string;
}
interface ProcessResult {
    sentiment: SentimentResult;
    [key: string]: any;
}
declare function createSentimentAnalyzer(settings?: SentimentSettings, container?: any): {
    process: any;
    container: any;
    getSentiment(utterance: string, locale?: string, settings?: SentimentSettings): Promise<SentimentResult>;
};
declare function SentimentAnalyzer(settings?: SentimentSettings, container?: any): {
    process: any;
    container: any;
    getSentiment(utterance: string, locale?: string, settings?: SentimentSettings): Promise<SentimentResult>;
};
