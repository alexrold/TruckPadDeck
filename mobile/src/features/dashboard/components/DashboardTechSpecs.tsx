import {ThemedInfoItem, ThemedText, ThemedView} from '@/components/themed';
import React from 'react';
import {getTechSpecsConfig} from '../constants/techSpecsConfig';

interface DashboardTechSpecsProps {
  specs: {
    orientation: string;
    resolution: string;
    hasDarkMode: boolean;
    isDownloaded: boolean;
    author: string;
    updatedAt: string;
  };
  labels: any; // Traducciones
}

/**
 * DashboardTechSpecs - Cuadrícula de detalles técnicos del dashboard.
 */
export const DashboardTechSpecs = ({
  specs,
  labels,
}: DashboardTechSpecsProps) => {
  // Generamos la configuración a partir de los datos actuales
  const techSpecs = getTechSpecsConfig(specs, labels);

  return (
    <>
      <ThemedText
        type="subtitle"
        className="mb-6 tracking-[2px] opacity-80 uppercase"
      >
        {labels.tech_details}
      </ThemedText>

      <ThemedView variant="card" className="p-8 rounded-[32px] mb-8">
        <ThemedView variant="transparent" className="flex-row flex-wrap">
          {/* Renderizado dinámico de especificaciones técnicas */}
          {techSpecs.map((item, index) => (
            <ThemedInfoItem key={index} {...item} />
          ))}
        </ThemedView>
      </ThemedView>
    </>
  );
};
