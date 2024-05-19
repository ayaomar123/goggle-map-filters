// @TODO refactor
// TODO make filters work together

var json = [
    {
        "title" : "Store A",
        "city" : "2",
        "category" : "coca",
        "name" : "paul",
        "geometry": {
            "type": "Point",
            "coordinates": [
                43.883621397986786,26.374042298970352
            ]
        }
    },
    {
        "title" : "Store B",
        "city" : "fish",
        "category" : "fanta",
        "name" : "sandrine",
        "geometry": {
            "type": "Point",
            "coordinates": [
                0.48339843749999994,
                46.89023157359399
            ]

        }
    },
    {
        "title" : "Store C",
        "city" : "fish",
        "category" : "coca",
        "name" : "paul",
        "geometry": {
            "type": "Point",
            "coordinates": [
                43.86233538804668, 26.289732653500508
            ]
        }
    },
    {
        "title" : "Store D",
        "city" : "cat",
        "category" : "fanta",
        "name" : "sandrine",
        "geometry": {
            "type": "Point",
            "coordinates": [
                43.98524492931374 ,26.31189295917834
            ]
        }
    },
    {
        "title" : "Store E",
        "city" : "cat",
        "category" : "coca",
        "name" : "lea",
        "geometry": {
            "type": "Point",
            "coordinates": [
                43.97631853804852,26.35743138850199
            ]
        }
    },
    {
        "title" : "Store F",
        "city" : "dog",
        "category" : "fanta",
        "name" : "lea",
        "geometry": {
            "type": "Point",
            "coordinates": [
                43.98661822027759,26.339587382096735
            ]
        }
    },
    {
        "title" : "Store G",
        "city" : "dog",
        "category" : "fanta",
        "name" : "sandrine",
        "geometry": {
            "type": "Point",
            "coordinates": [
                44.06558245070055,26.374042298970352
            ]
        }
    }
]
var jsonStringify = JSON.stringify(json)
var jsonParse = JSON.parse(jsonStringify);

var markers = [];
var markerCluster;
var searchInput = jQuery('#searchMap input');
var filterSelect = jQuery('.filter');
var resetButton = jQuery('#resetFilter');



var filterResults = [];
for (var i = 0; i < json.length; i++) {
    var filters = json[i];
    var filterCity = filters.city;
    var filterCategory = filters.category;
    var filterName = filters.name;
    filterResults.push(filterCity, filterCategory, filterName);
}

var filterStringify = JSON.stringify(filterResults)
var filterParse = JSON.parse(filterStringify);


function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: new google.maps.LatLng(26.355585584452534, 43.983184992867926)
    });

    for (var i = 0; i < json.length; i++){
        setMarkers(json[i], map);
    }

    markerCluster = new MarkerClusterer(map, markers, {ignoreHiddenMarkers: true, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

function setMarkers(marker, map) {
    var markerMap = marker.geometry.coordinates;
    var title = marker.title;
    var city = marker.city;
    var category = marker.category;
    var name = marker.name;
    var pos = new google.maps.LatLng(markerMap[1], markerMap[0]);
    var content = marker;

    markerMap = new google.maps.Marker({
        //icon: 'https://ashab.sa/public/assets/frontend/Map_Picker.svg',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        position: pos,
        title: title,
        city: city,
        category: category,
        name: name,
        map: map
    });

    markers.push(markerMap);

    var infowindow = new google.maps.InfoWindow({
        content: "<div style='float:left'><img width='100px' height='100px' src='https://ashab.sa/public/storage/dihDx3uZLKoccYlLbhFDEH7B3CIvfNjrvGSgwPgV.jpg'></div>" +
            "<div style='float:right; padding: 10px;'><b>" + title + "</b><br/>123 Address<br/> City,Country</div>"
    });

    // Marker click listener
    google.maps.event.addListener(markerMap, 'click', (function (marker1, content) {
        return function () {
            infowindow.setContent(content);
            infowindow.open(map, markerMap);
            map.panTo(this.getPosition());
            // map.setZoom(15);
        }
    })(markerMap, content));
}

function clusterManager(array) {
    markerCluster.clearMarkers();
    if (!array.length) {
        jQuery('.alert').addClass('is-visible');
    } else {
        jQuery('.alert').removeClass('is-visible');
        for (i=0; i < array.length; i++) {
            markerCluster.addMarker(array[i]);
        }
    }
}

//@todo add inputsearch
function newFilter(filterType1 = 'all', filterType2 = 'all', filterType3 = 'all') {
    var criteria = [
        { Field: "city", Values: [filterType1] },
        { Field: "category", Values: [filterType2] },
        { Field: "name", Values: [filterType3] },
        // { Field: ["city", "name", "category"], Values: [filterTyped] }
    ];

    var filtered = markers.flexFilter(criteria);
    clusterManager(filtered);
}

Array.prototype.flexFilter = function(info) {
    // Set our variables
    var matchesFilter, matches = [], count;

    // Helper function to loop through the filter criteria to find matching values
    // Each filter criteria is treated as "AND". So each item must match all the filter criteria to be considered a match.
    // Multiple filter values in a filter field are treated as "OR" i.e. ["Blue", "Green"] will yield items matching a value of Blue OR Green.
    matchesFilter = function(item) {
        count = 0
        for (var n = 0; n < info.length; n++) {
            if (info[n]["Values"].indexOf(item[info[n]["Field"]]) > -1) {
                count++;
            }
            //if value = all, return all item
            else if (info[n]["Values"] == "all") {
                count++;
            }
        }
        // If TRUE, then the current item in the array meets all the filter criteria
        return count == info.length;
    }

    // Loop through each item in the array
    for (var i = 0; i < this.length; i++) {
        // Determine if the current item matches the filter criteria
        if (matchesFilter(this[i])) {
            matches.push(this[i]);
        }
    }

    // Give us a new array containing the objects matching the filter criteria
    return matches;
}



jQuery(document).ready(function() {
    jQuery('.filter-city').on('change', function(){
        var filter2 = jQuery('.filter-category').val();
        var filter3 = jQuery('.filter-name').val();
        newFilter(jQuery(this).val(), filter2, filter3);
    });

    jQuery('.filter-category').on('change', function(){
        var filter1 = jQuery('.filter-city').val();
        var filter3 = jQuery('.filter-name').val();
        newFilter(filter1, jQuery(this).val(), filter3);
    });

    jQuery('.filter-name').on('change', function(){
        var filter1 = jQuery('.filter-city').val();
        var filter2 = jQuery('.filter-category').val();
        newFilter(filter1, filter2, jQuery(this).val());
    });

    searchInput.on('keyup', function () {
        var searchTyped = $(this).val();
        var arr = [];
        if (searchTyped.length > 0) {
            jsonParse.filter(function() {
                for (i = 0; i < json.length; i++) {
                    marker = markers[i];
                    var markerFilter = [];
                    var filterCity = marker.city;
                    var filterCategory = marker.category;
                    var filterName = marker.name;

                    markerFilter.push(filterCity, filterCategory, filterName);
                    var markerFilterStringify = JSON.stringify(markerFilter);
                    if( markerFilterStringify.indexOf(searchTyped) >= 0) {
                        arr.push(marker);
                    } else {
                        console.log('dont fit requirement')
                    }
                }
            });
            clusterManager(arr);
        } else {
            newFilter();
        }
    });

    resetButton.on('click', function() {
        searchInput.val('');
        filterSelect.val('all');
        newFilter();
    });

    //delete all duplicated value from the previous array
    var uniqueValue = [];
    jQuery.each(filterResults, function(i, el){
        if(jQuery.inArray(el, uniqueValue) === -1) {
            uniqueValue.push(el);
        }
    });

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;
            matches = [];

            substrRegex = new RegExp(q, 'i');

            jQuery.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });
            cb(matches);
        };
    };
    searchInput.typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'customFilter',
            source: substringMatcher(uniqueValue)
        });

});


jQuery(window).on('load', function(){
    initMap();
});

