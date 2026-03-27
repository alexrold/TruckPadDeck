import {
  ThemedButton,
  ThemedCard,
  ThemedIcon,
  ThemedText,
  ThemedTextInput,
  ThemedView,
} from '@/components/themed';
import Constants from 'expo-constants';
import * as NavigationBar from 'expo-navigation-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import {StatusBar} from 'expo-status-bar';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Image, useWindowDimensions} from 'react-native';
import {
  DASHBOARD_DATA_TYPE,
  dashboardDataSeed,
  DEFAULT_PLACEHOLDER_IMAGE,
} from '../../constants/DashboardDataSeed';

const SIDEBAR_WIDTH = 300;
const CARD_MIN_WIDTH = 280;

const HomeScreen = () => {
  const {width: windowWidth} = useWindowDimensions();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const CONNECTION_DATA = {
    ip: '192.168.1.15',
    port: 42424,
    pin: '424242',
    status: 'CONNECTED',
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  const filteredDashboards = useMemo(() => {
    return dashboardDataSeed.filter(
      (dash) =>
        dash.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dash.brand.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const numColumns = useMemo(() => {
    const availableWidth = isMenuOpen
      ? windowWidth - SIDEBAR_WIDTH
      : windowWidth;
    const cols = Math.floor(availableWidth / CARD_MIN_WIDTH);
    return cols > 0 ? cols : 1;
  }, [windowWidth, isMenuOpen]);

  /**
   * UI HELPER: DashboardCard
   */
  const DashboardCard = ({item}: {item: DASHBOARD_DATA_TYPE}) => {
    // Lógica de imagen: Si es null en la data, usamos el default.
    // Nota: Como DEFAULT_DASH_IMAGE es un string de ruta, en RN real
    // deberíamos usar require() en la constante del archivo dashboards.ts
    const imageSource = item.image ? {uri: item.image} : null;

    return (
      <ThemedCard className="flex-1 m-2 p-0 overflow-hidden border-none shadow-sm h-72">
        {/* Area de Preview */}
        <ThemedView className="h-32 bg-light-muted/20 dark:bg-dark-muted/10 items-center justify-center relative">
          {imageSource ? (
            <Image
              source={imageSource}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          ) : (
            /*  */
            <Image
              source={DEFAULT_PLACEHOLDER_IMAGE}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          )}

          <ThemedView
            variant="transparent"
            className="absolute top-2 left-2 px-2 py-0.5 bg-light-primary/90 dark:bg-dark-primary/90 rounded-md"
          >
            <ThemedText className="text-[9px] font-bold text-white uppercase">
              {item.game}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView
          variant="transparent"
          className="p-4 flex-1 justify-between"
        >
          <ThemedView variant="transparent">
            <ThemedText
              type="caption"
              variant="muted"
              className="uppercase text-[10px] tracking-tighter"
            >
              {item.brand}
            </ThemedText>
            <ThemedText
              type="subtitle"
              variant="default"
              className="text-sm"
              numberOfLines={1}
            >
              {item.title}
            </ThemedText>
            <ThemedView
              variant="transparent"
              className="flex-row gap-0.5 items-center mt-1"
            >
              <ThemedIcon name="star" size={12} variant="warning" />
              <ThemedText type="caption" variant="muted">
                ({item.rating.toFixed(1)})
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView
            variant="transparent"
            className="flex-row items-center justify-between mt-2"
          >
            <ThemedIcon
              name={
                item.orientation === 'landscape'
                  ? 'tablet-landscape-outline'
                  : 'tablet-portrait-outline'
              }
              size={14}
              variant="muted"
            />
            <ThemedButton
              size="sm"
              className="border-light-border/20 dark:border-dark-border/20 "
            >
              + Detalles
            </ThemedButton>
          </ThemedView>
        </ThemedView>
      </ThemedCard>
    );
  };

  return (
    <ThemedView className="flex-1 flex-row ">
      <StatusBar hidden />

      {/* --- SIDEBAR --- */}
      {isMenuOpen && (
        <ThemedView
          variant="card"
          style={{width: SIDEBAR_WIDTH}}
          className="h-full border-r border-light-border dark:border-dark-border px-6 py-8 justify-between"
        >
          <ThemedView variant="transparent">
            <ThemedView
              variant="transparent"
              className="flex-row justify-between items-center mb-10"
            >
              <ThemedText type="title">Menu</ThemedText>
              <ThemedButton
                size="icon"
                variant="ghost"
                onPress={() => setIsMenuOpen(false)}
              >
                <ThemedIcon
                  name="chevron-back-outline"
                  size={24}
                  variant="primary"
                />
              </ThemedButton>
            </ThemedView>

            {[
              {icon: 'library-outline', label: 'Library'},
              {icon: 'heart-outline', label: 'Favorites'},
              {icon: 'bug-outline', label: 'Debugging'},
              {icon: 'settings-outline', label: 'Settings'},
            ].map((item) => (
              <ThemedButton
                key={item.label}
                variant="ghost"
                className="flex-row mb-2 gap-4 justify-start p-3 rounded-xl"
              >
                <ThemedIcon
                  name={item.icon as any}
                  size={20}
                  variant="secondary"
                />
                <ThemedText type="subtitle" className="text-base">
                  {item.label}
                </ThemedText>
              </ThemedButton>
            ))}
          </ThemedView>
          <ThemedView variant="transparent" className="items-center opacity-40">
            <ThemedText type="caption">
              {Constants.expoConfig?.version}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      {/* --- CONTENIDO --- */}
      <ThemedView variant="transparent" className="flex-1 p-6">
        <ThemedView
          variant="transparent"
          className="flex-row items-center justify-between mb-8"
        >
          <ThemedView
            variant="transparent"
            className="flex-row items-center gap-4"
          >
            {!isMenuOpen && (
              <ThemedButton
                size="icon"
                variant="ghost"
                onPress={() => setIsMenuOpen(true)}
              >
                <ThemedIcon name="menu-outline" size={32} variant="primary" />
              </ThemedButton>
            )}
            <ThemedView variant="transparent">
              <ThemedText type="logo" variant="primary">
                TruckPadDeck
              </ThemedText>
              <ThemedText type="semibold" variant="muted">
                Dashboard • {CONNECTION_DATA.ip}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView variant="transparent" className="items-end">
            <ThemedView
              variant="transparent"
              className="flex-row items-center gap-2"
            >
              <ThemedText
                type="semibold"
                className="text-[10px] uppercase tracking-widest leading-tight"
              >
                {CONNECTION_DATA.status}
              </ThemedText>
              <ThemedIcon name="wifi" size={28} variant="success" />
            </ThemedView>
            <ThemedText type="caption" variant="muted" className="mt-1">
              • PORT: {CONNECTION_DATA.port} • PIN: {CONNECTION_DATA.pin}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {!isMenuOpen && (
          <ThemedView variant="transparent">
            <ThemedView
              variant="transparent"
              className="flex-row items-center justify-between mb-6"
            >
              <ThemedView variant="transparent">
                <ThemedText type="title">Library</ThemedText>
                <ThemedText type="caption" variant="muted">
                  Search for your favorite truck dashboard
                </ThemedText>
              </ThemedView>
              <ThemedTextInput
                placeholder="Search brand or model..."
                className="w-80 h-11"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </ThemedView>

            <ThemedView variant="transparent" className="mb-8">
              <ThemedText type="semibold" className="mb-3 opacity-60">
                Quick Access
              </ThemedText>
              <FlatList
                data={dashboardDataSeed.slice(0, 5)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => `fav-${item.id}`}
                renderItem={({item}) => (
                  <ThemedButton
                    variant="outline"
                    className="mr-3 px-4 py-2 flex-row gap-2 border-light-primary/10"
                  >
                    <ThemedIcon name="heart" size={14} variant="error" />
                    <ThemedText type="caption">{item.title}</ThemedText>
                  </ThemedButton>
                )}
              />
            </ThemedView>
          </ThemedView>
        )}

        <FlatList
          key={numColumns}
          data={filteredDashboards}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <DashboardCard item={item} />}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 40}}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default HomeScreen;
