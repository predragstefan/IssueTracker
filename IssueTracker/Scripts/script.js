$("#index-tabela").closest(".container").addClass("tabela");
$("#container").closest(".container").addClass("tabela2");

$("table tr td:nth-child(7) div").addClass(function () {
    return $(this).text().toLowerCase().trim();
}).closest("td").addClass("levo");

$(".naziv, .datum-kreiranja, .status-sort").on("click", function () {
    $(this).find("span").removeClass("glyphicon-sort").toggleClass("glyphicon-sort-by-attributes glyphicon-sort-by-attributes-alt")
});

$(".naziv, .datum-kreiranja, .status-sort").one("click", function () {
    $(this).find("span").removeClass("glyphicon-sort-by-attributes-alt");
});

$(window).on("load", function () {
    setTimeout(loading, 800);
    function loading() {
        $(".loadingscreen").fadeOut();
    }
}
)
$(function () {
    // We can attach the `fileselect` event to all file inputs on the page
    $(document).on('change', ':file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    // We can watch for our custom `fileselect` event like this
    $(document).ready(function () {
        $(':file').on('fileselect', function (event, numFiles, label) {
            var input = $(this).parents('.input-group').find(':text'),
                log = numFiles > 1 ? numFiles + ' files selected' : label;

            if (input.length) {
                input.val(log);
            } else {
                if (log) alert(log);
            }
        });
    });
});

var mapOptions = {
    styles: [{ "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 40 }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 21 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 17 }] }]
}
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 44.806821, lng: 20.473507 },
        zoom: 16,
        styles: mapOptions.styles,
        scrollwheel: false,
        mapTypeControl: false,
        contextMenu: true
    });

    var markerPosition = {
        lat: 44.806821,
        lng: 20.473507
    }

    var venueMarker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        title: "Conference Venue",
        color: 'yellow',
        label: 'Venue',
        animation: google.maps.Animation.DROP
    });

    var VenueInfoWindow = new google.maps.InfoWindow({
        content: '<div>Neki Tekst 1</div><div>Neki malo duzi opis</div>'
    });

    venueMarker.addListener('click', function () {
        VenueInfoWindow.open(map, venueMarker);
    });
}