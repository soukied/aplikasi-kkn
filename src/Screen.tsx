import React, {useEffect, useState} from 'react';
import {Text} from '@rneui/themed';
import {View, ScrollView, Image} from 'react-native';
import {WeatherType, EarthquakeInfo, TempType} from './Data';
import {idToDate} from './util';
import {weatherToImage,CuacaDetail as WeatherDetail} from './Detail';

export interface CuacaScreenState {
	dataCuaca: Array<WeatherType>|undefined;
	clock : string;
	temp: TempType[] | undefined;
}

export function CuacaScreen(props:CuacaScreenState) {
	const {dataCuaca, clock} = props;
	
	return (
			<View style={{flex: 1, width: '100%'}}>
				<View style={{backgroundColor:'#babaff',flex: 1/3, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '100%'}}>
				{dataCuaca?.filter(item=>item.isCurrentTime).map(item=>{
					return <Image key={item.id + "img"} source={weatherToImage(item.value)} />
				})}
				<View>
					<Text style={{fontSize: 30}}> {clock} </Text>
					{dataCuaca?.filter(item=>item.isCurrentTime).map(item=>{
						const date = idToDate(item.id);
						const hari = parseInt(date.hari);
						const hariSekarang = new Date().getDate();
						return (<Text style={{ fontSize: 18}} key={item.id+ '1'}> Cuaca menjadi {item.value} {"\n"} pada {date.jam}:00{hari - hariSekarang == 1 ? " besok hari" : "."}</Text>);
					})}
				</View>
				</View>
				<ScrollView style={{flex:2/3, width: '100%'}}>
					<View style={{alignItems:'center', flex: 1, marginHorizontal: 7}}>
				{dataCuaca?.map((item,index)=>{
					return <WeatherDetail key={item.id} data={item} last={index == dataCuaca.length - 1}/>
				})}
					</View>
				</ScrollView>
			</View>
	);
}

export interface GempaScreenState {
	dataGempa: EarthquakeInfo;
}

export function GempaScreen(props: GempaScreenState) {
	const {dataGempa} = props;
	const detailFontSize = 17;
	return (
		<View style={{flex: 1}}>
		<ScrollView>
			<View style={{alignItems: 'center'}}>
				<View style={{margin: 10, justifyContent: 'center', width: '100%'}}>
					<Text style={{fontWeight: 'bold', fontSize: 20, color: 'black', textAlign: 'center'}}>
						Gempa Terakhir pada {dataGempa.Infogempa.gempa.Jam}
					</Text>
					<Text style={{fontSize: 17, fontWeight: 'bold', textAlign: 'center'}}>
						{dataGempa.Infogempa.gempa.Tanggal}
					</Text>
				</View>
				<Image source={{uri: 'https://data.bmkg.go.id/DataMKG/TEWS/' + dataGempa.Infogempa.gempa.Shakemap, width: 300, height: 360}}/>
				<View style={{ marginHorizontal: 20, marginVertical: 15, backgroundColor: 'lightgray', padding: 10, borderRadius: 5}}>
					<Text style={{fontSize: detailFontSize, textAlign: 'left'}}> <Text style={{fontWeight: 'bold'}}>Wilayah:</Text> {dataGempa.Infogempa.gempa.Wilayah} </Text>
					<Text style={{fontSize: detailFontSize, textAlign: 'left'}}> <Text style={{fontWeight: 'bold'}}>Skala: </Text>{dataGempa.Infogempa.gempa.Magnitude} </Text>
					<Text style={{fontSize: detailFontSize, textAlign: 'left'}}> <Text style={{fontWeight: 'bold'}}>Lintang: </Text>{dataGempa.Infogempa.gempa.Lintang} </Text>
					<Text style={{fontSize: detailFontSize, textAlign: 'left'}}> <Text style={{fontWeight: 'bold'}}>Bujur: </Text>{dataGempa.Infogempa.gempa.Bujur} </Text>
					<Text style={{fontSize: detailFontSize, textAlign: 'left'}}> <Text style={{fontWeight: 'bold'}}>Potensi: </Text>{dataGempa.Infogempa.gempa.Potensi} </Text>
				</View>
			</View>
		</ScrollView>
		</View>
	)
}
