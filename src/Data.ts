import parse from 'xml-parser';

const BMKG_URL = "https://data.bmkg.go.id/"

function weatherCode(value:string | undefined) {
	let retVal = "";
	switch (value) {
		case "0":
		  retVal = "Cerah";
		  break;
		case "100":
		  retVal = "Cerah";
		  break;
		case "1":
		  retVal = "Cerah Berawan";
		  break;
		case "2":
		  retVal = "Cerah Berawan";
		  break;
		case "101":
		  retVal = "Cerah";
		  break;
		case "102":
		  retVal = "Cerah Berawan";
		  break;
		case "3":
		  retVal = "Berawan";
		  break;
		case "103":
		  retVal = "Berawan";
		  break;
		case "4":
		  retVal = "Berawan Tebal";
		  break;
		case "104":
		  retVal = "Berawan Tebal";
		  break;
		case "5":
		  retVal = "Udara Kabur";
		  break;
		case "10":
		  retVal = "Asap";
		  break;
		case "45":
		  retVal = "Kabut";
		  break;
		case "60":
		  retVal = "Hujan Ringan";
		  break;
		case "61":
		  retVal = "Hujan Sedang";
		  break;
		case "63":
		  retVal = "Hujan Lebat";
		  break;
		case "80":
		  retVal = "Hujan Lokal";
		  break;
		case "95":
		  retVal = "Hujan Petir";
		  break;
		case "97":
		  retVal = "Hujan Petir";
		  break;
		default:
		  retVal = "Tidak ada data";
		  break;
		}
	return retVal;
}

async function getData() {
	try {
		const dataBody = await fetch(BMKG_URL + "DataMKG/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml").then(data=>data.text())
		const obj = parse(dataBody);
		const balikpapan = obj.root.children[0].children.filter(val=>val.name == "area" && val.attributes['description'] == "Balikpapan")[0];

		return {
			getWeathers() {
				const curtimeid = this.getCurrentTimeID()
				const w: WeatherType[] = [];
				const data = balikpapan.children.filter(val=>val.name == "parameter" && val.attributes['id'] == "weather")[0];
				const data_temp = balikpapan.children.filter(val=>val.name == "parameter" && val.attributes['id'] == "t")[0];
				data.children.forEach((hourly, i)=>{
					const hourly_temp = data_temp.children[i]
					let value = "";
					value = weatherCode(hourly.children[0]?.content);
					w.push({
						id: hourly.attributes['datetime'],
						temp: `${hourly_temp.children[0].content}°C`,
						value: value,
						isCurrentTime: hourly.attributes['datetime'] == curtimeid
					});
				});
				return w;
			},
			getTemp() {
				const w: TempType[] = [];
				const data = balikpapan.children.filter(val=>val.name == "parameter" && val.attributes['id'] == "t")[0];
				for (let hourly of data.children) {
					let value : string| undefined = "";
					value = `${hourly.children[0]?.content}°C`;
					w.push({
						id: hourly.attributes['datetime'],
						value: value,
						isCurrentTime: hourly.attributes['datetime'] == this.getCurrentTimeID()
					});
				}
				return w;
			},
			getCurrentTempID() {
			
			},
			getCurrentWeather() {
				return this.getWeathers().filter(val=>val.isCurrentTime)[0];
			},
			getCurrentTimeID() {
				const curDate = new Date();
				let curHour = curDate.getHours()+1;
				let calHour = Math.ceil(curHour/6) * 6
				let hour = calHour.toString();
				let day = curDate.getDate().toString();
				let month = (curDate.getMonth() + 1).toString();
				let year = curDate.getFullYear().toString();
				if (hour == "24") {
					hour = "00";
					day = (parseInt(day) + 1).toString();
				}
				return `${year}${month.length<2?'0'+month:month}${day.length<2?'0'+day:day}${hour.length<2?'0'+hour:hour}00`
			}
		}
	} catch(e) {
		return null;
	}
}

async function getEarthquake() {
	try {
		const bodyData:EarthquakeInfo = await fetch(BMKG_URL + "DataMKG/TEWS/autogempa.json").then(val=>val.json());
		return bodyData;
	} catch(e) {
		return null;
	}
}

export interface TempType {
	id: string;
	value: string|undefined;
	isCurrentTime: boolean;
}

export interface WeatherType {
	id: string;
	value: string;
	temp: string;
	isCurrentTime: boolean;
}

export interface EarthquakeInfo {
	Infogempa: _gempa;
}

interface _gempa {
	gempa: EarthquakeItem;
}

export interface EarthquakeItem {
	Tanggal: string;
	Jam: string;
	DateTime: string;
	Coordinates: string;
	Lintang: string;
	Bujur: string;
	Magnitude: string;
	Kedalaman: string;
	Wilayah: string;
	Potensi: string;
	Dirasakan: string;
	Shakemap: string;
}

export {getData as getWeather, getEarthquake}
