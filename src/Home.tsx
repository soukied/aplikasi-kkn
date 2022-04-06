import React, {useEffect, useState} from 'react';
import {getWeather as Weather, getEarthquake} from './Data';
import {
	View,
	Text,
	StyleSheet,
} from 'react-native';

interface WeatherType {
	id: string;
	value: string;
	isCurrentTime: boolean;
}

const Home = (props:any) => {
	const [weathers, setWeathers] = useState<Array<WeatherType>|undefined>([]);
	useEffect(()=>{
		let isLoaded = true;
		async function init() {
			const dataBody = await Weather();
			if (dataBody == null && !isLoaded) return;
			setWeathers(dataBody?.getWeathers());
		}
		init();
		return ()=>{isLoaded = false}
	},[]);

	return (
		<View style={style.container}>
			<Text style={style.text}>
				{weathers?.length == 0 ? "Membaca data" : "Data telah terbaca"}
			</Text>
			{weathers?.map(val=>{
				return (
					<Text key={val.id}>
						{val.value}
					</Text>
				);
			})}
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

export default Home;
