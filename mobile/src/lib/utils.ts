import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

// TODO: Necesito information de esta utilidad cual es su uso y donde la estamos usando
/**
 * Utilidad para combinar clases de Tailwind CSS de forma segura,
 * resolviendo conflictos de especificidad.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
