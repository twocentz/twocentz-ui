(function() {
  'use strict';
    /* @ngInject */
    function AddController($scope, $rootScope, $alert, $state, $q, Upload, toastr, Topic) {
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
              Topic.postUserTopic(topicModel)
                .then(function(respose){
                  if(respose.userName){
                    $state.transitionTo('usertopic', { username: respose.userName, slug: respose.slug });
                  } else if (respose.exists){
                    toastr.error('title already exist, try another name.', 'Error');
                  }
                })
            }, function(err){
              toastr.error('uploading image file failed', 'Error');
            })
        } else {
          Topic.postUserTopic(topicModel)
            .then(function(respose){
              if(respose.userName){
                $state.transitionTo('usertopic', { username: respose.userName, slug: respose.slug });
              } else if (respose.exists){
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

        // if (!$scope.files) return;
        // angular.forEach(files, function(file){
        //   if (file && !file.$error) {
        //     file.upload = Upload.upload({
        //       url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
        //       fields: {
        //         upload_preset: $.cloudinary.config().upload_preset,
        //         context: 'alt=' + $scope.title
        //       },
        //       file: file
        //     }).progress(function (e) {
        //       file.progress = Math.round((e.loaded * 100.0) / e.total);
        //       file.status = "Uploading... " + file.progress + "%";
        //     }).success(function (data, status, headers, config) {
        //       $rootScope.photos = $rootScope.photos || [];
        //       data.context = {custom: {photo: $scope.title}};
        //       file.result = data;
        //       $rootScope.photos.push(data);
        //     }).error(function (data, status, headers, config) {
        //       file.result = data;
        //     });
        //   }
        // });
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

        // vm.model = {
        //   //textField: [
        //   //  {
        //   //    fieldName:'',
        //   //    fieldValue:''
        //   //  }
        //   //],
        //   textArea: [
        //     {
        //       fieldName:'',
        //       fieldValue:''
        //     }
        //   ]
        // };


        vm.fields = [
          {
            key: 'title',
            type: 'input',
            templateOptions: {
              label: 'Title',
              placeholder: 'your topics title',
              required: true
            }
          },
          {
            key: 'description',
            type: 'textarea',
            templateOptions: {
              label: 'Description',
              placeholder: 'Some description of the topic'
            }
          },
          //{
          //  type: 'propertySection',
          //  key: 'textField',
          //  templateOptions: {
          //    btnText:'new field',
          //    fields: [
          //      {
          //        className: 'form-inline',
          //        fieldGroup: [
          //          {
          //            type: 'input',
          //            key: 'fieldName',
          //            templateOptions: {
          //              label: 'Label',
          //              placeholder: 'your field label',
          //              required: true
          //            }
          //          },
          //          {
          //            type: 'input',
          //            key: 'fieldValue',
          //            templateOptions: {
          //              label: 'Value',
          //              placeholder: 'your field value',
          //              required: true
          //            }
          //          }
          //        ]
          //      }
          //    ]
          //  }
          //},
          {
            type: 'propertySection',
            key: 'textArea',
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
    vm.originalFields = angular.copy(vm.fields);
	}
  angular
    .module('TwoCentzWeb')
    .controller('AddCtrl', AddController);

})();
