import {ComponentProps} from 'react';
import {ThemedIcon} from '@/components/themed';

/**
 * SidebarMenuItem - Representa un nodo de navegación en el menú lateral.
 * El campo 'labelKey' permite referenciar claves dinámicas en el diccionario de traducción (i18n).
 */
export type SidebarMenuItem = {
  id: string;
  icon: ComponentProps<typeof ThemedIcon>['name'];
  labelKey: 'library' | 'favorites' | 'debugging' | 'settings';
};

/**
 * SIDEBAR_MENU_CONFIG - Definición estructural del menú lateral.
 * Centraliza la definición de iconos e identificadores, delegando la visualización 
 * de texto al motor de localización.
 */
export const SIDEBAR_MENU_CONFIG: SidebarMenuItem[] = [
  {id: 'library', icon: 'library-outline', labelKey: 'library'},
  {id: 'favorites', icon: 'heart-outline', labelKey: 'favorites'},
  {id: 'debug', icon: 'bug-outline', labelKey: 'debugging'},
  {id: 'settings', icon: 'settings-outline', labelKey: 'settings'},
];
