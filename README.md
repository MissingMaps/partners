
# missingmaps partner pages
 
 
### Creating a new Partner Page
 
First clone this repo.
 
Rename the new repo mm-partner-[_partner name_] and push it to MissingMaps.
 
#### Updating Partner Information
 
Partner information is located in `partner-info.md`. For updating:
 
| Field         | Changes  | 
| ------------- |:-------------:|
| name      | Partner name | 
| logo      | Link to partner logo      | 
| primary-hashtag | Hashtag for the partner  |
| flickr | API link for the partners flickr account |
| teams | List of team hashtags to be tracking. |
| projects | List of project ids from tasking manager. |
  
### Adding events
 
Events are stored in the `app/_data` folder. To add an event, edit the events.csv.
 
When updating the csv of events:
 
- Use `yyyy-mm-dd` format for date. The year must be 4 digits (may need to adjust display settings in Microsoft Excel). Otherwise, 15 may be interpreted as 1915 instead of 2015.
 
```
new Date("9/15/15")
Date 1915-09-15T04:00:00.000Z
new Date("9/15/2015")
Date 2015-09-15T04:00:00.000Z
```
- Fields can be left blank if data does not exist or is TBD
 
- Include the two letter country code to include the correct flag
 
 
 
## Development
 
### Environment
To set up the development environment for this website, you'll need to install the following on your system:
 
- [Node and npm](http://nodejs.org/)
- Ruby and [Bundler](http://bundler.io/), preferably through something like [rvm](https://rvm.io/)
- Gulp ( $ npm install -g gulp )
 
After these basic requirements are met, run the following commands in the website's folder:
```
$ npm install
```
Will also run `bundle install`
 
### Getting started
 
```
$ gulp serve
```
Compiles the compass files, javascripts, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.
 
The `_config-dev.yml` file will be loaded alongside `_config.yml`.
 
### Other commands
Clean the compiled site. I.e. the `_site` folder
```
$ gulp clean
```
 
Compile the compass files, javascripts, and builds the jekyll site using `_config-dev.yml`.
Use this instead of ```gulp serve``` if you don't want to watch.
```
$ gulp
```
 
Compiles the site loading the `_config-stage.yml` alongside `_config.yml`. The javascript files will be minified.
```
$ gulp stage
```
 
Compiles the site loading the `_config-prod.yml` alongside `_config.yml`. The javascript files will be minified.
```
$ gulp prod
```
 
Brought to you by Segment.io — Powered by Firebase

missingmaps partner pages

Creating a new Partner Page
First clone this repo.

Rename the new repo mm-partner-[partner name] and push it to MissingMaps.

Updating Partner Information
Partner information is located in partner-info.md. For updating:

| Field | Changes | | ------------- |:-------------:| | name | Partner name | | logo | Link to partner logo | | primary-hashtag | Hashtag for the partner | | flickr | API link for the partners flickr account | | teams | List of team hashtags to be tracking. | | projects | List of project ids from tasking manager. |

*Will need to confirm we can pass array’s in Jekyll. Otherwise we can break these out into independent csv or md files.

Adding events
Events are stored in the app/_data folder. To add an event, edit the events.csv.

When updating the csv of events:

Use yyyy-mm-dd format for date. The year must be 4 digits (may need to adjust display settings in Microsoft Excel). Otherwise, 15 may be interpreted as 1915 instead of 2015.
new Date("9/15/15")
Date 1915-09-15T04:00:00.000Z
new Date("9/15/2015")
Date 2015-09-15T04:00:00.000Z
Fields can be left blank if data does not exist or is TBD
Include the two letter country code to include the correct flag
Development

Environment
To set up the development environment for this website, you’ll need to install the following on your system:

Node and npm
Ruby and Bundler, preferably through something like rvm
Gulp ( $ npm install -g gulp )
After these basic requirements are met, run the following commands in the website’s folder:

$ npm install
Will also run bundle install

Getting started
$ gulp serve
Compiles the compass files, javascripts, and launches the server making the site available at http://localhost:3000/ The system will watch files and execute tasks whenever one of them changes. The site will automatically refresh since it is bundled with livereload.

The _config-dev.yml file will be loaded alongside _config.yml.

Other commands
Clean the compiled site. I.e. the _site folder

$ gulp clean
Compile the compass files, javascripts, and builds the jekyll site using _config-dev.yml. Use this instead of gulp serve if you don’t want to watch.

$ gulp
Compiles the site loading the _config-stage.yml alongside _config.yml. The javascript files will be minified.

$ gulp stage
Compiles the site loading the _config-prod.yml alongside _config.yml. The javascript files will be minified.

$ gulp prod
ChartBeat
Google AdWords Conversion
Google Analytics
Google Dynamic Remarketing
Segment
Typekit by Adobe