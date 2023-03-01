import {ImageBackground, View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';
import Dial from './Dial';

export default function Wrapper({children}: {children: React.ReactNode}) {
  const tw = useTailwind();

  return (
    <View style={tw('w-full h-full')}>
      <ImageBackground
        style={tw('absolute h-full w-full')}
        source={require('../assets/BackgroundDashboard.png')}
      />
      <View style={tw('w-full h-full')}>{children}</View>

      <Dial />
    </View>
  );
}
