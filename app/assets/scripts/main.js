// 'use strict';

// var config = require('./config');

// console.log.apply(console, config.consoleMessage);
// if (config.environment === 'staging') {
//   console.log('STAGING');
// }

var apikey = '09023a48037b7882a3683cb1c2043c50', //Recieve API key from: https://www.flickr.com/services/api/misc.api_keys.html
		setId = '72157666852477155'; // ID of photo album you're grabbing photos from. Will only display photos that are public.

getImgs(setId);

  // Add Flexslider to Projects Section
  $('.Projects-slider').flexslider({
      animation: "slide",
      directionNav: false,
  });

function getImgs (setId) {

  // Builds API URL to fetch from
  var URL = 'https://api.flickr.com/services/rest/' +  // Wake up the Flickr API gods.
    '?method=flickr.photosets.getPhotos' +  // Get photo from a photoset. http://www.flickr.com/services/api/flickr.photosets.getPhotos.htm
    '&api_key=' + apikey + // API key. Get one here: http://www.flickr.com/services/apps/create/apply/
    '&photoset_id=' + setId +  // The set ID.
    '&privacy_filter=1' +  // 1 signifies all public photos.
    '&format=json&nojsoncallback=1'; // Bringing it in as a JSON.

  $.getJSON(URL, function (data) {

    var photolist = data.photoset.photo;

    $.each(data.photoset.photo, function (i, item) {
      // Creating the image URL. Info: http://www.flickr.com/services/api/misc.urls.html
      var img_src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';

      // Add images in individual <li> elements to HTML
     var img_thumb = $('<li><img src=' + img_src + '></img></li>');
     $(img_thumb).appendTo('.flickr-hit');

    });

  // Adds flexslider to Community section
  $('.flexslider').flexslider({
    directionNav: false,
    slideshowSpeed: 5000,
    });
  });
}

// Adds Event functionality
$('.events-more').click(function(){
  var eventsnumber = $('.events-event-sub-container').length;
	$('.hidden').slice(0,2).css('display', 'block');
  if( eventsnumber > 2){
    $('.events-more').html('SEE ALL').attr('class', 'button invert-btn-white events-all');
    $('.events-all').click(function(){
      $('.hidden').css('display', 'block');
      $('.events-all').css('display', 'none')
    });
  }else{
    $('.events-more').css('display', 'none');
  }
});

/*-------------------------------------------------------
-------------------- Activity Graphs --------------------
-------------------------------------------------------*/

function ingestHashtags (hashtags) {
  // Connect hashtags to /group-summaries/ Missing Maps API endpoint
  const url = 'http://osmstats.redcross.org/group-summaries/' + hashtags.join(',');
  $.getJSON(url, function (hashtagData) {

    // For each hashtag, sum the total edits across all categories
    const totalSum = hashtags.map(function (ht) {
      const vals = hashtagData[ht];
      const sum = Math.round(Number(vals.building_count_add) +
                  Number(vals.building_count_mod) +
                  Number(vals.road_count_add) +
                  Number(vals.road_count_mod) +
                  Number(vals.waterway_count_add) +
                  Number(vals.poi_count_add));
      return {name: ht, value: sum};
    });

    // For each hashtag, sum the total building edits
    const bldngSum = hashtags.map(function (ht) {
      const vals = hashtagData[ht];
      const sum = Math.round(Number(vals.building_count_add) +
                  Number(vals.building_count_mod));
      return {name: ht, value: sum};
    });

    // For each hashtag, sum the total road kilometers edited
    const roadsSum = hashtags.map(function (ht) {
      const vals = hashtagData[ht];
      const sum = Math.round(Number(vals.road_km_add) +
                  Number(vals.road_km_mod));
      return {name: ht, value: sum};
    });

    // Send the total, building, and road metrics to
    // the barchart builder
    initializeBarchart(totalSum, '#Team-Total-Graph');
    initializeBarchart(bldngSum, '#Team-Bldng-Graph');
    initializeBarchart(roadsSum, '#Team-Roads-Graph');

  });
}

// Builds a barchart given an array in the form of
// [{name: *hashtag*, value:*value*}, ..], along with
// the name of a DOM target to place the barchart
function initializeBarchart (data, targetElement) {
  const width = 280;
  const height = 210;
  const barPadding = 17;

  const barHeight = height / data.length - barPadding;

  const xScale = d3.scale.linear()
    .range([height, 0])
    .domain([0, d3.max(data, (d) => d.value )]);

  let svg = d3.select(targetElement)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  let bar = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bar')
    .attr('cx', 0)
    .attr('transform', (d, i) => {
      return `translate(0,${i * (barHeight + barPadding)})`;
    });

  bar.append('rect')
    .attr('height', barHeight)
    .attr('width', (d) => width - xScale(d.value));

  bar.append('text')
    .attr('class', 'Graph-Label-Hashtag')
    .attr('x', 5)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text((d) => '#' + d.name);

  bar.append('text')
    .attr('class', 'Graph-Label-Value')
    .attr('x', 275)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text((d) => d.value.toLocaleString())
    .attr('text-anchor', 'end');
}

// The example list of hashtags below should actually be drawn from
// the Jekyll subhashtag variables found in the _partners directory
const hashtags = ['peacecorps', 'majorroads', 'mapgive', 'redcross'];
ingestHashtags(hashtags);
