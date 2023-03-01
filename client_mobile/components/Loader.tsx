import {ActivityIndicator, View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';

export default function Loader() {
  const tw = useTailwind();

  return (
    <View style={tw('w-full h-full flex justify-center items-center')}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
