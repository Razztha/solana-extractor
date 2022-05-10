export var geoData1 = null;
var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
	};

	const success = (pos) => {
	var crd = pos.coords;
	geoData1 = crd;
	console.log('Successfully determined a user position:', crd);
	}

	const error = (err) => {
	console.log(`ERROR(${err.code}): ${err.message}`);
	}

	export const getLocation = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error, options);
	}
	}