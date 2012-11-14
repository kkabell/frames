# frames.js for 23 Video
A jQuery plugin for creating dynamic thumbnails on a 23 Video website

## What is frames.js?
frames.js is a simple jQuery plugin that makes the thumbnails on your 23 Video website cycle through a number of keyframes from the corresponding video when hovered over (much like thumbnails on Dailymotion do). Use it as a handy preview feature, or just as a cool design element.

## Usage

### Import jQuery and frames.js
As frames.js is still in the early stages of development, I recommend downloading a copy of the current version, and uploading it to your video website. This way, you don't risk breaking anything when frames.js is updated, and you can instead update manually at your convenience.

In the `<head>` section of your video website, import jQuery and frames.js, either by adding a HTML-block in the layout grid, or by modifying the master template.

   <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
   <script type="text/javascript" src="/files/frames.js"></script>

If you are using other JavaScript libraries or frameworks that utilizes $ as a function or variable name (like Prototype that currently is default on a 23 Video site), be sure to relinquish jQuery's control of this variable by calling `jQuery.noConflict()` after importing jQuery:

   <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
   <script type="text/javascript">
   	   jQuery.noConflict();
   </script>
   <script type="text/javascript" src="/files/frames.js"></script>

### Prepare `data-length` attribute
frames.js needs to know the length of each video to be able to request frames correctly. This is done by adding a `data-length` attribute to `<img>` tags that show the thumbnails. Simply edit the template for a thumbnails layout block or a video page and locate the `<img>` tag.
So if the `<img>` currently looks something like:

   <img src="{{photo.thumbnail_url}}" width="{{photo.thumbnail_width}}" height="{{photo.thumbnail_height}}" />

Then add the `data-length` attribute and parse the liquid variable `photo.video_length` as the value:

   <img src="{{photo.thumbnail_url}}" width="{{photo.thumbnail_width}}" height="{{photo.thumbnail_height}}" data-length="{{photo.video_length}}" />

### Activate frames.js
You active frames.js by calling the `frames()` function on a jQuery collection of thumbnail images:

    jQuery(".view-item img").frames();

Be sure to include a parent to the image in the css-selector (in this case `.view-item`) to avoid the script attempting to manipulate non-thumbnail images like logos and other graphical elements.

### Options
frames.js comes with a set of options that allows you to customize the plugin. Currently, you can use the following options:

* `frameCount`: The number of keyframes the plugin should load and cycle through. *Default: 6*.
* `interval`: The time in milliseconds that each frame should be shown before moving on to the next. *Default: 1500*.
* `hoverElement`: Defines a selector for an element that is placed on top of the actual thumbnail and hence should fire the mouseenter / mouseleave events. *Default: undefined*

The options are passed to the `frames()` function as an object. So if I wanted to have frames.js cycle through 8 keyframes, each shown in 1 second and triggered by hovering over an element with the class "playicon", I would activate frames.js using the following:

    jQuery(".view-item").frames({
	frameCount: 8,
	interval: 1000,
	hoverElement: ".playicon"
    });