import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import AppNavigator from './components/navigation';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';

SystemNavigationBar.immersive();

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.dark}>
        <AppNavigator />
      </ApplicationProvider>
    </TailwindProvider>
  );
}
