# MissingMaps Partner Pages

This repo contains the code for MissingMaps partner pages. Each page is a unique view of a MissingMaps partner and their contributions to MissingMaps projects. 
 
### Creating a new Partner Page
 
1. Create new `partner.md` file in the `_partner` folder. Rename according to the partner and how you want the URL to look. For example, `my-new-partner.md` will have the url `missingmaps.org/partners/my-new-partner`. Use dashes `-` instead of underscores. 

2. All partner page data is contained within the yml frontmatter. Copy and paste the `partner-example.md` file. Edit all variables with new partner information. See Updating Partner Information below for details on each variable. 

3. Add Partner Logo (SVG format) to to the `assets/graphics/content/logos` folder.

4. Create a new partner folder in the `_data` folder. Each folder name must match the name of the file within the `_partner` folder.

5. Create a `events.csv` file within each new `_data` folder. See Adding Events below for more details on the `events.csv` file.
 
#### Updating Partner Information
 
Partner information is located in `app > _partners`. For updating, duplicate partner_example and save the file as [_partner.name_].md

To update the page with the partner related information, edit the following fields:

**Site Config**

| Field         | Changes  |
| ------------- |:-------------:|
| permalink      | This will be the end of the URL the partner page can be located at. Using  /[_partner.name_]/ will make the link **missingmaps.com/partner/_partner.name_/**. | 
| id      | What will be used to match the partner page to the events.csv. Needs to be the same as the folder containing this partner's events. | 
| name      | Partner name. Displayed on the main page under logo. | 
| logo      | Link to partner logo      | 

**Social**
These default to MissingMaps properties, and can be left as is if the partner doesn't have any of the following social accounts.

| Field         | Changes  | 
| ------------- |:-------------:|
| flickr | Link to Flickr account of the Partner  |
| twitter | Link to Twitter account for the Partner |
| facebook | Link to Facebook link for the Partner. |
| benevity | Link to Benevity link for the Partner. |

**Community**

| Field         | Changes  |
| ------------- |:-------------:|
| apikey | API key for the page. Page creators can get one for their accounts [here](https://www.flickr.com/services/api/misc.api_keys.html).   |
| setId | Id for the photo album partner wants displayed on their page. For example the id for the album at  https://www.flickr.com/photos/126636925@N06/albums/72157665243501444 is **72157665243501444**. The album must be made public for the api call to work. |

**OSMStats**

| Field         | Changes  | 
| ------------- |:-------------:|
| primary-hashtag | The overall hashtag for the partner. Used to populate the primary stats at the top of the page. |
| subhashtags | Subhashtags that create the 'team' section. Must be in the format set in the example partner.

**Partner Projects**
To display properly, this section must follow the format set in the example partner page of

```
tm-projects:
  - id: ###1
    desc: "description of project 1"
  - id: ###2
    desc: "description of project 2"
```

| Field         | Changes  | 
| ------------- |:-------------:|
| id | The id for the HOT Task. For http://tasks.hotosm.org/project/1805, the id would be **1805**. |
| desc | Description of the project. We recommend using the text from the [Tasking Manager](http://tasks.hotosm.org/). The site will limit how many characters are shown automatically. |

### Adding events
 
Events are stored in the `app/_data` folder. To add an event, edit the events.csv. You'll want to create a new folder that shares a name with the **partner id**.
 
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