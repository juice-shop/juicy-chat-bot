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

import { LangEn } from '@nlpjs/lang-en'
import {Nlu} from '@nlpjs/nlu'
import { SentimentAnalyzer as SentimentAnalyzerBase } from '@nlpjs/sentiment';

interface SentimentAnalyzerSettings {
  [key: string]: any;
}

interface Container {
  use: (module: any) => void;
  [key: string]: any;
}

interface GetSentimentSettings {
  [key: string]: any;
}

interface GetSentimentInput {
  utterance: string;
  locale: string;
  [key: string]: any;
}

interface SentimentResult {
  sentiment: any;
  [key: string]: any;
}

class SentimentAnalyzer extends SentimentAnalyzerBase {
  constructor (
    settings: SentimentAnalyzerSettings = {},
    container?: Container
  ) {
    super(settings, container)
    this.container.use(LangEn)
    this.container.use(Nlu)
  }

  async getSentiment(
    utterance: string,
    locale: string = 'en',
    settings: GetSentimentSettings = {}
  ): Promise<any> {
    const input: GetSentimentInput = {
      utterance,
      locale,
      ...settings
    };
    const result: SentimentResult = await this.process(input);
    return result.sentiment;
  }
}

export default SentimentAnalyzer
