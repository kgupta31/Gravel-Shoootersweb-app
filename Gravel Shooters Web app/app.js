//'use strict'
// Listen for calculate button

document.getElementById("quote-form").addEventListener("submit", doQuote)
//doQuote()

function doQuote (e) {

    const UI_JOB_ADDR1 = document.getElementById("job-addr1").value
    const UI_JOB_ADDR2 = document.getElementById("job-addr2").value
    const UI_JOB_ADDR3 = document.getElementById("job-addr3").value

    var yardAddress = new google.maps.LatLng(33.370663, -111.580793)
    var jobAddress = `${UI_JOB_ADDR1} ${UI_JOB_ADDR2} ${UI_JOB_ADDR3}`

    initMap(jobAddress)
    //initMap("1049 e spence ave 85281")

    e.preventDefault()
}


function initMap(jobAddress) {
        pointA = new google.maps.LatLng(33.370663, -111.580793)

        geocoder = new google.maps.Geocoder();
        myOptions = {
            zoom: 7,
            center: pointA
        },

        geocoder.geocode( { 'address': jobAddress}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              pointB = results[0].geometry.location
              map = new google.maps.Map(document.getElementById('map-canvas'), myOptions),

        // Instantiate a directions service.
        directionsService = new google.maps.DirectionsService,
        directionsDisplay = new google.maps.DirectionsRenderer({
            map: map
        }),

    // get route from A to B
    calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
          });
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    const waypts = []

    waypts.push({
        location: pointB,
        stopover: true,
    });

    directionsService.route({
        origin: pointA,
        destination: pointA,
        waypoints: waypts,
        optimizeWaypoints: true,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            computeTotalTimeAndCost(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function computeTotalTimeAndCost(result) {
    const TRUCK_HOURLY_RATE = 400;
    const MAT_TYPE = document.getElementById("mat-type").name;
    const MAT_COST = Number(document.getElementById("mat-type").value);
    const MAT_QTY = document.getElementById("mat-qty").value;

    var totalDist = 0;
    var totalTime = 0;
    var myroute = result.routes[0];

    for (i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
      totalTime += myroute.legs[i].duration.value;
    }
    totalDist = totalDist / 1000.
    //document.getElementById("total").innerHTML = "total distance is: " + totalDist + " km<br>total time is: " + (totalTime / 60).toFixed(2) + " minutes";
    console.log(totalTime)
    console.log(totalTime/3600)
    document.getElementById('jobTimeH').innerHTML = 1 + Math.floor(totalTime / 3600)
    document.getElementById('jobTimeM').innerHTML = ((totalTime / 60) % 60).toFixed(0)
    document.getElementById('jobCost').innerHTML = ((totalTime / 3600) * TRUCK_HOURLY_RATE + (MAT_COST * MAT_QTY * 1.4)).toFixed(2)
}