var storage = (function() {
    var uid = new Date,
        storage,
        result;
    try {
      (storage = window.localStorage).setItem(uid, uid);
      result = storage.getItem(uid) == uid;
      storage.removeItem(uid);
      return result && storage;
    } catch(e) {}
}());

function parseURI(uri){
	var url = decodeURIComponent(uri).replace("?",""); 
	var parameters = {};
	var pairs = url.split('&');
	$.each(pairs, function(i, v){
		var pair = v.split('=');	    
		parameters[pair[0]] = pair[1];
	});
	return parameters;
}

function getYearRange(year) {
	var recYear = parseInt(year);
    //	console.log(recYear);
    switch(true) {
    	case (recYear<1800) : recYear ="1500"; break;
    	case (recYear<1810) : recYear ="1800"; break;
    	case (recYear<1820) : recYear ="1810"; break;
    	case (recYear<1830) : recYear ="1820"; break;
    	case (recYear<1840) : recYear ="1830"; break;
    	case (recYear<1850) : recYear ="1840"; break;
    	case (recYear<1860) : recYear ="1850"; break;
    	case (recYear<1870) : recYear ="1860"; break;
    	case (recYear<1880) : recYear ="1870"; break;
    	case (recYear<1890) : recYear ="1880"; break;
    	case (recYear<1900) : recYear ="1890"; break;
    	case (recYear<1910) : recYear ="1900"; break;
    	case (recYear<1920) : recYear ="1910"; break;
    	case (recYear<1930) : recYear ="1920"; break;
    	case (recYear<1940) : recYear ="1930"; break;
    	case (recYear<1950) : recYear ="1940"; break;
    	case (recYear<1960) : recYear ="1950"; break;
    	case (recYear<1970) : recYear ="1960"; break;
    	case (recYear<1980) : recYear ="1970"; break;
    	case (recYear<1990) : recYear ="1980"; break;
    	case (recYear<2000) : recYear ="1990"; break;
    	case (recYear<2010) : recYear ="2000"; break;
    	case (recYear<2020) : recYear ="2010"; break;
    }
    return recYear;
}

function generateColor(i) {
	var frequency = .3;
	red   = Math.sin(frequency*i + 0) * 127 + 128;
	green = Math.sin(frequency*i + 2) * 127 + 128;
	blue  = Math.sin(frequency*i + 4) * 127 + 128;
	//console.log(red + ":" + green + ":" + blue);
	var color = { "red" : red, "green": green, "blue": blue};
	return color;
}
function componentToHex(n){
    n = parseInt(n, 10);
    if( isNaN(n) ){ 
        return "00";
    }
    n = Math.max(0, Math.min(n,255));
    return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
