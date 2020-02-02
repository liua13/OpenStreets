// sets up map
var map = L.map("mapid").setView([42.361145, -71.057083], 8);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGl1YTEiLCJhIjoiY2s1dmk1cHFnMWt0bDNrbm51bnp4dWpnNSJ9.bC8XaM5r2Kot4XVVD5l76g', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoibGl1YTEiLCJhIjoiY2s1dmk1cHFnMWt0bDNrbm51bnp4dWpnNSJ9.bC8XaM5r2Kot4XVVD5l76g'
}).addTo(map);

var trashIcon = L.icon({
    iconUrl: './images/trash.png',

    iconSize:     [40, 40], // size of the icon
    iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var leavesIcon = L.icon({
    iconUrl: './images/leaves.png',

    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [17.5, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var snowIcon = L.icon({
    iconUrl: './images/snow.jpg',

    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [17.5, 35], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

// allows user to click and add on map
map.on("click", function(e){
	var lat = e.latlng.lat;
	var lng = e.latlng.lng

	var link = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng;
	$.get(link, function(data){
		if(data==undefined){
			return ;
		}

    	var address = [data.address.house_number, data.address.road, data.address.county, data.address.state, data.address.postcode, data.address.country];
    	for(var i = 0; i < address.length; i++){
    		if(address[i]==undefined){
    			address[i] = "";
    		}
    	}
    	var addressInfo = address[0] + " " + address[1] + "<br/>" + address[2] + ", " + address[3] + ", " + address[4] + "<br/>" + address[5];
		showPopup(addressInfo, [lat, lng]);
	});
});

function hidePopup(){
	$("#popupForm").hide();
}

function showPopup(address, coordinates){
	$("#address").html(address);

	$("#addressInput").val(address);
	$("#latInput").val(coordinates[0]);
	$("#lngInput").val(coordinates[1]);
	$("#popupForm").show();
}

function selectIcon(icon){
	$(".icons").css("background-color", "white");
	$(icon).css("background-color", "#d3d3d3");
}

function displayMarkers(data){
	var iconName = ["trash", "leaves", "snow"];
	var icon = [trashIcon, leavesIcon, snowIcon];
	for(var i = 0; i < data.length; i++){
		var date = new Date(data[i].date);
		var date = ("0" + (date.getMonth() + 1)).slice(-2) + "/" + ("0" + date.getDate()).slice(-2) + "/" + date.getFullYear();
		var popup = "<center><b>" + data[i].address + "</b><br/>" + date + "</center><br/>" + "<b>Category:</b> " + data[i].icon + "<br/><b>Details:</b> " + data[i].details;
		var newIcon;
		if(iconName[0] == data[i].icon){
			newIcon = icon[0];
		} else if(iconName[1] == data[i].icon){
			newIcon = icon[1];		
		} else if(iconName[2] == data[i].icon){
			newIcon = icon[2];
		}
		var m = L.marker([data[i].latitude, data[i].longitude], {icon: newIcon}).bindPopup(popup);
		m.addTo(map);
	}
}