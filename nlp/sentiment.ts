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

import SentimentAnalyzer from './sentiment-analyzer'

type SentimentManagerSettings = Record<string, any>

/**
 * Class for the sentiment anlysis manager, able to manage
 * several different languages at the same time.
 */
export interface SentimentResult {
  score: number
  average: number
  numWords: number
  numHits: number
  type: string
  locale: string
}

interface TranslatedSentiment {
  score: number
  comparative: number
  vote: 'positive' | 'negative' | 'neutral'
  numWords: number
  numHits: number
  type: string
  language: string
}

/**
 * Class for the sentiment anlysis manager, able to manage
 * several different languages at the same time.
 */
class SentimentManager {
  settings: SentimentManagerSettings
  languages: Record<string, any>
  analyzer: SentimentAnalyzer

  /**
   * Constructor of the class.
   */
  constructor (settings?: SentimentManagerSettings) {
    this.settings = settings ?? {}
    this.languages = {}
    this.analyzer = new SentimentAnalyzer()
  }

  addLanguage (): void {
  }

  translate (sentiment: SentimentResult): TranslatedSentiment {
    let vote: 'positive' | 'negative' | 'neutral'
    if (sentiment.score > 0) {
      vote = 'positive'
    } else if (sentiment.score < 0) {
      vote = 'negative'
    } else {
      vote = 'neutral'
    }
    return {
      score: sentiment.score,
      comparative: sentiment.average,
      vote,
      numWords: sentiment.numWords,
      numHits: sentiment.numHits,
      type: sentiment.type,
      language: sentiment.locale
    }
  }

  async process (
    locale: string,
    phrase: string
  ): Promise<TranslatedSentiment> {
    const sentiment = await this.analyzer.getSentiment(
      phrase,
      locale,
      this.settings
    )
    return this.translate(sentiment as SentimentResult)
  }
}

export default SentimentManager
