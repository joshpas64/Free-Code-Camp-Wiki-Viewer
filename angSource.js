var myapp = angular.module("myapp", [])
myapp.directive("result", function() {
  var directive = {};
  directive.restrict = 'E';
  directive.template = "<u>{{result.header}}</u>{{result.previewText}}";
  directive.scope = {
    result: "=header"
  }
  directive.compile = function(element, attributes) {
    var linkFunction = function($scope, element, attributes) {
      element.html("<div class='result-class'><a target='_blank' href='" + $scope.result.refLink + "'>" +
        "<h4 class='text-primary'><u>" + $scope.result.header + "</u></h4>" + "<p>" + $scope.result.previewText + "</p></a></div>");
    }
    return linkFunction;
  }
  return directive;
});
myapp.controller("HelloController", function($scope) {
  $scope.helloTo = {};
  $scope.helloTo.title = "AngularJS 1.5";
});
myapp.controller("QueryController", function($scope, $http) {
  $scope.searchObject = {
    query: "",
    getField: function() {
      var queryObj = $scope.searchObject;
      return queryObj.query;
    }
  };
  $scope.resultJSON = {};
  $scope.urlObject = {
    base_url: "https://en.wikipedia.org/w/api.php?action=query&format=json&errorlang=uselang&prop=info%7Cextracts&list=&meta=&iwurl=1&generator=search&callback=JSON_CALLBACK&utf8=1&ascii=1&inprop=url%7Cpreload%7Cdisplaytitle&exsentences=2&explaintext=1&gsrsearch=",
    url_suffix: "&gsrnamespace=0&gsrlimit=10&gsroffset=0&gsrwhat=text&gsrinfo=totalhits%7Csuggestion%7Crewrittenquery&gsrprop=wordcount%7Ctimestamp%7Ctitlesnippet%7Csnippet",
    full_url: ""
  };
  $scope.putResults = function(data) {
    $scope.searchResults = [];
    for (var i in data.query.pages) {
      var newObj = {};
      newObj.title = data.query.pages[i].title;
      newObj.fullurl = data.query.pages[i].fullurl;
      if (data.query.pages[i].extract !== undefined) {
        newObj.extract = data.query.pages[i].extract;
      } else
        newObj.extract = data.query.pages[i].title;
      $scope.searchResults.push(newObj);
    }
  };
  $scope.form_url = function() {
    var obj = $scope.urlObject;
    $scope.urlObject.full_url = obj.base_url + encodeURI($scope.searchObject.query) + obj.url_suffix;
    $http.jsonp($scope.urlObject.full_url).then(function(response) {
      $scope.resultJSON = response.data;
    });
    $scope.putResults($scope.resultJSON);
  };
  $scope.searchResults = [];

});
