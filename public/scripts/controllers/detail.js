angular.module('MyApp')
  .controller('DetailCtrl', function($scope, $stateParams, Topic) {
    
    /**
     * Retrieve all topics from topic factory.
     */
    // Topic.getTopicBySlug($stateParams.slug).then(function(data) {
    //   $scope.topic = data;
    //   document.title = $scope.topic.title; 
    // });

    // mock data
    
	  $scope.topic = {
	  	"title" : "The Running Man",
	  	"description": "A wrongly convicted man must try to survive a public execution gauntlet staged as a game show.",
	  	"tags": ["movie", "sci-fi", "action", "arnold"],
	  	"images": ["http://ia.media-imdb.com/images/M/MV5BNzM4OTcyMjEyNl5BMl5BanBnXkFtZTcwMzEwNDI4OA@@._V1_SX214_AL_.jpg"]
	  };
    document.title =  $scope.topic.title + " - TwoCentz";

    $scope.entries = [
    	{
    		"text": "superb movie",
    		"votes": 25
    	},
    	{
    		"text": "great acting",
    		"votes": 12
    	},
    	{
    		"text": "nonsense storyline",
    		"votes": 5
    	},
    	{
    		"text": "lazy director",
    		"votes": 1
    	}
    ];
  });