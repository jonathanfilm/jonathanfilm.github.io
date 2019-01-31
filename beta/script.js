$(document).ready(function() {


    'use strict';
    ///////////////// Modal preview //////////////////

    // modal variables
    var currentTarget;
    var videoPlaceholder = $('#modal-video').html();



    // get data reference for preview modal and load
    $('#previewModal').on('show.bs.modal', function (event) {

        currentTarget = $(event.relatedTarget);
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
        var contentElement = target.find('.project-content').find('iframe').attr('src');
        if (contentElement.length == 0) {
            content = videoPlaceholder;
        } else {
            content = target.find('.project-content').html(); // Extract info from object
        }

        $('#modal-video').html(content);
        $('#modal-title').text(titleText);
        $('#modal-credits').html(creditText);
        $('#modal-description').html(descriptionText);

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

        var newTarget = newTargetParent.children('.portfolio-box');

        return newTarget;
    }



});