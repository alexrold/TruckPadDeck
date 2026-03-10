// app/components/screens/home/index.tsx
import {View, Text} from 'react-native';
import {useSCSTelemetry} from '@/hooks/use-scs-telemetry';
import {useColorScheme} from '@/hooks/use-color-scheme';

export default function ScreenHome() {
  const truck = useSCSTelemetry();
  const colorScheme = useColorScheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
      }}
    >
      <Text
        style={{
          fontSize: 64,
          color: colorScheme === 'dark' ? '#0f0' : '#f00',
          fontWeight: 'bold',
        }}
      >
        🚛 {Math.round(truck.speed || 0)} km/h
      </Text>
      <Text style={{fontSize: 32, color: '#888'}}>
        RPM: {Math.round(truck.rpm || 0)}
      </Text>
      <Text style={{fontSize: 32, color: '#aaa'}}>
        Gear: {truck.gear || 0} | Fuel: {truck.fuel || 0}%
      </Text>
    </View>
  );
}
