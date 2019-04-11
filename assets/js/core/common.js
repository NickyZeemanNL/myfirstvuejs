//// -----------------------------------------------------------------------------
//// This file contains global javascript stuff
//// -----------------------------------------------------------------------------

"use strict";

var Arlanet = {
  init: function () {
    Arlanet.loadObject(Arlanet.Breakpoints, "Arlanet.Breakpoints");
    Arlanet.loadObject(Arlanet.LazyLoad, "Arlanet.LazyLoad");
  },
    // This function will load an object by a given name
    //
    // If the object doesn't exist no error will be thrown
    // But if object exists but doesn't have an init method it will throw an error
    //
    // If everything is ok we'll initiate the given object
    //
  loadObject: function (obj, name) {
    // create object based on a name
    // var objName = window[objName];

    // check if object exists
    if (typeof obj !== 'undefined') {

      // check if object has a method init
      if (typeof obj.init === 'undefined') {
        // we will throw an error so the designer / developer know there's a problem
        throw new Error('ERROR: "' + name + '" does not have an init function');

      } else {
        // everything is fine so initiate
        obj.init();
      }
    }
  }
}; 

Arlanet.Breakpoints = {
  size: {},  
  value: null,
  init: function () {
    // Get the CSS breakpoints
    this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
  }
};

Arlanet.LazyLoad = {
  init: function () {
    Arlanet.LazyLoad.blazy = new Blazy({
      selector: ".js-blazy",
      successClass: "is-lazy-loaded",
      breakpoints: [
        {
          width: 576, // bLazy uses max-width
          src: "data-src-sm"
        },
        {
          width: 768,
          src: "data-src-md"
        },
        {
          width: 992,
          src: "data-src-lg"
        },
        {
          width: 1200,
          src: "data-src-xl"
        }
      ],
      success: function (elm) {
        if ($(elm).closest(".embed-responsive").length > 0) {
          $(elm).closest(".embed-responsive").addClass("is-loaded");
        }
      }
    });
  },
  load: function(elem) {
    Arlanet.LazyLoad.blazy.load(elem);
  },
  revalidate: function() {
    Arlanet.LazyLoad.blazy.revalidate();
  }
};

$(Arlanet.init);