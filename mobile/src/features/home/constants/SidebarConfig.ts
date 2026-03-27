import {ComponentProps} from 'react';
import {ThemedIcon} from '@/components/themed';

export type SidebarMenuItem = {
  id: string;
  icon: ComponentProps<typeof ThemedIcon>['name'];
  label: string;
};

/**
 * SIDEBAR_MENU_CONFIG - Definición estática de la estructura de navegación.
 * Separar los datos de la implementación visual permite cambios de estructura
 * sin modificar la lógica de renderizado del Sidebar.
 */
export const SIDEBAR_MENU_CONFIG: SidebarMenuItem[] = [
  {id: 'library', icon: 'library-outline', label: 'Library'},
  {id: 'favs', icon: 'heart-outline', label: 'Favorites'},
  {id: 'debug', icon: 'bug-outline', label: 'Debugging'},
  {id: 'settings', icon: 'settings-outline', label: 'Settings'},
];
