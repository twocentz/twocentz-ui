(function() {
  'use strict';

  /* @ngInject */
  function HelperService() {


    ///////////////////
    function populateWordCloud(entries){
      var wordCloud = [];
      _.each(entries, function(entry){
        wordCloud.push({text: entry.text, weight: entry.votes});
      });

      return wordCloud;
    }

    function descSort(entries){
      return _.sortBy(entries, function(entry) {
        return entry.votes * -1; // desc sorting
      });
    }

    function addEntryToLocalCache(text, entries, userVoted){
      var index = _.findIndex(entries, function(entry) {
        return entry.text === text;
      });

      if(index !== -1){

        if(_.indexOf(userVoted, text) === -1){
          entries[index].votes = entries[index].votes + 1;
          userVoted.push(text);
        }

      } else {
          entries.push({'text':text, votes: 1});
          userVoted.push(text);
      }

    }

    function getURLParameter(name) {
        /* jshint ignore:start */
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
        /* jshint ignore:end */
    }

    function getTopEntriesString(entries, count){
      var result = '';
      _.each(entries, function(item, index){
        result += ' &ldquo;' + item.text + '&rdquo; ';
        if(index === count){
           return false;
        }
      });
      return result;
    }

    function getTopPercentage(total_votes, topEntries){
      if(total_votes>0){
        var topCents = [];
        for(var i = 0; i < topEntries.length; i++){ 
          topCents.push(Math.round(100 * parseInt(topEntries[i].votes) / parseInt(total_votes)) + '%');
        }
        return topCents;
      } else {
        return 'N/A';
      }

    }

    function getSocialShareDescription(entries){
      var result = '', limit = 3
      _.each(entries, function(item, index){
        result += item.text + ', ';
        if(index === limit){
          return false;
        }
      });
      return result.slice(0, -2);
    }

    function getVotesinPercent(total_votes, votes) {
      if(total_votes>0){
        var percent = Math.round(100 * votes / total_votes);
        return percent;
      } else {
        return 0;
      }
    }


    function encode(value) {
      /* jshint ignore:start */
      var unencoded = value;
      return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
      /* jshint ignore:end */
    }

    /////////////////////

    var service = {
      descSort : descSort,
      populateWordCloud: populateWordCloud,
      addEntryToLocalCache: addEntryToLocalCache,
      getUrlParam: getURLParameter,
      getTopEntriesString: getTopEntriesString,
      getTopPercentage: getTopPercentage,
      getSocialShareDescription: getSocialShareDescription,
      getVotesinPercent: getVotesinPercent,
      encode: encode
    }

    return service;
  }

  angular
    .module('TwoCentzWeb')
    .factory('HelperService', HelperService);


})();
