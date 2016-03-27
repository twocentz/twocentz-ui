(function() {
  'use strict';
    /* @ngInject */
    function AdminCreateController($scope, $rootScope, $alert, $state, $q, Upload, toastr, Topic) {
      document.title = 'Add a new topic - TwoCentz';
      var vm = this;
      //
      function onSubmit() {
        
        var topicModel = JSON.parse(angular.toJson(vm.model));
        if ($scope.files) {

          vm.uploadFile = $scope.uploadFile()
            .then(function(resp){
              var  mediaFiles = [resp.data];
              topicModel.mediaFiles = mediaFiles;
              Topic.postCustomTopic(topicModel)
                .then(function(response){
                  if(response.userName){
                    toastr.success('New topic added!', 'user: ' +response.userName + ', slug: ' + response.slug );
                    vm.options.resetModel();
                    $scope.files = null;
                  } else if (response.exists){
                    toastr.error('title already exist, try another name.', 'Error');
                  }
                })
            }, function(err){
              toastr.error('uploading image file failed', 'Error');
            })
        } else {
          Topic.postCustomTopic(topicModel)
            .then(function(response){
              if(response.userName){
                toastr.success('New topic added!', 'user: ' +response.userName + ', slug: ' + response.slug );
                vm.options.resetModel();
                $scope.files = null;
              } else if (response.exists){
                toastr.error('title already exist, try another name.', 'Error');
              }
            })
        }
      }

      //$scope.$watch('files', function() {
      $scope.setFiles = function(files){
        $scope.files = files;
      }

      //allowing only one file upload for now
      $scope.uploadFile = function(){

        var deferred = $q.defer();
        var upload, file;
        if (!$scope.files){
          deferred.reject('error');
        }
        file = $scope.files[0]
        if (file && !file.$error) {
          upload = Upload.upload({
            url: 'https://api.cloudinary.com/v1_1/' + $.cloudinary.config().cloud_name + '/upload',
            fields: {
              upload_preset: $.cloudinary.config().upload_preset,
              context: 'alt=' + $scope.title
            },
            file: file
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            file.status = 'Uploading... ' + file.progress + '%';
          }).error(function (data, status, headers, config) {
            file.result = data;
            deferred.reject('error');
          });
        }

        upload.then(function(resp) {
          // file is uploaded successfully
          deferred.resolve(resp);
        });

        return deferred.promise;

      };

      /* Modify the look and fill of the dropzone when files are being dragged over it */
      $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items !== null) {
          for (var i = 0 ; i < items.length; i++) {
            if (items[i].kind === 'file') {
              hasFile = true;
              break;
            }
          }
        } else {
          hasFile = true;
        }
        return hasFile ? 'dragover' : 'dragover-err';
      };

      function init() {
        vm.model = {};
        vm.fields = [
          {
            key: 'title',
            type: 'textarea',
            templateOptions: {
              label: 'Post',
              placeholder: 'type topic title here',
              required: true
            }
          },
          {
            'key': 'category',
            'type': 'select',
            'templateOptions': {
              'label': 'Category',
              required: true,
              'options': [
                {
                  'name': 'Other',
                  'value': 'other'
                },
                {
                  'name': 'General',
                  'value': 'general'
                },
                {
                  'name': 'Movies',
                  'value': 'movies'
                },
                {
                  'name': 'People',
                  'value': 'people'
                },
                {
                  'name': 'Places',
                  'value': 'places'
                },
                {
                  'name': 'Products',
                  'value': 'products'
                },
                {
                  'name': 'Restaurants',
                  'value': 'restaurants'
                },
                {
                  'name': 'Users',
                  'value': 'users'
                }
              ]
            }
          },
          {
            key: 'description',
            type: 'textarea',
            templateOptions: {
              label: 'Description',
              placeholder: 'give a description if its needed',
              required: false
            }
          },
          {
            type: 'propertySection',
            key: 'fields',
            templateOptions: {
              btnText:'new text area',
              fields: [
                {
                  className: 'form-inline',
                  fieldGroup: [
                    {
                      type: 'input',
                      key: 'fieldName',
                      templateOptions: {
                        label: 'Label',
                        placeholder: 'your field label',
                        required: true
                      }
                    },
                    {
                      type: 'textarea',
                      key: 'fieldValue',
                      templateOptions: {
                        label: 'Value',
                        placeholder: 'your field value',
                        required: true,
                        rows: 4,
                        cols: 20
                      }
                    }
                  ]
                }
              ]
            }
          }
        ];
      }

    // function assignment
    vm.uploadFile = null;
    vm.onSubmit = onSubmit;
    vm.options = {};
    init();
    //vm.originalFields = angular.copy(vm.fields);
	}
  angular
    .module('TwoCentzWeb')
    .controller('AdminCreateCtrl', AdminCreateController);

})();
