var xhrFetchingImages;

wysiHelpers = {
  getImageTemplate: function() {
    /* this is what goes in the wysiwyg content after the image has been chosen */
    var tmpl;
    var imgEntry = "<img src='<%= url %>' alt='<%= caption %>'>";
    tmpl = _.template("<div class='shrink_wrap'>" +
                      imgEntry +
                      "</div>" +
                      "<p class='credit'><%= caption %></p>" +
                      "<hr>");
    return tmpl;
  }
};

bootWysiOverrides = {
  initInsertImage: function(toolbar) {
    var self = this;
    var insertImageModal = toolbar.find('.bootstrap-wysihtml5-insert-image-modal');
    var urlInput = insertImageModal.find('.bootstrap-wysihtml5-insert-image-url');
    var insertButton = insertImageModal.find('a.btn-primary');
    var initialValue = urlInput.val();
    
    var chooser = insertImageModal.find('.image_chooser.images');
    /* this is the template we put in the image dialog */
    var optionTemplate = _.template(
      "<tr><td class='row' data-type='image' data-caption='<%= caption %>' data-url='<%= file %>'>" +
        "<img class='span1' src='<%= file %>' width='50'>"+
        "<div class='span4 caption'><%= caption %></div>" + 
        "</td></tr>");
    
    var helpers = wysiHelpers;
    
    // populate chooser
    // TODO: this get's called once for each wysiwyg on the page.  we could 
    //       be smarter and cache the results after call 1 and use them later.
    if (!xhrFetchingImages) {
      $.ajax({
        url:'imagelist.php',
        success: function(data) {
          xhrFetchingImages = false;
          // populate dropdowns
          _.each(data, function(img) {
            chooser.append(optionTemplate(img));
          });
        }
      });
    }

    var insertImage = function(imageData) {
      if(imageData.url) {
        var clz = 'image_container';
        var doc = self.editor.composer.doc;
        var tmpl = helpers.getImageTemplate();
        var chunk = tmpl(imageData);
        self.editor.composer.commands.exec("insertHTML", chunk);
      }
    };
    
    chooser.on('click', 'td', function(ev) {
      var $row = $(ev.currentTarget);
      insertImage($row.data());
      insertImageModal.modal('hide');
      $('#uploadresult').html('');
      $('#file1').val('');
    });
    
    insertImageModal.on('hide', function() {
      self.editor.currentView.element.focus();
    });
    
    toolbar.find('a[data-wysihtml5-command=insertImage]').click(function() {
      var activeButton = $(this).hasClass("wysihtml5-command-active");
      
      if (!activeButton) {
        insertImageModal.modal('show');
        
        $('#file1').change(function() {
          $(this).uploadimage('upload.php', function(res) {
            if(res.status)
            {
	      chooser.append(optionTemplate({"file":res.file,"caption":res.caption}));
	      $('#uploadresult').html('Upload successful').removeClass().addClass('alert alert-success');
	    }
	    else
	    {
	      $('#uploadresult').html('Upload failed').removeClass().addClass('alert alert-error');
            }		
          }, 'json');
        });

        insertImageModal.on('click.dismiss.modal', '[data-dismiss="modal"]', function(e) {
          e.stopPropagation();
        });
        return false;
      }
      else {
        return true;
      }
    });
  }
};

$.extend($.fn.wysihtml5.Constructor.prototype, bootWysiOverrides);

$(function() {

  // override options
  var wysiwygOptions = {
    customTags: {
      "em": {},
      "strong": {},
      "hr": {}
    },
    customStyles: {
      // keys with null are used to preserve items with these classes, but not show them in the styles dropdown
      'shrink_wrap': null,
      'credit': null,
      'tombstone': null,
      'chat': null,
      'caption': null
    },
    customTemplates: {
      /* this is the template for the image button in the toolbar */
      image: function(locale) {
        return "<li>" +
          "<div class='bootstrap-wysihtml5-insert-image-modal modal hide fade'>" +
          "<div class='modal-header'>" +
          "<a class='close' data-dismiss='modal'>&times;</a>" +
          "<h3>" + locale.image.insert + "</h3>" +
          "</div>" +
          "<div class='modal-body'>" +
          "<div class='chooser_wrapper'>" +
          "<table class='image_chooser images'></table>" +
          "<h4>Or Upload one to insert</h4>" +
          "<input name=\"file\" id=\"file1\" type=\"file\">" +
          "<div id=\"uploadresult\"></div>" +
          "</div>" +
          "</div>" +
          "<div class='modal-footer'>" +
          "<a href='#' class='btn' data-dismiss='modal'>" + locale.image.cancel + "</a>" +
          "</div>" +
          "</div>" +
          "<a class='btn' data-wysihtml5-command='insertImage' title='" + locale.image.insert + "'><i class='icon-picture'></i></a>" +
          "</li>";
      }
    }
  };

  $('.tip').tooltip();
  $('textarea.wysi').each(function() {
    $(this).wysihtml5($.extend(wysiwygOptions, {html:true, color:false, stylesheets:[]}));
  });
});
