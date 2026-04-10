import {ThemedView} from '@/components/themed';
import {dashboardDataSeed} from '@/constants/DashboardDataSeed';
import {
  DashboardActions,
  DashboardHero,
  DashboardInfo,
  DashboardTechSpecs,
} from '@/src/features/dashboard/components';
import {useTranslation} from '@/src/hooks/useTranslation';
import {useDownloadStore} from '@/src/store/useDownloadStore';
import {useFavoriteStore} from '@/src/store/useFavoriteStore';
import {useLocalSearchParams, useRouter} from 'expo-router';
import React, {useState} from 'react';
import {ScrollView} from 'react-native';

/**
 * DashboardDetailScreen - Centro de Gestión y Vista Previa del Dashboard.
 */
export default function DashboardDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  const {telemetry} = useTranslation();

  // States
  const [isDownloading, setIsDownloading] = useState(false);

  // Stores
  const {toggleFavorite, removeFavorite, isFavorite} = useFavoriteStore();
  const {installDashboard, uninstallDashboard, isInstalled} =
    useDownloadStore();

  const isFav = isFavorite(id);
  const isDownloaded = isInstalled(id);
  const dashboard = dashboardDataSeed.find((d) => d.id === id);

  if (!dashboard) return null;

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      installDashboard(id);
      setIsDownloading(false);
    }, 2000);
  };

  const handleLaunch = () => {
    // Próxima implementación: Lógica de lanzamiento y telemetría
    console.log(`Lanzando dashboard: ${id}`);
  };

  const handleDelete = () => {
    uninstallDashboard(id);
    removeFavorite(id);
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView contentContainerClassName="pb-10">
        <DashboardHero image={dashboard.image} onBack={() => router.back()} />

        <ThemedView variant="transparent" className="px-8 pt-8">
          <DashboardInfo
            title={dashboard.title}
            brand={dashboard.brand}
            game={dashboard.game}
            description={dashboard.description}
            isDownloaded={isDownloaded}
            isFavorite={isFav}
            onToggleFavorite={() => toggleFavorite(id)}
          />

          <DashboardTechSpecs
            labels={telemetry}
            specs={{
              orientation: dashboard.orientation,
              resolution: dashboard.resolutions[0],
              hasDarkMode: dashboard.hasDarkMode,
              isDownloaded: isDownloaded,
              author: dashboard.author,
              updatedAt: dashboard.updatedAt,
            }}
          />

          <DashboardActions
            isDownloaded={isDownloaded}
            isDownloading={isDownloading}
            labels={telemetry}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onLaunch={handleLaunch}
          />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
