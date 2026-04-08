import { es } from './es';
import { en } from './en';

/**
 * Barrel de Localización (i18n).
 * 
 * Centraliza los diccionarios para facilitar la escalabilidad y asegura 
 * un tipado estricto mediante la interfaz 'Translations' basada en el esquema base (ES).
 */
export const translations = {
  es,
  en,
};

export type { Translations } from './es';
