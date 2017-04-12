var videofeedApp = angular.module('videofeedApp', []);

videofeedApp.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
});

videofeedApp.controller('VideoListController', function VideoListController($scope, $http, $sce) {
  $scope.title = "Video Feed";

  $scope.trustSrc = function(videoId) {
    var videoSrc = 'https://www.youtube.com/embed/' + videoId;
    return $sce.trustAsResourceUrl(videoSrc);
  }

  $http.get('https://cdn.playbuzz.com/content/feed/items').then(function(response) {
    $scope.items = response.data.items;

    for (var i = $scope.items.length - 1; i >= 0; i--) {
      var id = $scope.items[i].videoId;
      
      if ($scope.items[i].source === 'facebook') {
        $http.get('https://graph.facebook.com/' + id + '').then(function(response) {
          $scope.fbvideo = response.data.source;
        }, function(error) {
          console.log('Facebook video post is missing');
        });
      }

      if ($scope.items[i].source === 'youtube') {
        var url = 'https://www.youtube.com/oembed?url=http://youtube.com/watch?v=' + id;
        $sce.trustAsResourceUrl(url);
        $http({
          method: 'jsonp',
          url: url
        }).
        success(function(response) {
          $scope.youtube = response.data;
          console.log($scope.youtube);
        }).
        error(function(response) {
          console.log('Youtube video is missing');
        });

        // $http.jsonp(url, {jsonpCallbackParam: 'callback'}).then(function(response) {
        //   $scope.youtubeVideo = response.data;
        //   console.log($scope.youtubeVideo);
        // }, function(error) {
        //   console.log('Youtube video is missing');
        // });
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