import { useUIStore } from '../store/useUIStore';
import { translations, Translations } from '../i18n';

/**
 * useTranslation - Motor de Localización Dinámica.
 * 
 * ¿Por qué un Hook personalizado?:
 * 1. Suscripción Reactiva: Al usar useUIStore, React se entera automáticamente cuando 
 *    el usuario cambia el idioma ('es' -> 'en'). Esto dispara un nuevo renderizado 
 *    con el diccionario correcto instantáneamente.
 * 2. Abstracción: Los componentes no necesitan saber CÓMO se gestionan los idiomas, 
 *    solo piden los textos y el hook se encarga del resto.
 * 3. Fall-back Seguro: Si por algún error el idioma activo no existe en el barrel, 
 *    devolvemos español por defecto (ES) para evitar que la App falle (crash).
 * 
 * @returns El diccionario de textos tipado (Translations) correspondiente al idioma activo.
 */
export const useTranslation = (): Translations => {
  // Obtenemos solo la clave del idioma del store global de UI.
  const language = useUIStore((state) => state.language);
  
  // Seleccionamos el diccionario del barrel de traducciones.
  return translations[language] || translations.es;
};
