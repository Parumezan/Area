import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DashBoard from '../pages/dashboard';
import Connection from '../pages/connection';
import {stackParams} from './stackparams';

const Stack = createStackNavigator<stackParams>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Connection" component={Connection} />
        <Stack.Screen name="DashBoard" component={DashBoard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
