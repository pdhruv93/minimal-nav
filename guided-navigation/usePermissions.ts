import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';

export function usePermissions() {
  const [arePermissionsApproved, setArePermissionsApproved] = useState(false);

  useEffect(() => {
    const check = async () => {
      const toRequestPermissions =
        Platform.OS === 'android'
          ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
          : [PERMISSIONS.IOS.LOCATION_ALWAYS];

      try {
        const permissionStatuses = await requestMultiple(toRequestPermissions);
        const result = permissionStatuses[toRequestPermissions[0]!];

        if (result === RESULTS.GRANTED) {
          setArePermissionsApproved(true);
        } else {
          console.warn({
            text: 'Location permissions are needed to proceed with the app. Please re-open and accept.',
          });
        }
      } catch (error) {
        console.error('Error requesting permissions', error);
      }
    };

    check();
  }, []);

  return {arePermissionsApproved};
}
