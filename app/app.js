var videofeedApp = angular.module('videofeedApp', []);

videofeedApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
});

videofeedApp.controller('VideoListController', function VideoListController($scope, $http, $sce) {
  $scope.title = "Video Feed";

  $http.get('https://cdn.playbuzz.com/content/feed/items').then(function(response) {
    $scope.items = response.data.items;

    for (var i = $scope.items.length - 1; i >= 0; i--) {

      $scope.trustSrcYoutube = function(videoId) {
        var videoSrc = 'https://www.youtube.com/embed/' + videoId;
        return $sce.trustAsResourceUrl(videoSrc);
      }

      $scope.trustSrcFacebook = function(videoId) {
        var videoSrc = 'http://www.facebook.com/video/embed?video_id=' + videoId;
        return $sce.trustAsResourceUrl(videoSrc);
      }
    }
  });
});

videofeedApp.filter('thousandSuffix', function () {
  return function (input, decimals) {
    var exp, rounded,
      suffixes = ['k', 'M', 'G', 'T', 'P', 'E'];

    if(window.isNaN(input)) {
      return null;
    }

    if(input < 1000) {
      return input;
    }

    exp = Math.floor(Math.log(input) / Math.log(1000));

    return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
  };
});