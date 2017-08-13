$(document).ready(function() {

    $.backstretch("img/background.jpg");

	$('.feature, .review-bubble').matchHeight();

});

var myViewModel = {
    iphoneName: ko.observable(''),
    iphoneColour: ko.observableArray(''),
    avaliableColours: ko.observableArray([
        [
            ['Jet Black', 'img/colours/iphone7/jetblack.png'],
            ['Black', 'img/colours/iphone7/black.png'],
            ['Silver', 'img/colours/iphone7/silver.png'],
            ['Gold', 'img/colours/iphone7/gold.png'],
            ['Rose Gold', 'img/colours/iphone7/rosegold.png'],
        ],
        [
            ['Jet Black', 'img/colours/iphone7-plus/jetblack.png'],
            ['Black', 'img/colours/iphone7-plus/black.png'],
            ['Silver', 'img/colours/iphone7-plus/silver.png'],
            ['Gold', 'img/colours/iphone7-plus/gold.png'],
            ['Rose Gold', 'img/colours/iphone7-plus/rosegold.png'],
        ]
    ]),
    progress: ko.observable(0),
    progressMsg: ko.observable(''),
    chooseIphoneColour: function(array) {
        var self = this;
        var color = array.split(',');
        self.iphoneColour(color);
        bootbox.hideAll();
        var loadingModal = bootbox.dialog({
            title: 'Loading...',
            message: '<div class="loader"></div><p id="progress-msg"></p>' +
                    '<div class="progress">' +
                        '<div id="loading-progress" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 0%">' +
                        '</div>' +
                    '</div>',
            closeButton: false
        });

        function updateProgress(msg, callback) {
            self.progressMsg(msg);
            $('#progress-msg').html(self.progressMsg());
            var progressInterval = setInterval(function() {
                var currentProgress = self.progress();
                if(currentProgress >= 100) {
                    clearInterval(progressInterval);
                    self.progress(0);
                    callback();
                    return;
                }
                self.progress(currentProgress + 1);
                $('#loading-progress').width(self.progress() + '%');
            }, getRandomInt(15, 55));
        }

        updateProgress('Checking stock for <strong>' + self.iphoneName() + ' ' + self.iphoneColour()[0] + '</strong>...', function() {
            bootbox.hideAll();
            var stockFoundModal = bootbox.dialog({
                title: 'Stock Avaliable',
                message: '<div class="stock-found-modal">' +
                            '<img src="' + self.iphoneColour()[1] +'" class="iphone-img" />' +
                            '<h4>' + self.iphoneName() + ' ' + self.iphoneColour()[0] + ' Stock Found!</h4>' +
                            '<p>You are in luck, We have stoack avaliable for this product. You may enter our giveaway for this product. However, our system is currently experiencing a high amount of traffic and therefore we require everyone to verify they are human.</p>' +
                        '</div>',
                buttons: {
                    verify: {
                        label: 'Enter Giveaway',
                        className: 'btn-success btn-block',
                        callback: function() {
                            call_locker();
                            return false;
                        }
                    },
                },
                closeButton: false
            });

            setTimeout(function() {
                $('body').toggleClass('modal-open', true);
            }, 1000);
        });

       
    },
    chooseIphone: function(iphoneName) {
        var self = this;
        self.iphoneName(iphoneName);
        var iphoneColours = (self.iphoneName() == 'iPhone 7') ? self.avaliableColours()[0] : self.avaliableColours()[1];
        var coloursHTML = '';
        for(var i = 0; i < iphoneColours.length - 1; i++) {
            coloursHTML += '' +
                        '<div class="col-xs-6">' +
                            '<div class="iphone-select" data-bind="click: function(data, event) { chooseIphoneColour(\'' + iphoneColours[i] + '\') }">' +
                                '<img src="' + iphoneColours[i][1] +'" class="iphone-img" />' +
                                '<p class="name">' + iphoneColours[i][0] + '</p>' +
                            '</div>' +
                        '</div>'
        }
        var chooseColorModal = bootbox.dialog({
            title: 'Choose ' + self.iphoneName() + ' Color',
            message: '<div id="iphoneColours" class="row">' +
                        coloursHTML +
                    '</div>'
        });
        ko.applyBindings(myViewModel, $('#iphoneColours')[0]);
    },
};

ko.applyBindings(myViewModel);

function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomCode(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}