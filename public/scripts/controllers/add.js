(function() {
  'use strict';
	angular
    .module('TwoCentzWeb')
	  .controller('AddCtrl', AddController);
    /* @ngInject */
    function AddController($scope, $alert, Topic) {
      var vm = this;
      // function assignment
      vm.onSubmit = onSubmit;
      vm.options = {};

      init();

      vm.originalFields = angular.copy(vm.fields);

      // function definition
      function onSubmit() {
        alert(angular.toJson(vm.model));
      }


      function init() {
        vm.model = {};

        vm.model = {
          textField: [
            {
              fieldName:'',
              fieldValue:''
            }
          ],
          textArea: [
            {
              fieldName:'',
              fieldValue:''
            }
          ]
        };


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
          {
            type: 'propertySection',
            key: 'textField',
            templateOptions: {
              btnText:'new field',
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
                      type: 'input',
                      key: 'fieldValue',
                      templateOptions: {
                        label: 'Value',
                        placeholder: 'your field value',
                        required: true
                      }
                    }
                  ]
                }
              ]
            }
          }
          ,{
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
	  }
})();