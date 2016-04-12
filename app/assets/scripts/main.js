// 'use strict';

// var config = require('./config');

// console.log.apply(console, config.consoleMessage);
// if (config.environment === 'staging') {
//   console.log('STAGING');
// }

var apikey = '09023a48037b7882a3683cb1c2043c50',
		setId = '72157666852477155';

getImgs(setId);

function getImgs (setId) {
  var URL = 'https://api.flickr.com/services/rest/' +  // Wake up the Flickr API gods.
    '?method=flickr.photosets.getPhotos' +  // Get photo from a photoset. http://www.flickr.com/services/api/flickr.photosets.getPhotos.htm
    '&api_key=' + apikey + // API key. Get one here: http://www.flickr.com/services/apps/create/apply/
    '&photoset_id=' + setId +  // The set ID.
    '&privacy_filter=1' +  // 1 signifies all public photos.
    '&format=json&nojsoncallback=1'; // Bringing it in as a JSON.
  $.getJSON(URL, function (data) {

  	console.log(data);

  	var photolist = data.photoset.photo;

    $.each(data.photoset.photo, function (i, item) {
      // Creating the image URL. Info: http://www.flickr.com/services/api/misc.urls.html
      var img_src = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';

			// $('#Community-Flickr').css('background-image', 'url(' + img_src + ')'); // Sets image as background

		var circle = $('<li class = ""></li>');
		$(circle).appendTo('.Community-Links ul'); // create toggle circles at the bottom.

     var img_thumb = $('<li><img src=' + img_src + '></img></li>');
     $(img_thumb).appendTo('#Community-Flickr ul'); // Adds images to li.
    });
  });
}
