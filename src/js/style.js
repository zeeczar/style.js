"use strict";
var ChangeManager, StyleJS;

ChangeManager = (function() {
  function ChangeManager(name) {
    this.name = name;
    this.obj = {};
    this.obj['name'] = this.name;
  }

  ChangeManager.prototype.change = function(selectors, property, value) {
    if (!this.obj[selectors]) {
      this.obj[selectors] = {};
    }
    return this.obj[selectors][property] = value;
  };

  ChangeManager.prototype.data = function() {
    return "data:text/json;charset=utf-8," + (encodeURIComponent(JSON.stringify(this.obj, void 0, 4)));
  };

  return ChangeManager;

})();

String.prototype.capitalize = function() {
  return this.substr(0, 1).toUpperCase() + this.substr(1);
};

String.prototype.toJSProperty = function() {
  var js_prop;
  js_prop = this.split('-').map(function(e) {
    return e.capitalize();
  }).join('');
  return js_prop.substr(0, 1).toLowerCase() + js_prop.substr(1);
};

StyleJS = (function() {
  StyleJS.prototype.toolbar = null;

  StyleJS.prototype.downloadButton = null;

  function StyleJS(config) {
    var div, dld_header, elements, input, input_tr, item, item_header, label, property, self, _i, _j, _len, _len1, _ref, _ref1;
    this.config = config;
    this.toolbar = document.querySelector(this.config.toolbar);
    this.downloadButton = document.createElement("a");
    this.downloadButton.download = "stylejs.json";
    this.downloadButton.innerHTML = "Download Changes";
    this.downloadButton.href = "#";
    this.downloadButton.className = "style-js-download";
    this.changeManager = new ChangeManager;
    self = this;
    _ref = this.config.items;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      item = _ref[_i];
      elements = document.body.querySelectorAll(item.selectors);
      item_header = document.createElement("th");
      item_header.innerHTML = "<h4>" + item.name + "</h4>";
      this.toolbar.appendChild(item_header);
      _ref1 = item.properties;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        property = _ref1[_j];
        input = document.createElement('input');
        input.setAttribute('type', property.type);
        input.setAttribute('data-property', property.name);
        input.setAttribute('data-selectors', item.selectors);
        input.value = property.initial;
        input.className = "style-js-input";
        input.onchange = function() {
          var element, targAttr, targAttrJS, targSelectors, value, _k, _len2, _ref2, _results;
          targAttr = this.getAttribute("data-property");
          value = this.value;
          targSelectors = this.getAttribute("data-selectors");
          self.changeManager.change(targSelectors, targAttr, value);
          self.downloadButton.href = self.changeManager.data();
          targAttrJS = targAttr.toJSProperty();
          _ref2 = document.body.querySelectorAll(targSelectors);
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            element = _ref2[_k];
            _results.push(element.style[targAttrJS] = this.value);
          }
          return _results;
        };
        input.onkeyup = input.onchange;
        div = document.createElement("tr");
        div.className = "style-js-input-wrapper";
        label = document.createElement("td");
        label.className = "style-js-input-label";
        label.innerText = property.name;
        input_tr = document.createElement("td");
        input_tr.className = "style-js-input";
        input_tr.appendChild(input);
        div.appendChild(label);
        div.appendChild(input_tr);
        this.toolbar.appendChild(div);
      }
    }
    dld_header = document.createElement("th");
    dld_header.appendChild(this.downloadButton);
    this.toolbar.appendChild(dld_header);
  }

  StyleJS.prototype.hide = function() {
    return this.toolbar.style.display = "none";
  };

  StyleJS.prototype.show = function() {
    return this.toolbar.style.display = "block";
  };

  return StyleJS;

})();

window.StyleJS = StyleJS;
