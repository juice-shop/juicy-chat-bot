/*
 * Copyright (c) AXA Group Operations Spain S.A.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { SentimentAnalyzer: SentimentAnalyzerBase } = require('@nlpjs/sentiment');
const { LangEn } = require('@nlpjs/lang-en');
const { Nlu } = require('@nlpjs/nlu');

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

// Use composition instead of inheritance to avoid VM2 issues
function createSentimentAnalyzer(settings: SentimentSettings = {}, container?: any) {
  const baseAnalyzer = new SentimentAnalyzerBase(settings, container);
  
  // Add the required plugins
  baseAnalyzer.container.use(LangEn);
  baseAnalyzer.container.use(Nlu);
  
  return {
    // Expose the base analyzer methods
    process: baseAnalyzer.process.bind(baseAnalyzer),
    container: baseAnalyzer.container,
    
    // Add our custom method
    async getSentiment(
      utterance: string,
      locale: string = 'en',
      settings: SentimentSettings = {}
    ): Promise<SentimentResult> {
      const input: SentimentInput = {
        utterance,
        locale,
        ...settings
      };
      
      const result: ProcessResult = await baseAnalyzer.process(input);
      return result.sentiment;
    }
  };
}

// Create a constructor-like function that works with or without 'new'
function SentimentAnalyzer(settings?: SentimentSettings, container?: any) {
  // Always return a new instance regardless of how it's called
  return createSentimentAnalyzer(settings, container);
}

module.exports = SentimentAnalyzer;