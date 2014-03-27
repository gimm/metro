'use strict';

describe('Directive: tile', function () {

  // load the directive's module
  beforeEach(module('metroApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<tile></tile>');
    element = $compile(element)(scope);
//    expect(element.text()).hasClass('tile');
  }));
});
