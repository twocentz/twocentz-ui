(function() {
  'use strict';
  angular
    .module('TwoCentzWeb')
    .config(function config(formlyConfigProvider) {
      var unique = 1;
      formlyConfigProvider.setType({
        name: 'propertySection',
        templateUrl: 'html/propertySection.html',
        /* @ngInject */
        controller: function($scope) {

          function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
          }

          function addRandomIds(fields) {
            unique++;
            angular.forEach(fields, function(field, index) {
              if (field.fieldGroup) {
                addRandomIds(field.fieldGroup);
                return; // fieldGroups don't need an ID
              }

              if (field.templateOptions && field.templateOptions.fields) {
                addRandomIds(field.templateOptions.fields);
              }

              field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
            });
          }

          function copyFields(fields) {
            fields = angular.copy(fields);
            addRandomIds(fields);
            return fields;
          }

          function addNew() {
            $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
            var repeatsection = $scope.model[$scope.options.key];
            var lastSection = repeatsection[repeatsection.length - 1];
            var newsection = {};
            if (lastSection) {
              newsection = _.mapValues(lastSection, function(o) { return '' });
            }
            repeatsection.push(newsection);
          }


          // adding objects to scope
          $scope.formOptions = {formState: $scope.formState};
          $scope.addNew = addNew;
          $scope.copyFields = copyFields;

        }
      });
  });
})();
