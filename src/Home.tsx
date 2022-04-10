import React, {useEffect, useState} from 'react';
import {getWeather as Weather, WeatherType, getEarthquake, EarthquakeInfo} from './Data';
import {CuacaDetail as WeatherDetail, weatherToImage} from './Detail';
import {Tab,Button, Text, TabView} from '@rneui/themed';
import {idToDate} from './util';
import {
	ActivityIndicator,
	View,
	ScrollView,
	StyleSheet,
	Image
} from 'react-native';
import { Icon } from '@rneui/base';

interface Callback {
	():void;
}

const NoDataView = (props:{interval: Callback}) => {
	const {interval} = props;
	useEffect(()=>{
		const dataFetcher = setInterval(()=>{
			interval();
		}, 3000);
		return () => {
			clearInterval(dataFetcher);
		}
	}, []);
	return (
		<View style={{...style.container, justifyContent: 'center', alignItems: 'center'}}>
			<Icon name="disconnect" type="antdesign" size={20}/>
			<Text style={style.text}>
				Data tidak terbaca
			</Text>
			<Text>
				Pastikan anda memiliki jaringan internet
			</Text>
			<Button title="Ulangi"/>
		</View>
	);
}

const MainView = (props:{callback:Callback,dataGempa:EarthquakeInfo|null,dataCuaca:Array<WeatherType>|undefined}) => {
	const {callback, dataCuaca, dataGempa} = props;
	const [index, setIndex] = React.useState(0);
	const [clock, setClock] = useState("");
	useEffect(()=>{
		let isDestroyed = false;
		const clockInterval = setInterval(()=>{
			const curDate = new Date();
			const jam = curDate.getHours();
			const menit = curDate.getMinutes();
			setClock(`${jam}:${menit < 10 ? "0" + menit : menit}`);
		}, 500);
		callback();
		return () => {
			isDestroyed = true;
			clearInterval(clockInterval);
		}
	},[]);
	return (
	  <>
		<TabView value={index} onChange={setIndex} animationType="spring">
	 	  <TabView.Item style={{width: '100%', flex:1, flexDirection: 'row' }}>
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
		  </TabView.Item>
		  <TabView.Item style={{width: '100%', flex: 1, flexDirection:'row' }}>
			<Text></Text>
		  </TabView.Item>
		</TabView>
		<Tab
		  value={index}
		  onChange={(e) => setIndex(e)}
		  indicatorStyle={{
			backgroundColor: 'white',
			height: 4,
		  }}
		  variant="primary"
		  style={{
			  flex: 1
		  }}
		>
		  <Tab.Item
			title="Prediksi Cuaca"
			titleStyle={{ fontSize: 14, color: 'white' }}
			icon={{ name: 'cloud', type: 'font-awesome', color: 'white' }}
		  />
		  <Tab.Item
			title="Gempa"
			titleStyle={{ fontSize: 14, color: 'white' }}
			icon={{ name: 'earth', type: 'fontisto', color: 'white' }}
		  />
		</Tab>
	  </>
	);
}

const Home = (props:{navigation:any}) => {
	const {navigation} = props;
	const [weathers, setWeathers] = useState<Array<WeatherType>|undefined>([]);
	const [gempa, setGempa] = useState<EarthquakeInfo|null>(null);
	const [compDestroyed, setCompDestroyed] = useState(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const init = async (isDestroyed: boolean) => {
			const weather = await Weather();
			const earthquake = await getEarthquake();
			if (isDestroyed) return;
			setGempa(earthquake);
			setWeathers(weather?.getWeathers());
	}

	useEffect(()=>{
		let isDestroyed = false;
		const fetcherInterval = setInterval(async()=>{
			if (!dataLoaded) return;
			const weather = await Weather();
			const listCuaca = weather?.getWeathers();
			if (isDestroyed || listCuaca === undefined || listCuaca.length === 0) return;
			setWeathers(listCuaca);
			console.log("Updating cuaca...");
		}, 1000 * 20);
		return ()=>{
			clearInterval(fetcherInterval);
		}
	},[weathers]);

	useEffect(()=>{
		let isDestroyed = false;
		const intervalDataGempa = setInterval(async ()=>{
			if (!dataLoaded) return;
			const gempa = await getEarthquake();
			if (isDestroyed || gempa === null) return;
			setGempa(gempa);
			console.log("Updating gempa...");
		}, 1000 * 20);

		init(isDestroyed);

		return ()=>{
			isDestroyed = true;
			setCompDestroyed(true);
			clearInterval(intervalDataGempa);
		}
	},[gempa]);

	return (
			!dataLoaded && weathers?.length == 0 && gempa === null ? 
		<View style={{...style.container, flexDirection: 'column', justifyContent: 'center', alignItems:"center"}}>
			<Text style={{...style.text, color: 'gray'}}>
				Mengambil Data
			</Text>
			<Text style={ {marginBottom: 20, color: 'gray'}}>
				Silakan ditunggu...
			</Text>
			<ActivityIndicator animating={true} size="large"/>
		</View>
			: (weathers === undefined || gempa === null) && !dataLoaded ?
			<NoDataView interval={async ()=>{
				const weather = await Weather();
				const earthquake = await getEarthquake();
				if (compDestroyed) return;
				setGempa(earthquake);
				setWeathers(weather?.getWeathers());
			}}/> 
				: <MainView dataGempa={gempa} dataCuaca={weathers} callback={()=>{
					console.log("Main View mounted.")
					setDataLoaded(true);
				}}/>
	)
}

const style = StyleSheet.create({
	container: {
		flex:1,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	}
});

export default Home;
