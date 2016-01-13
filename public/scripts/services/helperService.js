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

    function getTopicTwoCentz(totalVotes, topEntries){
      if(totalVotes>1){
        var percent = Math.round(100 * parseInt(topEntries[0].votes) / parseInt(totalVotes));
        return percent + '% ' + topEntries[0].text;
      } else {
        return '';
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
      getTopicTwoCentz: getTopicTwoCentz,
      getSocialShareDescription: getSocialShareDescription,
      encode: encode
    }

    return service;
  }

  angular
    .module('TwoCentzWeb')
    .factory('HelperService', HelperService);


})();
