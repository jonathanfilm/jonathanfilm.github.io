
$(document).ready(function() {

    'use strict';


    var anchor = window.location.hash;
    $("a[href=\"".concat(anchor, "\"]")).tab('show');

    ///////////////// MODAL PREVIEW //////////////////

    // modal variables
    var currentTarget;
    var videoPlaceholder = $('#modal-video').html();


    // get data reference for preview modal and load
    $('#previewModal').on('show.bs.modal', function (event) {
        
        // hack to stop hide scroll bars during modal
        // $('html').css('overflow-y', 'hidden');

        currentTarget = $(event.relatedTarget).parent();
        loadModalData(currentTarget);

    });


    // get previous data reference and load
    $('#prevButton').on('click', function () {

        currentTarget = goToTarget('previous');
        loadModalData(currentTarget);
    });


    // get next data reference and load
    $('#nextButton').on('click', function () {

        currentTarget = goToTarget('next');
        loadModalData(currentTarget);
    });


    // remove video from modal when closed/hidden (to stop playback in background)
    $('#previewModal').on('hidden.bs.modal', function () {
        
        // hack to stop hide scroll bars during modal
        // $('html').css('overflow-y', 'scroll');

        $('#modal-video').html(videoPlaceholder);

    });


    // function to load data into modal window
    function loadModalData(target) {

        var titleText = target.find('.project-title').text(); // Extract info from object
        var creditText = target.find('.project-credits').html(); // Extract info from object
        var descriptionText = target.find('.project-description').html(); // Extract info from object

        var content;
        var modal = $('#previewModal');
        // check if video link exists --> if not
        var contentElement = target.find('.project-content').attr('href');

        if (contentElement == "#") {
            content = videoPlaceholder;

        } else {
            var aspectRatio = target.find('.project-content').attr('data-aspect-ratio'); // Extract info from object
            var mediaUrl = target.find('.project-content').attr('href');
            var embedUrl;
            // format URLs for html embed based on type
            if (mediaUrl.substring(0,17) == 'https://vimeo.com') {
                embedUrl = "https://player.vimeo.com/video" + mediaUrl.substring(17) + "?color=ffffff&title=0&byline=0&portrait=0";

            } else if (mediaUrl.substring(0,16) == 'https://youtu.be') {
                embedUrl = "https://www.youtube-nocookie.com/embed" + mediaUrl.substring(16);

            } else {
                console.log("Unrecognised media URL");
            }

            // TODO: integrate aspect ratio
            content = $('<div>').addClass('embed-responsive embed-responsive-'+aspectRatio).append($('<iframe>').addClass('embed-responsive-item').attr('src', embedUrl).attr('allowfullscreen', true));
        }

        // <div class="project-content">
        //   <!-- set the correct aspect ratio here -->
        //   <div class="embed-responsive embed-responsive-16by9">
        //     <iframe class="embed-responsive-item" src="https://vimeo.com/298009105" allowfullscreen></iframe>
        //   </div>
        // </div>



        $('#modal-video').html(content);
        $('#modal-title').text(titleText);
        $('#modal-credits').html(creditText);
        $('#modal-description').html(descriptionText);

        $('#previewModal').modal('handleUpdate');

    }


    // go to next and previous
    function goToTarget(direction) {

        var currentTargetParent = currentTarget.parent();
        var newTargetParent;

        if (direction == 'previous') {
            newTargetParent = currentTargetParent.prev();

        } else if (direction == 'next') {
            newTargetParent = currentTargetParent.next();
        }

        // cycle back to end or beginning if next or prev returns null
        if (newTargetParent.length == 0) {
            var allTargetParents = currentTargetParent.parent().children('div');

            if (direction == 'previous') {
                newTargetParent = allTargetParents.last();

            } else if (direction == 'next') {
                newTargetParent = allTargetParents.first();
            }
        }
        // TODO: fix row with proper class name!!
        var newTarget = newTargetParent.children('.row');

        return newTarget;
    }
    // END OF MODAL PREVIEW


    // Button text toggler using 'd-none' from Bootrap and custom 'not-hidden' identifier
    $('.toggler').on('click', function () {

        $(this).children().toggleClass('d-none not-hidden');

    });



    //function to fade in portfolio images
    // $(".easeload").onload(function() {
    //     $(this).css('opacity', 1);
    // });


    // Function for filtering the portoflio gallery
    $(".filter-button").click(function () {
        var value = $(this).attr('data-filter');

        if (value == "all") {
            // $('.filter').collapse('show');
            $('.filter').removeClass('d-none');
        }
        else {

            $(".filter").not('.' + value).addClass('d-none');
            $('.filter').filter('.' + value).removeClass('d-none');
        }
    });



});
