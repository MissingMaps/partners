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


// https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=b6a44df852275c2434d486d762feb505&photoset_id=72157666852477155&privacy_filter=1&format=json&nojsoncallback=1&auth_token=72157664734638974-c5bdc3b0ddb88ddf&api_sig=c2b80507c9e7df892a8a58e080ea160e

// https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=b6a44df852275c2434d486d762feb505&photoset_id=72157666852477155&privacy_filter=1&format=json&nojsoncallback=1&auth_token=72157664734638974-c5bdc3b0ddb88ddf&api_sig=c2b80507c9e7df892a8a58e080ea160e

// fetch('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=b6a44df852275c2434d486d762feb505&photoset_id=72157666852477155&format=json&nojsoncallback=1&auth_token=72157664734638974-c5bdc3b0ddb88ddf&api_sig=0e3613d74b7ea5bf2214ed38fa3b7942')
// .then(function (response) {
//   if (response.status >= 400) {
//     throw new Error('Bad response');
//   }
//   return response.json();
// })
// .then(function(json){
// 	return_photos(json)
// })
// .catch(function(ex){
// 	console.log('parsing failed', ex)
// });

// console.log("woo");

// function return_photos(data){
// 	console.log(data);
// 	var current_photo = data.photoset.photo[1].id;
// 	console.log(current_photo);

// 	document.getElementById("Community-Flickr")
// 	.style.backgroundImage="url(https://pbs.twimg.com/profile_images/562466745340817408/_nIu8KHX.jpeg)";
// }


//   var source = 'https://farm' + photo.farm + '.staticflickr.com/' +
//                             photo.server + '/' +
//                             photo.id + '_' + photo.secret +'_' + size +
//                             '.jpg'

// // https://www.flickr.com/gp/139526447@N02/QL8Au8