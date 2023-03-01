import {View} from 'react-native';
import {useTailwind} from 'tailwind-rn/dist';

interface PropsType {
  children: React.ReactNode;
}

export default function Container(props: PropsType) {
  const tw = useTailwind();

  return (
    <View
      style={tw(
        'w-full my-auto p-4 flex opacity-90 bg-gray-800 border-2 border-black rounded-2xl m-auto overflow-hidden',
      )}>
      <View style={tw('w-full')}>{props.children}</View>
    </View>
  );
}
