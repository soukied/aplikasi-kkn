import React, {useEffect} from 'react';
import {getWeather, getEarthquake} from './Data';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

const App = () => {

	useEffect(()=>{
		async function _() {
			const dataBody = await getWeather();
		}
		_();
	},[]);

	return (
		<View style={style.container}>
			<Text style={style.text}>
				This is data from Title
			</Text>
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		flex:1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	}
});

export default App;
