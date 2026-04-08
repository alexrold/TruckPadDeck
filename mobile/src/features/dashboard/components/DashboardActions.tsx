import React from 'react';
import {ActivityIndicator} from 'react-native';
import {ThemedView, ThemedButton, ThemedText} from '@/components/themed';

interface DashboardActionsProps {
  isDownloaded: boolean;
  isDownloading: boolean;
  onDownload: () => void;
  onLaunch: () => void;
  onDelete: () => void;
  labels: any;
}

/**
 * DashboardActions - Botonera de acciones principales (Descarga/Lanzamiento).
 */
export const DashboardActions = ({
  isDownloaded,
  isDownloading,
  onDownload,
  onLaunch,
  onDelete,
  labels,
}: DashboardActionsProps) => {
  return (
    <ThemedView variant="transparent" className="flex-row gap-4 mb-10">
      {!isDownloaded ? (
        <ThemedButton
          variant="primary"
          className="flex-1 h-20 rounded-[24px]"
          onPress={onDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ThemedText type="button" className="text-white text-xl">
              {labels.download}
            </ThemedText>
          )}
        </ThemedButton>
      ) : (
        <>
          <ThemedButton
            variant="success"
            className="flex-[2] h-20 rounded-[24px]"
            onPress={onLaunch}
          >
            {labels.launch}
          </ThemedButton>
          
          <ThemedButton
            variant="danger"
            size="md"
            className="flex-1 h-20 rounded-[24px] opacity-90"
            onPress={onDelete}
          >
            {labels.delete}
          </ThemedButton>
        </>
      )}
    </ThemedView>
  );
};
