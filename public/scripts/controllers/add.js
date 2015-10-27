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


      vm.exampleTitle = 'Repeating Section'; // add this

      vm.options = {};

      init();

      vm.originalFields = angular.copy(vm.fields);

      // function definition
      function onSubmit() {
        alert(JSON.stringify(vm.model), null, 2);
      }


      function init() {
        vm.model = {
          investments: [
            {
              investmentName:'abc',
              investmentDate:(new Date()).toDateString(),
              stockIdentifier:'',
              investmentValue:'',
              relationshipName:'',
              complianceApprover:'',
              requestorComment:''
            },
            {
              investmentName:'haf',
              investmentDate:(new Date()).toDateString(),
              stockIdentifier:'',
              investmentValue:'',
              relationshipName:'',
              complianceApprover:'',
              requestorComment:''
            }
          ]
        };

        vm.fields = [
          {
            type: 'propertySection',
            key: 'investments',
            templateOptions: {
              btnText:'Add another investment',
              fields: [
                {
                  className: 'row',
                  fieldGroup: [
                    {
                      className: 'col-xs-4',
                      type: 'input',
                      key: 'investmentName',
                      templateOptions: {
                        label: 'Name of Investment:',
                        required: true
                      }
                    },
                    {
                      type: 'input',
                      key: 'investmentDate',
                      className: 'col-xs-4',
                      templateOptions: {
                        label: 'Date of Investment:',
                        placeholder: 'dd/mm/yyyy such as 20/05/2015',
                        dateFormat: 'DD, d  MM, yy'
                      }
                    },
                    {
                      type: 'input',
                      key: 'stockIdentifier',
                      className: 'col-xs-4',
                      templateOptions: {
                        label: 'Stock Identifier:'
                      }
                    }
                  ]
                },
                {
                  "type": "radio",
                  "key": "type",
                  "templateOptions": {
                    "options": [
                      {
                        "name": "Text Field",
                        "value": "input"
                      },
                      {
                        "name": "TextArea Field",
                        "value": "textarea"
                      },
                      {
                        "name": "Radio Buttons",
                        "value": "radio"
                      },
                      {
                        "name": "Checkbox",
                        "value": "checkbox"
                      }
                    ],
                    "label": "Field Type",
                    "required": true
                  }
                },
                {
                  type: 'input',
                  key: 'investmentValue',
                  templateOptions: {
                    label: 'Value:'
                  },
                  expressionProperties: {
                    'templateOptions.disabled': '!model.stockIdentifier'
                  }
                },
                {
                  type: 'checkbox',
                  model: 'formState',
                  key: 'selfExecuting',
                  templateOptions: {
                    label: 'Are you executing this trade?'
                  }
                },
                {
                  hideExpression: '!formState.selfExecuting',
                  fieldGroup: [
                    {
                      type: 'input',
                      key: 'relationshipName',
                      templateOptions: {
                        label: 'Name:'
                      }
                    },
                    {
                      type: 'select',
                      key: 'complianceApprover',
                      templateOptions:
                      {
                        label: 'Compliance Approver:',
                        options: [
                          {
                            name: 'approver 1',
                            value:'some one 1'
                          },
                          {
                            name: 'approver 2',
                            value:'some one 2'
                          }]
                      }
                    },
                    {
                      type: 'textarea',
                      key: 'requestorComment',
                      templateOptions:
                      {
                        label: 'Requestor Comment',
                        rows: 4
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