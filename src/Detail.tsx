import React, { useEffect } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {WeatherType} from './Data';
import {Text} from '@rneui/themed';
import {idToDate} from './util';

export function weatherToImage(value:string | undefined) {
	switch (value) {
	  // cearh
		case "Cerah":
		return require('./images/cerah.png');

		case "Cerah Berawan":
		return require('./images/cerah-berawan.png');

		case "Berawan":
		case "Udara Kabur":
		case "Asap":
		case "Kabut":
		case "Berawan Tebal":
			return require('./images/berawan.png');

		case "Hujan Ringan":
		case "Hujan Lokal":
			return require('./images/hujan-kecil.png');

		case "Hujan Sedang":
			return require('./images/hujan-sedang.png');

		case "Hujan Lebat":
			return require('./images/hujan-besar.png');

		case "Hujan Petir":
			return require('./images/hujan-petir.png');

		case "Tidak ada data":
			return require('./images/day.svg');
	}
}

function GempaDetail() {
	return (
		<View>

		</View>
	);
}

function CuacaDetail(props:{data:WeatherType,last:boolean}) {
	const {data, last} = props;
	const date = idToDate(data.id);
	const textColor = data.isCurrentTime ? "white" : "black";
	return (
		<View style={{...style.container,flexDirection:'row', backgroundColor: data.isCurrentTime ? 'green' : 'lightgray', marginBottom:last? 10: 0}}>
			<View>
				<Image source={weatherToImage(data.value)} width={30} height={30}/>
			</View>
			<View style={{justifyContent:'center'}}>
				<Text style={{fontWeight: 'bold',fontSize: 20, color: textColor}}> {date.jam}:{date.menit} - {data.value}</Text>
				<Text style={{color: textColor, fontSize: 15}}> {date.hari} {date.bulan}{data.isCurrentTime? " (Selanjutnya)" :""}</Text>
			</View>
		</View>
	);
}

const style = StyleSheet.create({
	container : {
		borderRadius: 10,
		width: "100%",
		marginTop: 10,
		padding: 5,
		paddingLeft: 10
	}
});

export {GempaDetail, CuacaDetail};
