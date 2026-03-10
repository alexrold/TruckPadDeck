import {useEffect, useState} from 'react';

export interface SCSTelemetry {
  speed: number;
  rpm: number;
  gear: number;
  lat: number;
  lng: number;
  fuel: number;
}

export function useSCSTelemetry() {
  const [data, setData] = useState<SCSTelemetry>({
    speed: 0,
    rpm: 0,
    gear: 0,
    lat: 0,
    lng: 0,
    fuel: 0,
  });

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.100.44:8080');

    ws.onopen = () => console.log('✅ SCS WebSocket conectado');
    ws.onmessage = (event) => {
      const telemetry = JSON.parse(event.data);
      setData(telemetry);
    };

    ws.onerror = (error) => console.log('❌ WebSocket error:', error);
    ws.onclose = () => console.log('❌ WebSocket cerrado');

    return () => ws.close();
  }, []);

  return data;
}
