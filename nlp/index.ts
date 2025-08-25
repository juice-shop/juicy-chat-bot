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

import fs from 'fs'
import {containerBootstrap} from '@nlpjs/core-loader'
import {Language} from '@nlpjs/language'
import {LangEn} from '@nlpjs/lang-en'
import {Nlp} from '@nlpjs/nlp'
import {Evaluator, Template} from '@nlpjs/evaluator'
import { fs as requestfs } from '@nlpjs/request'
import SentimentManager from './sentiment'

interface ActionParameters {
  [key: string]: any;
}

type ActionFunction = (...args: any[]) => any;

class NlpManager {
  settings: any;
  container: any;
  nlp: any;
  sentimentManager: SentimentManager;
  constructor (settings = {}) {
    this.settings = settings
    if (!this.settings.container) {
      this.settings.container = containerBootstrap()
    }
    this.container = this.settings.container
    this.container.registerConfiguration('ner', {
      entityPreffix: '%',
      entitySuffix: '%'
    })
    this.container.register('fs', requestfs)
    this.container.register('Language', Language, false)
    this.container.use(LangEn)
    this.container.use(Evaluator)
    this.container.use(Template)
    this.nlp = new Nlp(this.settings)
    this.sentimentManager = new SentimentManager()
  }

  addDocument(locale: string, utterance: string, intent: string): void {
    return this.nlp.addDocument(locale, utterance, intent)
  }

  removeDocument(locale: string, utterance: string, intent: string): void {
    return this.nlp.removeDocument(locale, utterance, intent)
  }

  addLanguage(locale: string): void {
    return this.nlp.addLanguage(locale)
  }

  assignDomain(locale: string, intent: string, domain: string): void {
    return this.nlp.assignDomain(locale, intent, domain)
  }

  getIntentDomain(locale: string, intent: string): string | undefined {
    return this.nlp.getIntentDomain(locale, intent)
  }

  getDomains () {
    return this.nlp.getDomains()
  }

  guessLanguage (text: string): string {
    return this.nlp.guessLanguage(text)
  }

  addAction(
    intent: string,
    action: string,
    parameters: ActionParameters,
    fn?: ActionFunction
  ): any {
    if (!fn) {
      fn = this.settings.action ? this.settings.action[action] : undefined;
    }
    return this.nlp.addAction(intent, action, parameters, fn);
  }

  getActions(intent: string): Array<{ action: string; parameters: ActionParameters; fn?: ActionFunction }> {
    return this.nlp.getActions(intent)
  }

  removeAction (
    intent: string,
    action: string,
    parameters: ActionParameters
  ): any {
    return this.nlp.removeAction(intent, action, parameters)
  }

  removeActions(intent: string): Array<{ action: string; parameters: ActionParameters; fn?: ActionFunction }> {
    return this.nlp.removeActions(intent)
  }

  addAnswer(
    locale: string,
    intent: string,
    answer: string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addAnswer(locale, intent, answer, opts);
  }

  removeAnswer(
    locale: string,
    intent: string,
    answer: string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.removeAnswer(locale, intent, answer, opts);
  }

  findAllAnswers(locale: string, intent: string): string[] {
    return this.nlp.findAllAnswers(locale, intent);
  }

  async getSentiment(locale: string, utterance: string): Promise<any> {
    const sentiment: { sentiment: any } = await this.nlp.getSentiment(
      locale,
      utterance
    );
    return this.sentimentManager.translate(sentiment.sentiment);
  }

  addNamedEntityText(
    entityName: string,
    optionName: string,
    languages: string[] | string,
    texts: string[] | string
  ): any {
    return this.nlp.addNerRuleOptionTexts(
      languages,
      entityName,
      optionName,
      texts
    );
  }

  removeNamedEntityText(
    entityName: string,
    optionName: string,
    languages: string[] | string,
    texts: string[] | string
  ): any {
    return this.nlp.removeNerRuleOptionTexts(
      languages,
      entityName,
      optionName,
      texts
    );
  }

  addRegexEntity(
    entityName: string,
    languages: string[] | string,
    regex: RegExp | string
  ): any {
    return this.nlp.addNerRegexRule(languages, entityName, regex);
  }

  addBetweenCondition(
    locale: string,
    name: string,
    left: string[] | string,
    right: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerBetweenCondition(locale, name, left, right, opts);
  }

  addPositionCondition(
    locale: string,
    name: string,
    position: number,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerPositionCondition(
      locale,
      name,
      position,
      words,
      opts
    );
  }

  addAfterCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerAfterCondition(locale, name, words, opts);
  }

  addAfterFirstCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerAfterFirstCondition(locale, name, words, opts);
  }

  addAfterLastCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerAfterLastCondition(locale, name, words, opts);
  }

  addBeforeCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerBeforeCondition(locale, name, words, opts);
  }

  addBeforeFirstCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerBeforeFirstCondition(locale, name, words, opts);
  }

  addBeforeLastCondition(
    locale: string,
    name: string,
    words: string[] | string,
    opts?: Record<string, any>
  ): any {
    return this.nlp.addNerBeforeLastCondition(locale, name, words, opts);
  }

  describeLanguage(locale: string, name: string): any {
    return this.nlp.describeLanguage(locale, name);
  }

  beginEdit(): void {}

  train(): any {
    return this.nlp.train();
  }

  classify(
    locale: string,
    utterance: string,
    settings?: Record<string, any>
  ): any {
    return this.nlp.classify(locale, utterance, settings);
  }

  async process(
    locale: string,
    utterance: string,
    context?: any,
    settings?: any
  ): Promise<any> {
    const result = await this.nlp.process(locale, utterance, context, settings);
    if (this.settings.processTransformer) {
      return this.settings.processTransformer(result);
    }
    return result;
  }

  extractEntities(
    locale: string,
    utterance: string,
    context?: any,
    settings?: any
  ): any {
    return this.nlp.extractEntities(locale, utterance, context, settings);
  }

  toObj(): any {
    return this.nlp.toJSON();
  }

  fromObj(obj: any): any {
    return this.nlp.fromJSON(obj);
  }

  /**
   * Export NLP manager information as a string.
   * @param {Boolean} minified If true, the returned JSON will have no spacing or indentation.
   * @returns {String} NLP manager information as a JSON string.
   */
  export(minified = false): string {
    const clone = this.toObj();
    return minified ? JSON.stringify(clone) : JSON.stringify(clone, null, 2);
  }

  /**
   * Load NLP manager information from a string.
   * @param {String|Object} data JSON string or object to load NLP manager information from.
   */
  import(data: string | object): void {
    const clone = typeof data === "string" ? JSON.parse(data) : data;
    this.fromObj(clone);
  }

  /**
   * Save the NLP manager information into a file.
   * @param {String} srcFileName Filename for saving the NLP manager.
   */
  save(srcFileName?: string, minified = false): void {
    const fileName = srcFileName || "model.nlp";
    fs.writeFileSync(fileName, this.export(minified), "utf8");
  }

  /**
   * Load the NLP manager information from a file.
   * @param {String} srcFilename Filename for loading the NLP manager.
   */
  load(srcFileName?: string): void {
    const fileName = srcFileName || "model.nlp";
    const data = fs.readFileSync(fileName, "utf8");
    this.import(data);
  }
}

export default NlpManager

