export function idToDate(id:string) {
	let tahun = id.slice(0, 4);
	let bulan = id.slice(4,6);
	let hari = id.slice(6,8);
	let jam = id.slice(8,10);
	let menit = id.slice(10);
	switch(bulan) {
		case '01':
			bulan = "Januari";
			break;
		case '02':
			bulan = "Februari";
			break;
		case '03':
			bulan = "Maret";
			break;
		case '04':
			bulan = "April";
			break;
		case '05':
			bulan = "Mei";
			break;
		case '06':
			bulan = "Juni";
			break;
		case '07':
			bulan = "Juli";
			break;
		case '08':
			bulan = "Agustus";
			break;
		case '09':
			bulan = "September";
			break;
		case '10':
			bulan = "Oktober";
			break;
		case '11':
			bulan = "November";
			break;
		case '12':
			bulan = "Desember";
			break;
	}
	return {
		jam,
		menit,
		hari,
		bulan,
		tahun
	}
}
