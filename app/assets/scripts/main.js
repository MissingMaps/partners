/* -------------------------------------------------------
 ------------------- Add Primary Stats -------------------
 -------------------------------------------------------*/

function getPrimaryStats (primaryhash) {
  const url = 'http://osmstats.redcross.org/hashtags/' + primaryhash + '/users';
  $.getJSON(url, function (hashtagData) {
    var usersCount = (Object.keys(hashtagData).length);
    var editsCount = 0;
    var buildingCount = 0;
    var roadCount = 0;

    for (var i = 0; i < usersCount; i++) {
      editsCount = editsCount + hashtagData[i].edits;
      buildingCount = buildingCount + hashtagData[i].buildings;
      roadCount = parseInt(roadCount + hashtagData[i].roads);
    }

    $('#stats-roadCount').html(roadCount.toLocaleString());
    $('#stats-buildingCount').html(buildingCount.toLocaleString());
    $('#stats-usersCount').html(usersCount.toLocaleString());
    $('#stats-editsCount').html(editsCount.toLocaleString());
  });
}

/* -------------------------------------------------------
 --------------- Add HOT Project Carousel ----------------
 -------------------------------------------------------*/

// Fetch Project data from Tasking Manager API
function getProjects (projects) {
  // Add Flexslider to Projects Section
  $('.Projects-slider').flexslider({
    animation: 'slide',
    directionNav: true,
    slideshowSpeed: 6000000,
    prevText: '',
    nextText: '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
  });
  $('.flex-next').prependTo('.HOT-Nav-Projects');
  $('.flex-control-nav').prependTo('.HOT-Nav-Projects');
  $('.flex-prev').prependTo('.HOT-Nav-Projects');
  var projCount = projects.length;
  $('#stats-projCount').html(projCount);
  var projectOrder = 1;

  if (projects.length === 1) {
    $('.flex-next').css('display', 'none');
  }

  for (var i = 0; i < projects.length; i++) {
    const url = 'http://tasks.hotosm.org/project/' + projects[i] + '.json';
    $.getJSON(url, function (ProjectData) {
      projectOrder += 1;
      makeProjects(ProjectData, projectOrder);
    });
  }
}

// Update cards with necessary project details
function makeProjects (project, projectOrder) {
  var props = project.properties;
  var projDone = Math.round(props.done);

  // Updates Progress Bar
  $('ul li:nth-child(' + projectOrder + ') .HOT-Progress').addClass('projWidth' + projectOrder + '');
  $('.HOT-Progress').append('<style>.projWidth' + projectOrder + ':before{ width: ' + projDone + '%;}</style>');

  // Adds Project variables to the cards
  $('ul li:nth-child(' + projectOrder + ') .HOT-Title p').html('<b>' + props.name + '</b>');
  $('ul li:nth-child(' + projectOrder + ') .HOT-Progress').html('<p>' + projDone + '%</p>');
  $('ul li:nth-child(' + projectOrder + ') .HOT-Map ').attr('id', 'Map-' + project.id);

  // Drop a map into the HOT-Map div
  addMap(project.id);
}

/* -------------------------------------------------------
 ----------- Add Map to HOT Project Carousel -------------
 -------------------------------------------------------*/

function onEachFeature (feature, layer) {
  // Set symbology to match HOTOSM Tasking Manager completion states
  let symbology = {
    color: 'black',
    weight: 0.25,
    opacity: 0.7,
    fillOpacity: 0.4,
    fillColor: 'black'
  };

  const state = feature.properties.state;
  if (state === -1) {
    symbology.fillColor = '#dfdfdf';
  } else if (state === 0) {
    symbology.fillColor = '#dfdfdf';
  } else if (state === 1) {
    symbology.fillColor = '#dfdfdf';
  } else if (state === 2) {
    symbology.fillColor = '#ffa500';
  } else if (state === 3) {
    symbology.fillColor = '#008000';
  }

  layer.setStyle(symbology);
}

function addMap (projectId) {
  const token = 'pk.eyJ1Ijoic3RhdGVvZnNhdGVsbGl0ZSIsImEiOiJlZTM5ODI5NGYw' +
                'ZWM2MjRlZmEyNzEyMWRjZWJlY2FhZiJ9.omsA8QDSKggbxiJjumiA_w.';
  const basemapUrl = 'https://api.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png';

  // Connect HOT-OSM endpoint for tasking squares data
  const endpoint = 'http://tasks.hotosm.org/project/' + projectId + '/tasks.json';
  $.getJSON(endpoint, function (taskData) {
    // Remove loading spinners before placing map
    $('#Map-' + projectId).empty();

    // Initialize map
    const map = L.map('Map-' + projectId,
      {zoomControl: false}).setView([38.889931, -77.009003], 13);

    // Add tile layer
    L.tileLayer(basemapUrl + '?access_token=' + token, {
      attribution: '<a href="http://mapbox.com">Mapbox</a>'
    }).addTo(map);

    // Add feature layer
    const featureLayer = L.geoJson(taskData, {
      onEachFeature: onEachFeature
    }).addTo(map);

    // Fit to feature layer bounds
    map.fitBounds(featureLayer.getBounds());

    // Disable drag and zoom handlers.
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();

    // Disable tap handler, if present.
    if (map.tap) map.tap.disable();
  });
}

/* -------------------------------------------------------
 ----------- Add Functionality to Events List  -----------
 -------------------------------------------------------*/

// Adds hide/ show functionality to events list (pre-generated by Jekyll)
function eventsFunctionality () {
  var eventsnumber = $('.event-sub-container').length;
  var firstTwoOpen = false;
  var allOpen = false;

  if (eventsnumber === 0) {
    $('.events-null').css('display', 'block');
  }
  if (eventsnumber < 3) {
    $('.events-btn').css('display', 'none');
  }

  $('.events-btn').bind('click').click(function (event) {
    if (firstTwoOpen === false && allOpen === false) {
      firstTwoOpen = true;
      $('.hidden').slice(0, 2)
      .css('display', 'block').animate({
        opacity: 1,
        height: '180px'
      }, 500);
      if (eventsnumber >= 5) {
        $('.events-btn').html('SEE ALL');
      } else {
        firstTwoOpen = false;
        allOpen = true;
        $('.events-btn').html('SEE FEWER');
      }
    } else if (firstTwoOpen === true && allOpen === false && eventsnumber > 2) {
      firstTwoOpen = false;
      allOpen = true;
      $('.events-btn').html('SEE ALL');
      $('.hidden').css('display', 'block').animate({
        opacity: 1,
        height: '180px'
      }, 500);
      $('.events-btn').html('SEE FEWER');
    } else if (firstTwoOpen === false && allOpen === true) {
      firstTwoOpen = false;
      allOpen = false;
      $('.hidden')
        .animate({
          opacity: 0,
          height: '0px'
        }, 300, function () {
          $('.hidden').css('display', 'none');
        });

      $('.events-btn').html('SEE MORE');
    }
  });
}

/* -------------------------------------------------------
 ------------------ Add Activity Graphs ------------------
 -------------------------------------------------------*/

function setupGraphs () {
  // Sets Users button to Selected and loads Users chart
  $('#Select-Users-Graph').click(function () {
    $('#Select-Teams-Graph').removeClass('Selected');
    $('#Select-Users-Graph').addClass('Selected');
    var totalGraph = document.querySelector('#Team-User-Total-Graph svg');
    var bldngGraph = document.querySelector('#Team-User-Bldng-Graph svg');
    var roadsGraph = document.querySelector('#Team-User-Roads-Graph svg');
    totalGraph.parentNode.removeChild(totalGraph);
    bldngGraph.parentNode.removeChild(bldngGraph);
    roadsGraph.parentNode.removeChild(roadsGraph);
    // Gets main hashtag on each partner page via team.html
    getUserActivityStats(PT.mainHashtag);
  });

  // Sets Teams button to Selected and loads Teams chart
  $('#Select-Teams-Graph').click(function () {
    $('#Select-Users-Graph').removeClass('Selected');
    $('#Select-Teams-Graph').addClass('Selected');
    var totalGraph = document.querySelector('#Team-User-Total-Graph svg');
    var bldngGraph = document.querySelector('#Team-User-Bldng-Graph svg');
    var roadsGraph = document.querySelector('#Team-User-Roads-Graph svg');
    totalGraph.parentNode.removeChild(totalGraph);
    bldngGraph.parentNode.removeChild(bldngGraph);
    roadsGraph.parentNode.removeChild(roadsGraph);
    // Gets hashtag array on each partner page via team.html
    getGroupActivityStats(PT.subHashtags);
  });
}

// Returns svg link to Missing Maps user endpoint
function generateUserUrl (userName, userId) {
  const userUrl = 'http://www.missingmaps.org/users/#/' + userId;
  return '<a xlink:href="' + userUrl + '" target="_blank" style="text-decoration:none">' + userName + '</a>';
}

function getUserActivityStats (hashtag) {
  // Connect hashtags to /top-users/ Missing Maps API endpoint
  const url = 'http://osmstats.redcross.org/top-users/' + hashtag;

  $.getJSON(url, function (userData) {
    // For each user, collect the total edits across all categories
    const totalSum = Object.keys(userData).map(function (user) {
      const totalEdits = Math.round(Number(userData[user].all_edits));
      return {name: generateUserUrl(user, userData[user].user_number), value: totalEdits};
    }).sort((a, b) => b.value - a.value);

    // For each user, sum the total building edits
    const bldngSum = Object.keys(userData).map(function (user) {
      const bldngEdits = Math.round(Number(userData[user].buildings));
      return {name: generateUserUrl(user, userData[user].user_number), value: bldngEdits};
    }).sort((a, b) => b.value - a.value);

    // For each user, sum the total road kilometers edited
    const roadsSum = Object.keys(userData).map(function (user) {
      const roadsEdits = Math.round(Number(userData[user].road_kms));
      return {name: generateUserUrl(user, userData[user].user_number), value: roadsEdits};
    }).sort((a, b) => b.value - a.value);

    // Spawn a chart function with listening events for each of the metrics
    var c1 = new Barchart(totalSum, '#Team-User-Total-Graph');
    var c2 = new Barchart(bldngSum, '#Team-User-Bldng-Graph');
    var c3 = new Barchart(roadsSum, '#Team-User-Roads-Graph');

    // On window resize, run window resize function on each chart
    d3.select(window).on('resize', function () {
      c1.resize();
      c2.resize();
      c3.resize();
    });
  });
}

// Returns svg link to Missing Maps leaderboard endpoint
function generateHashtagUrl (hashtag) {
  const hashtagUrl = 'http://www.missingmaps.org/leaderboards/#/' + hashtag;
  return '<a xlink:href="' + hashtagUrl + '" target="_blank" style="text-decoration: none">#' + hashtag + '</a>';
}

function getGroupActivityStats (hashtags) {
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
      return {name: generateHashtagUrl(ht), value: sum};
    }).sort((a, b) => b.value - a.value);

    // For each hashtag, sum the total building edits
    const bldngSum = hashtags.map(function (ht) {
      const vals = hashtagData[ht];
      const sum = Math.round(Number(vals.building_count_add) +
                  Number(vals.building_count_mod));
      return {name: generateHashtagUrl(ht), value: sum};
    }).sort((a, b) => b.value - a.value);

    // For each hashtag, sum the total road kilometers edited
    const roadsSum = hashtags.map(function (ht) {
      const vals = hashtagData[ht];
      const sum = Math.round(Number(vals.road_km_add) +
                  Number(vals.road_km_mod));
      return {name: generateHashtagUrl(ht), value: sum};
    }).sort((a, b) => b.value - a.value);

    // Spawn a chart function with listening events for each of the metrics
    var c1 = new Barchart(totalSum, '#Team-User-Total-Graph');
    var c2 = new Barchart(bldngSum, '#Team-User-Bldng-Graph');
    var c3 = new Barchart(roadsSum, '#Team-User-Roads-Graph');

    // On window resize, run window resize function on each chart
    d3.select(window).on('resize', function () {
      c1.resize();
      c2.resize();
      c3.resize();
    });
  });
}

function Barchart (data, targetElement) {
  // Setting margins and size using Bostock conventions for future
  // ease of use, although currently leaving margins at 0
  let margin = {top: 0, right: 0, bottom: 0, left: 0};
  var width = parseInt(d3.select(targetElement).style('width'), 10);
  width = width - margin.left - margin.right;
  let height = 220;
  let barPadding = 60 / data.length;
  let barHeight = (height - margin.top - margin.bottom) / data.length - barPadding;

  // If more than 10 records...
  if (data.length > 10) {
    // freeze dynamic sizing of bars and begin expanding the svg height instead
    barPadding = 60 / 10;
    barHeight = (height - margin.top - margin.bottom) / 10 - barPadding;
    height = height + ((barPadding + barHeight) * (data.length - 10));
    // Enable "Show More" functionality
    const offset = -((data.length - 10) * (barPadding + barHeight)) - 12;
    let expanded = false;
    $('.teams-btn')
      .removeClass('hidden')
      .click(function () {
        const graphs = $('.Team-User-Graph > svg');
        if (expanded === false) {
          $('.teams-btn').html('SHOW PREVIOUS TEAMS');
          graphs.animate({marginTop: offset}, 300);
          expanded = true;
        } else if (expanded === true) {
          $('.teams-btn').html('SHOW NEXT TEAMS');
          graphs.animate({marginTop: 0}, 300);
          expanded = false;
        }
      });
  }

  // Define scales
  const x = d3.scale.linear()
    .range([0, width])
    .domain([0, d3.max(data, (d) => d.value)]);

  // Create the chart
  var chart = d3.select(targetElement).append('svg')
    .style('width', (width + margin.left + margin.right) + 'px')
    .style('height', height + 'px')
  .append('g')
    .attr('transform', 'translate(' + [margin.left, margin.top] + ')');

  d3.select(chart.node().parentNode)
    .style('height', height + 'px');

  // Render the chart, add the set the bar groups
  var bars = chart.selectAll('.bar')
    .data(data)
  .enter().append('g')
    .attr('class', 'bar')
    .attr('transform', (d, i) => {
      return `translate(0,${i * (barHeight + barPadding)})`;
    });

  // Add the bar rectangles
  bars.append('rect')
    .attr('class', 'bars')
    .attr('height', barHeight)
    .attr('width', (d) => x(d.value));

  // Add the name labels
  bars.append('text')
    .attr('class', 'Graph-Label-Name')
    .attr('x', 5)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .html((d) => d.name)
    .style('fill', '#606161');

  // Add the value labels
  bars.append('text')
    .attr('class', 'Graph-Label-Value')
    .attr('x', width - 20)
    .attr('y', barHeight / 2)
    .attr('dy', '.35em')
    .text((d) => d.value.toLocaleString())
    .attr('text-anchor', 'end')
    .style('fill', '#606161');

  this.resize = function () {
    // Recalculate width of chart
    width = parseInt(d3.select(targetElement).style('width'), 10);
    width = width - margin.left - margin.right;

    // Update svg size
    d3.select(targetElement).select('svg')
      .style('width', (width + margin.left + margin.right) + 'px');

    // Update the scale of chart
    x.range([0, width]);

    // Update the bar width
    chart.selectAll('rect.bars')
      .attr('width', (d) => x(d.value));

    // Update the value text position
    chart.selectAll('text.Graph-Label-Value')
      .attr('x', width - 20);
  };
}

/* -------------------------------------------------------
 ---------------- Add Flickr Carousel --------------------
 -------------------------------------------------------*/

function getImgs (flickrApiKey, flickrSetId) {
  // Builds API URL to fetch from
  var URL = 'https://api.flickr.com/services/rest/' +  // Wake up the Flickr API gods.
    '?method=flickr.photosets.getPhotos' +  // Get photo from a photoset. http://www.flickr.com/services/api/flickr.photosets.getPhotos.htm
    '&api_key=' + flickrApiKey + // API key. Get one here: http://www.flickr.com/services/apps/create/apply/
    '&photoset_id=' + flickrSetId +  // The set ID.
    '&privacy_filter=1' +  // 1 signifies all public photos.
    '&format=json&nojsoncallback=1'; // Bringing it in as a JSON.

  $.getJSON(URL, function (data) {
    $.each(data.photoset.photo, function (i, item) {
      // Creating the image URL. Info: http://www.flickr.com/services/api/misc.urls.html
      var imgSrc = 'https://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_b.jpg';

      // Add images in individual <li> elements to HTML
      var imgThumb = $('<li><img src=' + imgSrc + '></img></li>');
      // Limits to only the most recent 30 photos for simplicity.
      if ($('.flickr-hit li').length < 30) {
        $(imgThumb).appendTo('.flickr-hit');
      }
    });
    // Adds flexslider to Community section
    $('.flexslider').flexslider({
      controlNav: true,
      directionNav: true,
      slideshowSpeed: 6000,
      prevText: '<i class="fa fa-chevron-left" aria-hidden="true"></i>',
      nextText: '<i class="fa fa-chevron-right" aria-hidden="true"></i>'
    });
    $('.photo-width-fix ol').prependTo('.Community-Navigation');
  });
}

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 ---------------------------------------------------------
 --------------------- Setup Project ---------------------
 -------------------------------------------------------*/

// Populate the primary stats in hero via Missing Maps API
getPrimaryStats(PT.mainHashtag);
// Populate project carousel via HOTOSM Tasking Manager API
getProjects(PT.hotProjects);
// Adds event functionality (hide and show)
eventsFunctionality();
// Sets up switcher/ loader for group and user graphs
setupGraphs();
// Populates initial groups graph via Missing Maps API
getGroupActivityStats(PT.subHashtags);
// Populate the Flickr carousel
getImgs(PT.flickrApiKey, PT.flickrSetId);
