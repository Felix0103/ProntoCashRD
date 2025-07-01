import { Injectable } from '@angular/core';
import { Language } from '../interfaces/language.interface';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages: Array<Language> = new Array<Language>();

  constructor() {
    this.languages.push(
      { name: 'English', code: 'en', id: 1 },
      { name: 'Español', code: 'es', id: 2 },
     );
  }
  getLanguages() {
    return this.languages;
  }

}
