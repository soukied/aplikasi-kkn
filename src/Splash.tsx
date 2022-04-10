import React, {useEffect} from 'react';
import {Text} from '@rneui/themed';
import {View, StyleSheet} from 'react-native';

const TIMEOUT = 2; // seconds

export default function Splash(props:any) {
	const {navigation} = props;

	useEffect(()=>{
		let destroyed = false;
		setTimeout(()=>{
			if (destroyed) return;
			navigation.replace("Home");
		}, TIMEOUT * 1000);
		return () => {destroyed = true};
	},[]);

	return(
		<View style={style.container}>
			<Text style={style.title}> Aplikasi Cuaca dan Gempa </Text>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold'
	}
});
