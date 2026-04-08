import {useEffect} from 'react';
import * as Network from 'expo-network';
import {useConnectionStore} from '@store/index';

export const useLocalIp = () => {
  const {setConnection, ip} = useConnectionStore();

  useEffect(() => {
    const getIpPrefix = async () => {
      if (ip && ip.trim() !== '') return;
      try {
        const ipAddress = await Network.getIpAddressAsync();
        if (ipAddress && ipAddress.includes('.')) {
          const parts = ipAddress.split('.');
          if (parts.length === 4) {
            setConnection({
              ip: `${parts[0]}.${parts[1]}.${parts[2]}.`,
              port: 42424,
              pin: '',
            });
          }
        }
      } catch (e) {
        console.warn(e);
      }
    };
    getIpPrefix();
  }, [ip, setConnection]);
};
