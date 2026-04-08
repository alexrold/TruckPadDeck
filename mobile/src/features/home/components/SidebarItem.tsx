import {ThemedButton, ThemedIcon, ThemedText} from '@/components/themed';
import React from 'react';
import {ComponentProps} from 'react';

interface SidebarItemProps {
  icon: ComponentProps<typeof ThemedIcon>['name'];
  label: string; // Recibe el texto ya traducido desde el orquestador (Sidebar)
  onPress?: () => void;
  isActive?: boolean;
}

/**
 * SidebarItem - Elemento atómico del menú lateral.
 * 
 * PROPÓSITO:
 * Representa una opción de navegación táctil dentro del Shell de la App. 
 * Su diseño visual (hover/active states) se adapta mediante Tailwind (NativeWind)
 * para mantener la coherencia con el tema activo (Claro/Oscuro).
 */
export const SidebarItem = ({
  icon,
  label,
  onPress,
  isActive = false,
}: SidebarItemProps) => {
  return (
    <ThemedButton
      variant="ghost"
      onPress={onPress}
      className={`flex-row mb-2 gap-4 justify-start p-3 rounded-xl ${
        isActive ? 'bg-light-primary/10 dark:bg-dark-primary/10' : ''
      }`}
    >
      <ThemedIcon
        name={icon}
        size={20}
        variant={isActive ? 'primary' : 'secondary'}
      />
      <ThemedText
        type="subtitle"
        variant={isActive ? 'primary' : 'default'}
        className="text-base"
      >
        {label}
      </ThemedText>
    </ThemedButton>
  );
};
