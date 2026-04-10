import {ThemedView} from '@/components/themed';
import {usePathname, useRouter} from 'expo-router';
import React from 'react';

import {useTranslation} from '@/src/hooks/useTranslation';
import {useUIStore} from '@/src/store/useUIStore';
import {SIDEBAR_MENU_CONFIG} from '../constants/SidebarConfig';
import {SidebarFooter} from './SidebarFooter';
import {SidebarHeader} from './SidebarHeader';
import {SidebarItem} from './SidebarItem';

interface SidebarProps {
  width: number;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Sidebar - Orquestador visual del menú lateral de navegación.
 */
export const Sidebar = ({width, isOpen, onClose}: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const {home} = useTranslation();
  const {viewMode, setViewMode} = useUIStore();

  if (!isOpen) return null;

  /**
   * Mapea el labelKey definido en SidebarConfig a la traducción real.
   */
  const getLabelByItemKey = (key: string) => {
    switch (key) {
      case 'library':
        return home.library;
      case 'favorites':
        return home.favorites;
      case 'debugging':
        return home.debugging;
      case 'settings':
        return home.settings;
      default:
        return key;
    }
  };

  /**
   * Gestiona la acción de navegación o filtrado.
   */
  const handleNavigation = (id: string) => {
    onClose(); // Cerrar sidebar antes de navegar

    switch (id) {
      case 'library':
        setViewMode('all');
        if (pathname !== '/') router.push('/');
        break;
      case 'favorites':
        setViewMode('favorites');
        if (pathname !== '/') router.push('/');
        break;
      case 'debug':
        router.push('/debug');
        break;
      case 'settings':
        // Por implementar
        break;
    }
  };

  return (
    <ThemedView
      variant="card"
      style={{width}}
      className="h-full border-r border-light-border dark:border-dark-border px-6 py-8 justify-between"
    >
      <ThemedView variant="transparent">
        <SidebarHeader onClose={onClose} />

        {SIDEBAR_MENU_CONFIG.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={getLabelByItemKey(item.labelKey)}
            isActive={
              (item.id === 'library' && viewMode === 'all' && pathname === '/') ||
              (item.id === 'favorites' && viewMode === 'favorites' && pathname === '/') ||
              (item.id === 'debug' && pathname === '/telemetry-debug')
            }
            onPress={() => handleNavigation(item.id)}
          />
        ))}
      </ThemedView>

      <SidebarFooter />
    </ThemedView>
  );
};
