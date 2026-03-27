import {ThemedView} from '@/components/themed';
import React from 'react';
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
 * Sidebar - Orquestador visual del menú lateral.
 * Itera sobre la configuración técnica para generar la UI de navegación.
 */
export const Sidebar = ({width, isOpen, onClose}: SidebarProps) => {
  if (!isOpen) return null;

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
            label={item.label}
            isActive={item.id === 'library'} // Logica de navegación
          />
        ))}
      </ThemedView>

      <SidebarFooter />
    </ThemedView>
  );
};
