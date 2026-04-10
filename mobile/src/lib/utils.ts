import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * cn (Class Name) - Utilidad estándar para la gestión de estilos dinámicos.
 * 
 * PROPÓSITO:
 * 1. Combina múltiples clases de Tailwind/NativeWind condicionales (vía clsx).
 * 2. Resuelve conflictos de especificidad (vía tailwind-merge), asegurando que 
 *    la última clase definida sea la que prevalezca.
 * 
 * USO:
 * Se utiliza en todos los componentes de la carpeta @themed y features para 
 * inyectar estilos personalizados sin romper los estilos base del componente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
