wysihtml5-image-upload
======================

Bootstrap Wysihtml5 with Custom Image Insert and Upload 
====

Update: Mr Roger (rcode5) has merge the upload code with his code. Use [rcode5's code](https://github.com/rcode5/image-wysiwyg-sample) for the latest version.
If you're trying to customize your own, is [static/custom_image_wysihtml5](https://github.com/rcode5/image-wysiwyg-sample/tree/master/static). That's where the magic happens.
Use the code below for handlers (example) in PHP. You can upload the files to a (local) webserver to get your own demo while 
rcode5's code builds a simple [Sinatra App](http://www.sinatrarb.com/) to demostrate the code.

This sample code (powered by [W3Masters](http://www.w3masters.nl/) and [Twitter Bootstrap](http://twitter.github.com/bootstrap/) demonstrates how you can extend the nice image chooser dialog to the [Bootstrap-wysihtml5](https://github.com/jhollingworth/bootstrap-wysihtml5) wysiwyg editor by [rcode5](http://rcode5.wordpress.com/2012/11/01/custom-image-upload-modal-with-bootstrap-wysihtml5/comment-page-1/) with file upload.
File upload is provide by [jQuery.upload](https://github.com/bassjobsen/jqueryupload).

To see te code in action try [the demo](http://www.w3masters.nl/bootstrap-wysihtml5/).

To use this code you have to write to server side handlers. One gives you the file list (json). 
The second handles the file uploads and returns result in json too.

Files to reference
------------------

```html
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/css/bootstrap-combined.min.css" rel="stylesheet">
<link href="//cdn.jsdelivr.net/bootstrap.wysihtml5/0.0.2/bootstrap-wysihtml5-0.0.2.css" rel="stylesheet">
<!-- Placed at the end of the document so the pages load faster -->
<script type="text/javascript" src="//cdn.jsdelivr.net/wysihtml5/0.3.0/wysihtml5-0.3.0.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.0/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.2/underscore-min.js"></script>
<script type="text/javascript" src="js/bootstrap-wysihtml5-0.0.2.js"></script>
<script type="text/javascript" src="js/custom_image_and_upload_wysihtml5.js"></script>
<script type="text/javascript" src="js/jqueryupload.js"></script>
```


Usage
-----
```html
<textarea class="wysi" placeholder="Enter text ..."></textarea>
```


Handlers
--------
You have to write your own handlers. See examples files included: imagelist.php and upload.php

imagelist.php
-------------
When you change the name / uri you have to change it in custom_image_and_upload_wysihtml5.js too
returns a list of images in json format
```json
[{"file":"http://placehold.it/50/B9E4FB/260b50","caption":"This image is 50x50 and uses colors #B9E4FB and #260b50","foreground":"B9E4FB","background":"260b50"},
{"file":"http://placehold.it/60/B09F62/11462b","caption":"This image is 60x60 and uses colors #B09F62 and #11462b","foreground":"B09F62","background":"11462b"},
{"file":"http://placehold.it/70/6ECC43/00374a","caption":"This image is 70x70 and uses colors #6ECC43 and #00374a","foreground":"6ECC43","background":"00374a"}]
```


upload.php 
----------
When you change the name / uri you have to change it in custom_image_and_upload_wysihtml5.js too
A multipart/form-data request is send to the handler like: Content-Disposition: form-data; name="file1"; filename="images.png" you can catch this with any server side language.
Returns status:0 on failure or status:1 on success both json encoded.
On success also information about the file is send.
Example return value:
```json
{"status":1,"file":"http://placehold.it/50/B9E4FB/260b50","caption":"This image is 50x50 and uses colors #B9E4FB and #260b50","foreground":"B9E4FB","background":"260b50"}
```
