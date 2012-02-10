(function() {
  var defer, isObject,
    __slice = Array.prototype.slice;

  isObject = function(object) {
    return (typeof object === typeof {}) && object !== null;
  };

  defer = function(callback) {
    return setTimeout(callback, 1);
  };

  ko.bindingHandlers["view"] = (function() {
    var makeTemplateValueAccessor;
    makeTemplateValueAccessor = function(viewModel) {
      return function() {
        return {
          'if': viewModel,
          'data': viewModel,
          'templateEngine': ko.nativeTemplateEngine.instance
        };
      };
    };
    return {
      'init': function(element, valueAccessor) {
        var value;
        value = valueAccessor();
        if (!isObject(value)) value = {};
        return ko.bindingHandlers['template']['init'](element, makeTemplateValueAccessor(value.viewModel));
      },
      'update': function() {
        var args, element, k, v, value, valueAccessor;
        element = arguments[0], valueAccessor = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        value = valueAccessor();
        if (!isObject(value)) value = {};
        for (k in value) {
          v = value[k];
          ko.utils.unwrapObservable(v);
        }
        if (!(value.template != null)) return;
        if (!(value.viewModel != null)) return;
        if (ko.utils.domData.get(element, '__ko_view_updating__') === true) return;
        ko.utils.domData.set(element, '__ko_view_updating__', true);
        return defer(function() {
          var execScripts, originalTemplate, template, viewModel, _ref;
          template = ko.utils.unwrapObservable(value.template);
          viewModel = ko.utils.unwrapObservable(value.viewModel);
          execScripts = !!ko.utils.unwrapObservable(value.execScripts);
          if (!(template != null)) {
            $(element).html("");
          } else {
            originalTemplate = ko.utils.domData.get(element, '__ko_anon_template__');
            ko.utils.domData.set(element, '__ko_anon_template__', template);
            (_ref = ko.bindingHandlers['template'])['update'].apply(_ref, [element, makeTemplateValueAccessor(viewModel)].concat(__slice.call(args)));
            if (template !== originalTemplate && execScripts === true) {
              $(element).find("script").each(function(index, script) {
                script = $(script);
                if (script.attr('type').toLowerCase() === "text/javascript") {
                  return eval(script.text());
                }
              });
            }
          }
          return ko.utils.domData.set(element, '__ko_view_updating__', false);
        });
      }
    };
  })();

}).call(this);