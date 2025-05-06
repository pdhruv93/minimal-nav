import React from 'react';
import {
  NavigationProvider,
  TaskRemovedBehavior,
  type TermsAndConditionsDialogOptions,
} from '@googlemaps/react-native-navigation-sdk';
import {GuidedNavigation} from './guided-navigation';
import Toast from 'react-native-toast-message';

const termsAndConditionsDialogOptions: TermsAndConditionsDialogOptions = {
  title: 'Minimal Nav',
  showOnlyDisclaimer: true,
};

export default function App() {
  return (
    <NavigationProvider
      termsAndConditionsDialogOptions={termsAndConditionsDialogOptions}
      taskRemovedBehavior={TaskRemovedBehavior.CONTINUE_SERVICE}>
      <GuidedNavigation />
      <Toast />
    </NavigationProvider>
  );
}
