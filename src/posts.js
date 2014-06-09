var PostHelper = {

    // Constants
    files : [],
    fileInputs : [],
    uploadOptions : {
        type: 'POST',
        dataType: 'json',
        replaceFileInput: false,
        maxNumberOfFiles: 6,
        paramName: [
            'post[attachments_attributes][][file]'
        ],
        formData: function (form) {
            return form.serializeArray();
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css({ 'width': progress + '%' });
        },
        add: function (e, data) {
            PostHelper.files[PostHelper.files.length] = data.files[0];
            PostHelper.fileInputs[PostHelper.fileInputs.length] = data.fileInput[0];
            data.files = PostHelper.files;
            data.fileInput = PostHelper.fileInputs;

            // dependencies
            var form = $(e.target),
                i = data.files.length-1,
                inputId = $(data.fileInput[i]).attr('id'),
                btn = $('#' + inputId);

            var icon = (data.files[i].type == 'application/pdf') ? 'fa-file-text' : 'fa-picture-o',
                parent = (form.hasClass('user')) ? '#header' : '.company-entry-form',
                permission = PostHelper.checkPermissions(data.files);

            // If we get the all clear
            if (permission.status) {
                if ($('#upload-list').length == 0)
                    $(parent).find('#upload').append('<ul id="upload-list">');
                $('#upload-list').append(
                    '<li class="small padding-left-right">'
                    + '<span class="truncate-text">'
                    + '<span class="blue-text fa ' + icon + '"></span>&nbsp;'
                    + data.files[i].name
                    + '</span>'
                    + '</li>');
                btn.css('z-index','-' + (i+1));
                PostHelper.recalculateContainerHeight('#header');
            } else {
                data.files.splice(i,1);
                PostHelper.files.splice(i,1);
                data.context = btn;
                // alert(permission.message);
                Messenger().post({
                    message: permission.message,
                    type: 'error'
                });
            }

            // Remove Upload
            $('#upload-list .negative').unbind('click').on('click', function() {
                var i = $(this).data('index');
                data.files.splice(i,1);
                PostHelper.files.splice(i,1);
                btn.css('z-index','auto');
                data.context = btn;
                $(this).closest('li').remove();
            });

            $('.share-post').die('click').live('click', function(e){ PostHelper.handlePost(e, data) });
            return;
        },
        fail: function(e, data) {
            console.error('There was an erorr ',data.files);
        },
        done: function (e, data) {
            var post = data.result.post,
                compliant = post.compliant;
            $('#progress .bar').css({ 'width': 0 });
            PostHelper.resetEntryForm(post, false);
            PostHelper.newPost(post, compliant);

            data.context = '';
            return;
        }
    },

    recalculateContainerHeight : function(container) {
        var $container = $(container).css('max-height', ''),
            $uploadList = $container.find('#upload-list'),
            $metadataContainer = $container.find('#meta_data'),
            $assetsContainer = $container.find('#post_assets');

        var uploadListHeight = $uploadList.outerHeight() || 0,
            metadataContainerHeight = $metadataContainer.outerHeight() || 0,
            assetsContainerHeight = $assetsContainer.outerHeight() || 0,
            containerHeight,
            calculatedContainerHeight;

        function cleanPreviousCalculatedHeight() {
            $container.css('max-height', '');
        }

        cleanPreviousCalculatedHeight();
        containerHeight = parseInt($container.css('max-height'), 10);
        calculatedContainerHeight = containerHeight + uploadListHeight
        + metadataContainerHeight + assetsContainerHeight;

        $container.css('max-height', calculatedContainerHeight);
    },

    // Event Handlers
    handleBlur : function(parent) {
        var type = parent == '#header' ? { type: 'user_post' } : { type: 'company_post' },
            title = $(parent).find('#post_title'),
            content = $(parent).find('#post_content')
            values = [
                '',
                title.attr('placeholder'),
                content.attr('placeholder')
            ];

        if ($(parent).hasClass('entering-post')) {
            if (values.indexOf(title.val()) !== -1 &&
                values.indexOf(content.val()) !== -1) {
                return PostHelper.resetEntryForm(type, true);
            } else {
                return false;
            }
        }
        return false;
    },

    handlePost : function (e, uploadForm) {
        var self = $(e.currentTarget),
            parent = (self.hasClass('user')) ? '#header' : '.company-entry-form',
            modalType = (self.hasClass('user')) ? 'user' : 'company',
            entryForm = (uploadForm == undefined) ? $(parent).find('.entry-form') : $(uploadForm),
            entryTitle = $(parent + ' #post_title'),
            value = $(parent).find('textarea').val(),
            words = value.split(' ');

        // Lets throw a loader on this
        self.attr('data-loading', true);
        entryForm.submit();
    },

    // Logic
    cashTag : function(symbol) {
        var cleanSymbol, currentSymbols;
        if ($('#post_ticker_list').val() === "") {
            currentSymbols = [];
        } else {
            currentSymbols = $('#post_ticker_list').val().split(',');
        }
        cleanSymbol = symbol.toUpperCase().replace(/[\$ ]/g, '');
        if (!(_.indexOf(currentSymbols, cleanSymbol) > -1)) {
            currentSymbols.push(cleanSymbol);
            Ticker.renderTickerWithActions(cleanSymbol);
        }

        return $('#post_ticker_list').val(currentSymbols.join(','));
    },

    checkPermissions : function(files) {
        var allowedFormats = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'application/pdf'
            ],
            invalidFile;

        invalidFile = _.some(files, function(file) {
            var type = file.type;
            return _.isString(type) && type.length > 0 &&
            !_.contains(allowedFormats, type);
        });

        if(invalidFile) {
            return { status: false, message: 'You can only upload PDFs or images' };
        }

        if (files.length > 6)
            return { status: false, type: 'error', message: 'You can only upload a total of 6 files' };
        else
            return { status: true, type: 'OK', message: 'W00t! That upload is looking tight!' };
    },

    newPost : function(post, compliant) {
        var container = (post.type == 'company_post') ? $('#feed') : $('body:not(#companies-show) #feed'),
            elements = $(post.rendered),
            compliantMsg = '<p>Your post will be public as soon as it has been approved by your overseer.</p>';



        if (!post.errored && container.length > 0) {

            if (post.type === 'company_post') {
                if (compliant)
                    Messenger().post({ message: 'Your post has been shared with your followers.', hideAfter: 3 });
                else
                    Messenger().post({ message: compliantMsg, hideAfter: 5 });
                $('.content-card-container').eq(0).before(elements);
            } else {
                if (compliant) {
                    Messenger().post({ message: 'Your post has been successfully shared.', hideAfter: 3 });
                    if ($('a[data-type=following].hvst-toggle-active').length > 0)
                        $('.content-card-container').eq(1).after(elements);
                } else {
                    Messenger().post({ message: compliantMsg, hideAfter: 5 });
                }
            }

            imagesLoaded(container, function() {
                setTimeout(function() {
                    container.isotope('reloadItems').isotope({ sortBy: 'original-order'});
                    elements.animate({ 'opacity': 1.0 }, 500, function() {
                        // Stuff that happens after new post gets displayed
                        $('*[rel=modal], *[rel=fullscreen-modal]').animate({ opacity: 1.0 }, 300);
                        $('input, textarea').placeholder();
                        $('a[data-popin]').hvstPopin();
                    });
                }, 500);
            });
        } else {
            this.handleAttachmentErrors(post.errors);
        }
    },

    handleAttachmentErrors : function(errors) {
        var attachmentErrorKey = 'attachments.file',
            attachmentErrors = errors[attachmentErrorKey],
            hasAttachmentErrors = _.isArray(attachmentErrors) &&
            attachmentErrors.length > 0;

        if(hasAttachmentErrors) {
            Messenger().post({
                message: "You can only upload PDFs or images",
                type: 'error'
            });
        }
    },

    displayLink : function(input, links, type) {
        var $cntr = $('.' + type + ' #meta_data'),
            $container = $cntr.parents('.entering-post');

        $.post('/link_metadata.json', { url: links[0] })
            .done(function(data, textStatus, jqXHR) {
                if (textStatus == 'success') {
                    var source   = $('#entry_meta_data').html(),
                        template = Handlebars.compile(source);

                    $('input#post_link_metadata_id').val(data.id);
                    $cntr.html(template({
                            image: data.imageUrl,
                            host: URI(data.host).hostname(),
                            title: data.title,
                            description: data.description
                        }))
                        .removeClass('hidden')
                        .find('img').on('error', function() {
                            $(this).remove();
                            $cntr.find('.info').removeClass('thumbnail');
                            $cntr.find('#thumbnail_options').hide();
                        });

                    PostHelper.recalculateContainerHeight($container);

                    return true;
                }
            })
            .fail(function() {
                $cntr.addClass('hidden');
                PostHelper.recalculateContainerHeight($container);
            });

        $(document).on('change', '#thumbnail_option', function() {
            if (this.checked) {
                $('#header #meta_data img:not(.thumbnail)').addClass('thumbnail');
                $('#header #meta_data .info:not(.thumbnail)').addClass('thumbnail');
            } else {
                $('#header #meta_data img').removeClass('thumbnail');
                $('#header #meta_data .info').removeClass('thumbnail');
            }
        });

        // Handlebars Helpers
        Handlebars.registerHelper('thumbnail', function(thumbnail) {
            return (thumbnail) ? 'thumbnail' : '';
        });
        Handlebars.registerHelper('truncate', function(text, size) {
            return text.substring(0,size) + '...';
        });
        return;
    },

    resetEntryForm : function(post, softReset) {

        var parent = (post.type == 'company_post') ? 'company' : 'user',
            $container = parent == 'company' ? $('.company-entry-form') : $('#header');

        if (post.entry_form && !softReset) {
            var entryForm = post.entry_form;
            // Replace entryForm
            $('#entry_form_container.' + parent).html(entryForm);
            $('.entry-form').fileupload(this.uploadOptions);
        }

        // Handle Title
        $container.find('#window #post_title_save').die('click');
        $container.find('#window #post_title_cancel').die('click');

        // Reset entryForm
        $container.removeClass('entering-post endAnimation').css('max-height', ''); // Return header to original state
        $container.find('.title-callout').removeClass('entering-post');

        $container.find('#post_options #share').addClass('no_file').removeClass('has_file').removeAttr('data-loading');
        $container.find('#post_content, #post_title, .uploader input, #modal_post_title').val(''); // Lets empty input values

        $container.find('.entry-form textarea, .entry-form input').trigger('blur');
        $container.find('.entry-form textarea').removeAttr('rows').css({ 'height': 68 }); // Reset textarea
        $container.find('.entry-form').removeClass('quickthought full-thesis');

        $container.find('#ticker_tokens').empty(); // Remove ticker tokens
        $container.find('.ticker-info').attr('style','');

        PostHelper.files = [];
        PostHelper.fileInputs = [];

        $('input[type=file]').each(function() {
            $(this).val('');
        });
    }
}
