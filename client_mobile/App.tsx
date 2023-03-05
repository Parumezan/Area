import React from 'react';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types/RootStackParamList';

import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import BrickEdit from './pages/brickEdit';
import Services from './pages/services';
import Actions from './pages/actions';
import ActionsEdit from './pages/actionsEdit';

const RootStack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{headerShown: false}}>
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen name="Register" component={Register} />
          <RootStack.Screen name="Dashboard" component={Dashboard} />
          <RootStack.Screen name="Services" component={Services} />
          <RootStack.Screen name="BrickEdit" component={BrickEdit} />
          <RootStack.Screen name="Actions" component={Actions} />
          <RootStack.Screen name="ActionsEdit" component={ActionsEdit} />
        </RootStack.Navigator>
      </NavigationContainer>
    </TailwindProvider>
  );
}
