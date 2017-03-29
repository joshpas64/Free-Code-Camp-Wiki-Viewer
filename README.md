# Free-Code-Camp-Wiki-Viewer
Source Code to a Wikipedia Article Viewer Project from Free Code Camp
Check out the full CodePen Page <a target="_blank" href="https://codepen.io/joshpas4991/pen/LxQMMv">here</a>
* Project description and requirements by FreeCodeCamp can be found<a target="_blank" href="https://www.freecodecamp.com/challenges/build-a-wikipedia-viewer">here</a>.

## HTML Statements to Add
* Add the code between the `<head></head>` tags in your html code.
```html
<link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<meta name="viewport" content="width=device-width, initial-scale=1">
```
* Those statements should add icons and libraries from <a href="https://www.w3schools.com/w3css/w3css_templates.asp" target="_blank">w3 Schools</a> and from Google BootStrap's <a href="http://fontawesome.io/" target="_blank">font-awesome library</a>

## CSS Libraries Used 
* Google Bootsrap library. Link to CSS reference <a href="http://getbootstrap.com/css/" target="_blank">here</a>
* <a href="https://bootswatch.com/journal/" target="_blank">Journal</a> CSS template from <a href="https://bootswatch.com/" target="_blank">Bootswatch</a>.
* Link URLS below:
```html
<link rel='stylesheet prefetch' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'>
<link rel='stylesheet prefetch' href='https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/journal/bootstrap.min.css'>
```

## JavaScript Libraries Used
* Most helpful and relevant library used was <a href="https://angularjs.org/" target="_blank">AngularJS 1.5</a> with reference on how to learn the basics of it being found <a href="https://www.tutorialspoint.com/angularjs/" target="_blank">here</a>.
* Jquery library also used with reference being found by clicking <a href="https://www.tutorialspoint.com/jquery/index.htm" target="_blank">here</a>
* Google <a href="http://getbootstrap.com/javascript/" target="_blank">BootStrap JavaScript Library</a> was also included.
* HTML script statements below:
```html
<script src='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.8/angular.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js'></script>
```

### Key Notes on Using Wikipedia API
* Generating a single article at Random is actually fairly easy with the <strong>Wikipedia API</strong>. To generate the article just have <em>this url</em> be included in either your html code or javascript code
```
url : "https://en.wikipedia.org/wiki/Special:Random"
```
* In my project, I placed the request in a highlighted link like this:
```html
<a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" title="Click to go to a random Wiki article">here</a>
```
* The second half of the <u>Wiki Viewer</u> details generating and displaying articles produced by searching by <em>keyword</em> in a textbox, much like searching for any item in a normal search engine like Google, Amazon, YouTube, or Wikipedia. This can be done first with base url:
```javascript
base_url : "https://en.wikipedia.org/w/api.php?
action=query&format=json&errorlang=uselang&prop=info%7Cextracts&list=&meta=&iwurl=1&generator=search&callback=JSON_CALLBACK&utf8=1&ascii
=1&inprop=url%7Cpreload%7Cdisplaytitle&exsentences=2&explaintext=1&gsrsearch=";
// base API URL is https://en.wikipedia.org/w/api.php?
// '?' character denotes the start of the API requests and to start loading in the necessary parameters, with multiple parameters being
//    separated by '&' character
// format=json denotes JSON Object output format
// generator=search denotes we want the API to search for articles and pages
// display=1 denotes we want to retrieve the title and its formatting of the pages we are returned
// exsentences=2 denotes we want to retrieve two sentences from the article page. Two to four sentences is good for a preview length of an article
// explaintext=1 denotes we want to retrieve the extracted as plaintext string rather than as HTML code
//       explaintext=1 is good if you are placing the string brought from the API DIRECTLY into the HTML elements where the HTML tags 
        // not be interpreted
//       explaintext=0 is good if you are javascript to add to the element or append to it where methods like `.appendTo()` or `.html()`
//         .prepend() can be used to add and INTERPRET the html code into the element. This can be good to dynamically add HTML content.
//srsearch= denotes the actual keyword to search by
```
* The search key that will be loaded into the `srsearch` field of the url will likely come from an the text value of html `<input>` form
which will then needed to be translated into <em>URI</em> form using JavaScript's `encodeURI(string)` method.
* The url suffix to add after including the search key is below:
```javascript
url_suffix:"&gsrnamespace=0&gsrlimit=10&gsroffset=0&gsrwhat=text&gsrinfo=totalhits%7Csuggestion%7Crewrittenquery&gsrprop=wordcount%7Ctim
estamp%7Ctitlesnippet%7Csnippet"
// gsrlimit=10 denotes that we want to get the first 10 results of the search, the limit you choose to use is up to you.
// Add all elements to together into a full url
full_url : $scope.objectURL.base_url + encodeURI(inputString) + $scope.objectURL.url_suffix,
```
* To retrieve JSON result and store it into a controller `$scope` variable in angular, use code:
```javascript
$http.jsonp($scope.urlObject.full_url).then(function(response) {
      $scope.resultJSON = response.data;
    });
```
* JSON response objects, will create an object of objects where if the response data was in variable `var $scope.resultJSON` then to get 
all the pages, you would navigate to field `$scope.resultJSON.query.pages`, where all the separate pages are index by a <em>pageid</em> 
property.
* To iterate through the results and create a separate list of objects containing only the fields <strong>(article URL,title,extracted 
snippet text)</strong> we want can be done like this:
```javascript
$scope.searchResults = [];
for(var i in $scope.resultJSON.query.pages){
  var newObj = {};
  newObj.title = $scope.resultJSON.query.pages[i].title;
  newObj.fullURL = $scope.resultJSON.query.pages[i].fullurl;
  newObj.preview = $scope.resultJSON.query.pages[i].extract;
  $scope.searchResults.push(newObj);
} 
// This loop can be put into a function that a controller can use and call on html elements in its scope
// In said function global variable $scope.searchResults should be reassigned to the empty list, [], everytime a new query is made
```
* Once `$scope.searchResults` is fully initialized with all the search page results you can display all the search results in a
formatted block using this html code below:
```html
<div class="result-container" ng-repeat="results in searchResults">
        <div class="center-block result-class">
          <a target="_blank" href={{results.fullurl}}>
            <h4 class="text-center text-info"><u>{{results.title}}</u></h4>
            <p>{{results.extract}}</p>
            </a>
        </div>
        <br>
</div>
```
