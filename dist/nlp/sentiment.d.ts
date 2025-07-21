/**
 * Class for the sentiment anlysis manager, able to manage
 * several different languages at the same time.
 */
declare class SentimentManager {
    /**
     * Constructor of the class.
     */
    settings: Record<string, unknown>;
    languages: Record<string, unknown>;
    analyzer: any;
    constructor(settings?: Record<string, unknown>);
    addLanguage(): void;
    translate(sentiment: SentimentInput): SentimentOutput;
    /**
     * Process a phrase of a given locale, calculating the sentiment analysis.
     * @param {String} locale Locale of the phrase.
     * @param {String} phrase Phrase to calculate the sentiment.
     * @returns {Promise.Object} Promise sentiment analysis of the phrase.
     */
    process(locale: string, phrase: string): Promise<SentimentOutput>;
}
interface SentimentInput {
    score: number;
    average: number;
    numWords: number;
    numHits: number;
    type: string;
    locale: string;
}
interface SentimentOutput {
    score: number;
    comparative: number;
    vote: 'positive' | 'negative' | 'neutral';
    numWords: number;
    numHits: number;
    type: string;
    language: string;
}
export = SentimentManager;
