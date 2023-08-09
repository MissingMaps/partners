/* -------------------------------------------------------
 --------------- Add HOT Project Carousel ----------------
 -------------------------------------------------------*/
const statsApi = 'https://stats.now.ohsome.org/api';
const tasksApi = 'https://tasking-manager-tm4-production-api.hotosm.org/api/v2';

// Fetch Project data from Tasking Manager API
function getProjects (projects) {
  // Add Flexslider to Projects Section
  $('.Projects-slider').flexslider({
    animation: 'slide',
    directionNav: true,
    slideshowSpeed: 6000000,
    prevText: '',
    nextText: ''
  });
  $('.flex-next').prependTo('.HOT-Nav-Projects');
  $('.flex-control-nav').prependTo('.HOT-Nav-Projects');
  $('.flex-prev').prependTo('.HOT-Nav-Projects');

  if (projects.length === 1) {
    $('.flex-next').css('display', 'none');
  }

  projects.forEach(function (project, i) {
    const url = tasksApi + `/projects/${project}/queries/summary/`;
    $.getJSON(url, function (projectData) {
      makeProject(projectData, i + 2);
    })
    .fail(function (err) {
      console.warn(`WARNING >> Project #${project} could not be accessed at ${url}.\n` +
                   'The server returned the following message object:', err);
      makePlaceholderProject(project, i + 2);
    });
  });
}

// Update cards with necessary project details
function makeProject (project, projectOrder) {
  const projDone = Math.round(project.percentMapped);

  // Updates Progress Bar
  $(`ul li:nth-child(${projectOrder}) .HOT-Progress`).addClass('projWidth' + projectOrder);
  $('.HOT-Progress').append(`<style>.projWidth${projectOrder}:before{ width: ${projDone}%;}</style>`);

  // modifies start mapping button if project is not published
  // if (project.status !== "PUBLISHED") {
  //   $(`ul li:nth-child(${projectOrder}) .HOT-Title a`).html(`${project.status}`);
  //   $(`ul li:nth-child(${projectOrder}) .HOT-Title a`).attr('href',`#`);
  //   $(`ul li:nth-child(${projectOrder}) .HOT-Title a`).addClass(`disabled`);
  //   $(`ul li:nth-child(${projectOrder}) .HOT-Description a`).remove();
  // }

  // Adds Project variables to the cards
  $(`ul li:nth-child(${projectOrder}) .HOT-Title p`).html(`<b>${project.projectId} - ${project.projectInfo.name}</b>`);
  $(`ul li:nth-child(${projectOrder}) .title`).html(`${project.projectInfo.name} (#${project.projectId})`);
  $(`ul li:nth-child(${projectOrder}) .HOT-Progress`).html(`<p>${projDone}%</p>`);
  $(`ul li:nth-child(${projectOrder}) .HOT-Progress`).attr('title', `${projDone}% complete`);
  $(`ul li:nth-child(${projectOrder}) .HOT-Details .completeness`).html(`<strong>${projDone}%</strong> complete`);
  $(`ul li:nth-child(${projectOrder}) .HOT-Map`).attr('id', 'Map-' + project.projectId);

  // Drop a map into the HOT-Map div
  addMap(project.projectId);
}

// Adds placeholder/ warning formatting to project carousel entry in the event
// that a project cannot be retrieved from the HOT Tasking Manager API
function makePlaceholderProject (projectId, projectOrder) {
  // Adds error title
  $(`ul li:nth-child(${projectOrder}) .HOT-Title p`)
    .html(`<i class="ico icon collecticon-sign-danger"></i>
<b>HOT Project #${projectId} Not Active/Not Found in HOT Tasking Manager</b>`);

  // Hides Tasking Manager Contribute button
  $('#TM-Contribute-Btn-' + projectId).css('display', 'none');
  $(`#HOT-Title-${projectId} p`).css('width', '100%');

  // Generate issue information for Github tracker
  const ghIssueTitle = `HOT Tasking Manager endpoint failure in ${PT.mainHashtag} partner page`;
  const ghIssueBody = `Project ${projectId} is no longer indexed in the HOT
 Tasking Manager, so it should be removed from the ${PT.mainHashtag} partner
 page variable settings.`;

  // Add explanatory error text
  const errorHtml = `Uh oh, it looks like <a href="` + tasksApi + `/projects/${project};${projectId}"
 target="_blank">Project #${projectId}</a> has been removed from the HOT Tasking Manager.
 <a href="https://github.com/MissingMaps/partners/issues/new?title=${ghIssueTitle}
 &body=${ghIssueBody}" target="_blank">Click here</a> to report an issue or
 <a href="https://tasks.hotosm.org/" target="_blank">here</a>
 to search for more projects.`;

  $(`ul li:nth-child(${projectOrder}) .HOT-Description p`).html(errorHtml);

  // Remove loading spinners and add placeholder background
  $(`ul li:nth-child(${projectOrder}) .HOT-Map`).empty().addClass('placeholder');
  $(`ul li:nth-child(${projectOrder}) .HOT-Progress `).css('display', 'none');
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

  const taskStatus = feature.properties.taskStatus;
  if (taskStatus === "READY") {
    symbology.fillColor = '#ffffff'; //white
    symbology.fillOpacity = 0.0;  //transparent
  } else if (taskStatus === "INVALIDATED") {
    symbology.fillColor = '#fceca4'; //yellow
  } else if (taskStatus === "VALIDATED") {
    symbology.fillColor = '#40ac8c'; //green
  } else if (taskStatus === "LOCKED_FOR_MAPPING") {
    symbology.fillColor = '#ffffff'; //white
  } else if (taskStatus === "BADIMAGERY") {
   symbology.fillColor = '#d8dae4'; //grey
  } else if (["MAPPED", "LOCKED_FOR_VALIDATION"].includes(taskStatus)) {
    symbology.fillColor = '#ade6ef'; //blue
  }

  layer.setStyle(symbology);
}

function addMap (projectId) {
  // Connect HOT-OSM endpoint for tasking squares data
  const endpoint = tasksApi + `/projects/${projectId}/tasks/`;
  $.getJSON(endpoint, function (taskData) {
    // Remove loading spinners before placing map
    $('#Map-' + projectId).empty();

    // Initialize map
    const map = L.map('Map-' + projectId,
      {zoomControl: false}).setView([38.889931, -77.009003], 13);

    // Add tile layer
    L.tileLayer(mbBasemapUrl + '?access_token=' + mbToken, {
      attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map);

    // Remove 'Leaflet' attribution
    map.attributionControl.setPrefix('');

    // Add feature layer
    const featureLayer = L.geoJson(taskData, {
      onEachFeature: onEachFeature
    }).addTo(map);

    // Fit to feature layer bounds
    map.fitBounds(featureLayer.getBounds());

    // Disable drag and zoom handlers
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  });
}

/* -------------------------------------------------------
 ----------- Add Functionality to Events List  -----------
 -------------------------------------------------------*/

// Adds hide/ show functionality to events list (pre-generated by Jekyll)
function eventsFunctionality () {
  const eventsCount = $('.event-sub-container').length;
  var firstTwoOpen = false;
  var allOpen = false;

  if (eventsCount === 0) {
    $('.events-null').css('display', 'block');
  }
  if (eventsCount < 3) {
    $('.events-btn').css('display', 'none');
  }

  $('.events-btn').bind('click').click(function (event) {
    if (firstTwoOpen === false && allOpen === false) {
      firstTwoOpen = true;
      $('.hidden').slice(0, 2)
      .css('display', 'block').animate({
        opacity: 1,
        height: '190px'
      }, 500);
      if (eventsCount >= 5) {
        $('.events-btn').html('SEE ALL');
      } else {
        firstTwoOpen = false;
        allOpen = true;
        $('.events-btn').html('SEE FEWER');
      }
    } else if (firstTwoOpen === true && allOpen === false && eventsCount > 2) {
      firstTwoOpen = false;
      allOpen = true;
      $('.events-btn').html('SEE ALL');
      $('.hidden').css('display', 'block').animate({
        opacity: 1,
        height: '190px'
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
  // Sets Teams button to Selected, loads Teams graphs, reveals
  // "Show More Teams" button if applicable
  $('#Select-Teams-Graph').click(function () {
    $('#Select-Users-Graph').removeClass('Selected');
    $('#Select-Teams-Graph').addClass('Selected');
    teamUserLabel.text('Team');
    // Remove existing graphs
    removeExistingGraphs();
    // Gets hashtag array on each partner page via team.html
    getGroupActivityStats(PT.subHashtags);
  });
}


// Returns svg link to Missing Maps leaderboard endpoint
function generateHashtagUrl (hashtag) {
  const hashtagUrl = 'https://stats.now.ohsome.org/dashboard#hashtags=' + hashtag;
  return `<a xlink:href="${hashtagUrl}" target="_blank" style="text-decoration: none">#${hashtag}</a>`;
}

function getGroupActivityStats (hashtags, primaryHashtag) {
  // Connect hashtags to /group-summaries/ Missing Maps API endpoint
  const hashtagsString = [primaryHashtag].concat(hashtags).join(',');
  const url = statsApi + '/stats/' + hashtagsString;

  $.getJSON(url, function (hashtagData) {
    // If no hashtags contain data, remove the partner graphs entirely
    if ($.isEmptyObject(hashtagData)) {
      $('.Team-User-Container').css('display', 'none');
      console.warn('WARNING >> None of the secondary hashtags contain any ' +
                   'metrics according to the Missing Maps endpoint at ' +
                   statsApi + '/stats/' +
                   hashtagsString + '. The partner graphs will not be displayed.');
    } else {
      const primaryData = hashtagData[primaryHashtag];
      const primaryBuildingCount = primaryData.buildings;
      const primaryRoadCount = Math.round(primaryData.roads);

      // update the top-level stats in the hero
      if (primaryHashtag == 'aviva') {
        $('#stats-roadCount').html((primaryRoadCount + 7464).toLocaleString());
        $('#stats-buildingCount').html((primaryBuildingCount + 245546).toLocaleString());
        $('#stats-usersCount').html((primaryData.users + 999).toLocaleString());
        $('#stats-editsCount').html((primaryData.edits + 348243).toLocaleString());
      } else if (primaryHashtag == 'ourimpact') {
        $('#stats-roadCount').html((primaryRoadCount + 485).toLocaleString());
        $('#stats-buildingCount').html((primaryBuildingCount + 147356).toLocaleString());
        $('#stats-usersCount').html((primaryData.users + 1238).toLocaleString());
        $('#stats-editsCount').html((primaryData.edits + 153575).toLocaleString());
      } else if (primaryHashtag == 'factset22') {
        $('#stats-roadCount').html((primaryRoadCount + 2074).toLocaleString());
        $('#stats-buildingCount').html((primaryBuildingCount + 110152).toLocaleString());
        $('#stats-usersCount').html((primaryData.users + 1083).toLocaleString());
        $('#stats-editsCount').html((primaryData.edits + 127170).toLocaleString());
      } else if (primaryHashtag == 'dhl') {
        $('#stats-roadCount').html((primaryRoadCount + 27).toLocaleString());
        $('#stats-buildingCount').html((primaryBuildingCount + 37435).toLocaleString());
        $('#stats-usersCount').html((primaryData.users + 360).toLocaleString());
        $('#stats-editsCount').html((primaryData.edits + 37639).toLocaleString());
      } else {
        $('#stats-roadCount').html(primaryRoadCount.toLocaleString());
        $('#stats-buildingCount').html(primaryBuildingCount.toLocaleString());
        $('#stats-usersCount').html(primaryData.users.toLocaleString());
        $('#stats-editsCount').html(primaryData.edits.toLocaleString());
      }
      for (const [key, value] of Object.entries(hashtagData)) {
        if (value.edits === 0){
          delete hashtagData[key]
        }
      }

      // For each hashtag, sum the total edits across all categories,
      // skipping over hashtags if there are no metrics (this shouldn't
      // happen at the API level, but good to use best-practices).
      // The reduce patterns below are compareable to Array.prototype.map,
      // with the difference that there does not need to be a 1:1 match
      // between input and output array length
      const hashtags = Object.keys(hashtagData).filter(x => x !== primaryHashtag);

      const totalSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: Math.round(vals.edits)});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      // For each hashtag, sum the total building edits,
      // skipping over hashtags if there are no metrics
      const bldngSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {                      
          acc.push({name: ht, decorate: generateHashtagUrl, value: vals.buildings});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      // For each hashtag, sum the total road kilometers edited,
      // skipping over hashtags if there are no metrics
      const roadsSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: Math.round(vals.roads)});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);


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
    }
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
    // ...freeze dynamic sizing of bars and begin expanding the svg height instead
    barPadding = 60 / 10;
    barHeight = (height - margin.top - margin.bottom) / 10 - barPadding;
    height = height + ((barPadding + barHeight) * (data.length - 10));
    // ...enable "Show More" functionality; button appears which allows
    // for panning up and down the length of svg bar graph
    const offset = -((data.length - 10) * (barPadding + barHeight)) - 12;
    let expanded = false;

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
    .text(d => d.name)
    .html(d => d.decorate(d.name))
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
      var imgSrc = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;

      // Add images in individual <li> elements to HTML
      var imgThumb = $(`<li><img src=${imgSrc}></img></li>`);
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
      prevText: '<i class="ico icon collecticon-chevron-left"></i>',
      nextText: '<i class="ico icon collecticon-chevron-right"></i>'
    });
    $('.photo-width-fix ol').prependTo('.Community-Navigation');
  });
}

function checkHashtags (hashtags) {
  if (hashtags.length < 1) {
    console.warn('WARNING >> There are not enough secondary hashtags listed ' +
                 'in order to represent differences in contribution level ' +
                 'between partners. The partner graphs will not be displayed.');
    $('.Team-User-Container').css('display', 'none');
  }
}

function showAlternatePoster () {
  // get all custom videos
  const videos = $('.video');

  videos.on('click', function () {
    const el = $(this);
    let comment;

    // el.contents() is an Object, not an array, so we can't use find()
    for (var i = 0; i < el.contents().length; i++) {
      if (el.contents()[i].nodeType === 8 && el.contents()[i].textContent.match(/<iframe/)) {
        comment = el.contents()[i].textContent;
        break;
      }
    }

    if (comment != null) {
      el.addClass('player').html(comment);
      el.off('click');
    }
  });
}

// returns the total sum of the hashtg sum counts for buildings and roads in getGroupActivityStats
function statsSum ( obj ) {
  return Object.keys( obj ).reduce(function (sum, key) {
    return sum + obj[key].value;
  }, 0);
}

function getGroupActivityStatsSubHashtag (hashtags, primaryHashtag) {
  // Connect hashtags to /group-summaries/ Missing Maps API endpoint
  const hashtagsString = [primaryHashtag].concat(hashtags).join(',');
  const url = statsApi + '/stats/' + hashtagsString;

  $.getJSON(url, function (hashtagData) {
    // If no hashtags contain data, remove the partner graphs entirely
    if ($.isEmptyObject(hashtagData)) {
      $('.Team-User-Container').css('display', 'none');
      console.warn('WARNING >> None of the secondary hashtags contain any ' +
                   'metrics according to the Missing Maps endpoint at ' +
                   statsApi + '/stats/' +
                   hashtagsString + '. The partner graphs will not be displayed.');
    } else {
      const primaryData = hashtagData[primaryHashtag];


      // For each hashtag, sum the total edits across all categories,
      // skipping over hashtags if there are no metrics (this shouldn't
      // happen at the API level, but good to use best-practices).
      // The reduce patterns below are compareable to Array.prototype.map,
      // with the difference that there does not need to be a 1:1 match
      // between input and output array length
      const hashtags = Object.keys(hashtagData).filter(x => x !== primaryHashtag);

      const totalSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: Math.round(vals.edits)});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      // For each hashtag, sum the total building edits,
      // skipping over hashtags if there are no metrics
      const bldngSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: vals.buildings});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      // Sum all the building edits for all the subhashtags combined
      const subhashtagsBldngCount = statsSum(bldngSum);

      // For each hashtag, sum the total road kilometers edited,
      // skipping over hashtags if there are no metrics
      const roadsSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: Math.round(vals.roads)});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      // Sum all the building edits for all the subhashtags combined
      const subhashtagsRoadsCount = statsSum(roadsSum);

      const usersSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: vals.users});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      const usersTotal = statsSum(usersSum);

      const contributionsSum = hashtags.reduce(function (acc, ht) {
        const vals = hashtagData[ht];
        if (!$.isEmptyObject(vals)) {
          acc.push({name: ht, decorate: generateHashtagUrl, value: vals.edits});
        }
        return acc;
      }, []).sort((a, b) => b.value - a.value);

      const editsTotal = statsSum(contributionsSum);

            // update the top-level stats in the hero
      $('#stats-roadCount').html(subhashtagsRoadsCount.toLocaleString());
      $('#stats-buildingCount').html(subhashtagsBldngCount.toLocaleString());
      $('#stats-usersCount').html(usersTotal.toLocaleString());
      $('#stats-editsCount').html(editsTotal.toLocaleString());

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
    }
  });
}

/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 ---------------------------------------------------------
 --------------------- Setup Project ---------------------
 -------------------------------------------------------*/
// Global Mapbox variables
const mbToken = 'pk.eyJ1IjoiYW1lcmljYW5yZWRjcm9zcyIsImEiOiJjaXF0MGpqY3AwMDFmZnJqNndodTYxNjZiIn0.2erhHFDW7G5Cvauho3vLMw';
const mbBasemapUrl = 'https://api.mapbox.com/styles/v1/americanredcross/ckl71lzvm0xh717nn6j10rmyt/tiles/{z}/{x}/{y}';

// Populate project carousel via HOTOSM Tasking Manager API
getProjects(PT.hotProjects);
// Adds event functionality (hide and show)
eventsFunctionality();
// Check to see if there are hashtags to view
checkHashtags(PT.subHashtags);
// Sets up switcher/ loader for group and user graphs
setupGraphs();
// Populates hero + initial groups graph via Missing Maps API
if (PT.mainHashtag == 'salesforcels' || PT.mainHashtag == 'americangeo') {
  getGroupActivityStatsSubHashtag(PT.subHashtags, PT.mainHashtag);
} else {
  getGroupActivityStats(PT.subHashtags, PT.mainHashtag);
}

// Populate the Flickr carousel
if (PT.flickrApiKey && PT.flickrSetId) {
  getImgs(PT.flickrApiKey, PT.flickrSetId);
}

showAlternatePoster();


/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 ---------------------------------------------------------
 --------------------- Get Client IP ---------------------
 -------------------------------------------------------*/

 var settings = {
   "async": true,
   "crossDomain": true,
   "url": "https://extreme-ip-lookup.com/json/",
   "method": "GET"
 }

 $.ajax(settings).done(function (response) {
   console.log(response);

   if (response.countryCode === 'US') {
     $('#world').hide()
     $('#usa').show()
   } else {
     $('#world').show()
     $('#usa').hide()
   }
 });
