/**
 * TechSpecs Configuration
 * Centraliza el mapeo visual (iconos, etiquetas y lógica de renderizado) 
 * para los detalles técnicos de los dashboards.
 */

export interface TechSpecData {
  icon: string;
  label: string;
  value: string;
  isStatus?: boolean;
  statusCondition?: boolean;
  valueClassName?: string;
}

/**
 * Genera la configuración de la cuadrícula técnica basada en los datos 
 * del dashboard y las traducciones actuales.
 */
export const getTechSpecsConfig = (specs: any, labels: any): TechSpecData[] => [
  {
    icon: 'desktop-outline',
    label: labels.orientation,
    value: specs.orientation,
    valueClassName: 'capitalize',
  },
  {
    icon: 'grid-outline',
    label: labels.resolution,
    value: specs.resolution,
  },
  {
    icon: 'moon-outline',
    label: labels.night_mode,
    value: specs.hasDarkMode ? labels.supported : labels.not_supported,
  },
  {
    icon: 'cloud-download-outline',
    label: 'ESTADO',
    value: specs.isDownloaded ? labels.installed : labels.not_installed,
    isStatus: true,
    statusCondition: specs.isDownloaded,
  },
  {
    icon: 'person-outline',
    label: labels.author,
    value: specs.author,
  },
  {
    icon: 'refresh-outline',
    label: labels.updated,
    value: specs.updatedAt,
  },
];
