import React from 'react';
import {ThemedView, ThemedText, ThemedButton, ThemedIcon} from '@/components/themed';

interface DashboardInfoProps {
  title: string;
  brand: string;
  game: string;
  description: string;
  isDownloaded: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

/**
 * DashboardInfo - Sección de información principal y favoritos.
 */
export const DashboardInfo = ({
  title,
  brand,
  game,
  description,
  isDownloaded,
  isFavorite,
  onToggleFavorite,
}: DashboardInfoProps) => {
  return (
    <>
      <ThemedView
        variant="transparent"
        className="flex-row justify-between items-start mb-6"
      >
        <ThemedView variant="transparent" className="flex-1">
          <ThemedText type="heroTitle" className="mb-1">
            {title}
          </ThemedText>
          <ThemedText variant="primary" type="subtitle">
            {brand} • {game}
          </ThemedText>
        </ThemedView>

        {isDownloaded && (
          <ThemedButton
            variant="ghost"
            size="icon"
            className={`w-14 h-14 rounded-2xl border border-light-border/20 dark:border-white/10 ${
              isFavorite ? 'bg-red-500/10' : 'bg-light-muted/5 dark:bg-dark-muted/10'
            }`}
            onPress={onToggleFavorite}
          >
            <ThemedIcon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#EF4444' : undefined}
            />
          </ThemedButton>
        )}
      </ThemedView>

      <ThemedText
        variant="muted"
        type="body"
        className="mb-10 leading-7 text-lg"
      >
        {description}
      </ThemedText>
    </>
  );
};
