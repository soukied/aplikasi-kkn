import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './Home';
import Splash from './Splash';

const Stack = createNativeStackNavigator();

export default function Nav() {
	return (
	<NavigationContainer>
		<Stack.Navigator screenOptions={{headerShown: false, statusBarStyle:'light'}}>
			<Stack.Screen name="Splash" component={Splash} options={{statusBarHidden: true}}/>
			<Stack.Screen name="Home" component={Home}/>
		</Stack.Navigator>
	</NavigationContainer>
	);
}
