(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/array/from"), __esModule: true };
},{"core-js/library/fn/array/from":7}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":8}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":9}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":3}],6:[function(require,module,exports){
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

/* Copied from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
 */

if ("document" in window.self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!("classList" in document.createElement("_"))
    || document.createElementNS && !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))) {

  (function (view) {

    "use strict";

    if (!('Element' in view)) return;

    var
        classListProp = "classList"
      , protoProp = "prototype"
      , elemCtrProto = view.Element[protoProp]
      , objCtr = Object
      , strTrim = String[protoProp].trim || function () {
        return this.replace(/^\s+|\s+$/g, "");
      }
      , arrIndexOf = Array[protoProp].indexOf || function (item) {
        var
            i = 0
          , len = this.length
        ;
        for (; i < len; i++) {
          if (i in this && this[i] === item) {
            return i;
          }
        }
        return -1;
      }
      // Vendors: please allow content code to instantiate DOMExceptions
      , DOMEx = function (type, message) {
        this.name = type;
        this.code = DOMException[type];
        this.message = message;
      }
      , checkTokenAndGetIndex = function (classList, token) {
        if (token === "") {
          throw new DOMEx(
              "SYNTAX_ERR"
            , "An invalid or illegal string was specified"
          );
        }
        if (/\s/.test(token)) {
          throw new DOMEx(
              "INVALID_CHARACTER_ERR"
            , "String contains an invalid character"
          );
        }
        return arrIndexOf.call(classList, token);
      }
      , ClassList = function (elem) {
        var
            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
          , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
          , i = 0
          , len = classes.length
        ;
        for (; i < len; i++) {
          this.push(classes[i]);
        }
        this._updateClassName = function () {
          elem.setAttribute("class", this.toString());
        };
      }
      , classListProto = ClassList[protoProp] = []
      , classListGetter = function () {
        return new ClassList(this);
      }
    ;
    // Most DOMException implementations don't allow calling DOMException's toString()
    // on non-DOMExceptions. Error's toString() is sufficient here.
    DOMEx[protoProp] = Error[protoProp];
    classListProto.item = function (i) {
      return this[i] || null;
    };
    classListProto.contains = function (token) {
      token += "";
      return checkTokenAndGetIndex(this, token) !== -1;
    };
    classListProto.add = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
      ;
      do {
        token = tokens[i] + "";
        if (checkTokenAndGetIndex(this, token) === -1) {
          this.push(token);
          updated = true;
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.remove = function () {
      var
          tokens = arguments
        , i = 0
        , l = tokens.length
        , token
        , updated = false
        , index
      ;
      do {
        token = tokens[i] + "";
        index = checkTokenAndGetIndex(this, token);
        while (index !== -1) {
          this.splice(index, 1);
          updated = true;
          index = checkTokenAndGetIndex(this, token);
        }
      }
      while (++i < l);

      if (updated) {
        this._updateClassName();
      }
    };
    classListProto.toggle = function (token, force) {
      token += "";

      var
          result = this.contains(token)
        , method = result ?
          force !== true && "remove"
        :
          force !== false && "add"
      ;

      if (method) {
        this[method](token);
      }

      if (force === true || force === false) {
        return force;
      } else {
        return !result;
      }
    };
    classListProto.toString = function () {
      return this.join(" ");
    };

    if (objCtr.defineProperty) {
      var classListPropDesc = {
          get: classListGetter
        , enumerable: true
        , configurable: true
      };
      try {
        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
      } catch (ex) { // IE 8 doesn't support enumerable:true
        if (ex.number === -0x7FF5EC54) {
          classListPropDesc.enumerable = false;
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        }
      }
    } else if (objCtr[protoProp].__defineGetter__) {
      elemCtrProto.__defineGetter__(classListProp, classListGetter);
    }

    }(window.self));

    } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.

    (function () {
      "use strict";

      var testElement = document.createElement("_");

      testElement.classList.add("c1", "c2");

      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains("c2")) {
        var createMethod = function(method) {
          var original = DOMTokenList.prototype[method];

          DOMTokenList.prototype[method] = function(token) {
            var i, len = arguments.length;

            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }

      testElement.classList.toggle("c3", false);

      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains("c3")) {
        var _toggle = DOMTokenList.prototype.toggle;

        DOMTokenList.prototype.toggle = function(token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };

      }

      testElement = null;
    }());
  }
}

},{}],7:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/es6.array.from');
module.exports = require('../../modules/_core').Array.from;
},{"../../modules/_core":16,"../../modules/es6.array.from":62,"../../modules/es6.string.iterator":65}],8:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":61,"../modules/es6.string.iterator":65,"../modules/web.dom.iterable":66}],9:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":16,"../../modules/es6.object.define-property":64}],10:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],11:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],12:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":32}],13:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":52,"./_to-iobject":54,"./_to-length":55}],14:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":15,"./_wks":59}],15:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],16:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],17:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp')
  , createDesc      = require('./_property-desc');

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};
},{"./_object-dp":41,"./_property-desc":46}],18:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":10}],19:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],20:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":24}],21:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":25,"./_is-object":32}],22:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],23:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":16,"./_ctx":18,"./_global":25,"./_hide":27}],24:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],25:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],26:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],27:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":20,"./_object-dp":41,"./_property-desc":46}],28:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":25}],29:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":20,"./_dom-create":21,"./_fails":24}],30:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":15}],31:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":38,"./_wks":59}],32:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],33:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":12}],34:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":27,"./_object-create":40,"./_property-desc":46,"./_set-to-string-tag":48,"./_wks":59}],35:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":23,"./_has":26,"./_hide":27,"./_iter-create":34,"./_iterators":38,"./_library":39,"./_object-gpo":43,"./_redefine":47,"./_set-to-string-tag":48,"./_wks":59}],36:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":59}],37:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],38:[function(require,module,exports){
module.exports = {};
},{}],39:[function(require,module,exports){
module.exports = true;
},{}],40:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":12,"./_dom-create":21,"./_enum-bug-keys":22,"./_html":28,"./_object-dps":42,"./_shared-key":49}],41:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":12,"./_descriptors":20,"./_ie8-dom-define":29,"./_to-primitive":57}],42:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":12,"./_descriptors":20,"./_object-dp":41,"./_object-keys":45}],43:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":26,"./_shared-key":49,"./_to-object":56}],44:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":13,"./_has":26,"./_shared-key":49,"./_to-iobject":54}],45:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":22,"./_object-keys-internal":44}],46:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],47:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":27}],48:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":26,"./_object-dp":41,"./_wks":59}],49:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":50,"./_uid":58}],50:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":25}],51:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":19,"./_to-integer":53}],52:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":53}],53:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],54:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":19,"./_iobject":30}],55:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":53}],56:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":19}],57:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":32}],58:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],59:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":25,"./_shared":50,"./_uid":58}],60:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":14,"./_core":16,"./_iterators":38,"./_wks":59}],61:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":12,"./_core":16,"./core.get-iterator-method":60}],62:[function(require,module,exports){
'use strict';
var ctx            = require('./_ctx')
  , $export        = require('./_export')
  , toObject       = require('./_to-object')
  , call           = require('./_iter-call')
  , isArrayIter    = require('./_is-array-iter')
  , toLength       = require('./_to-length')
  , createProperty = require('./_create-property')
  , getIterFn      = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":17,"./_ctx":18,"./_export":23,"./_is-array-iter":31,"./_iter-call":33,"./_iter-detect":36,"./_to-length":55,"./_to-object":56,"./core.get-iterator-method":60}],63:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":11,"./_iter-define":35,"./_iter-step":37,"./_iterators":38,"./_to-iobject":54}],64:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":20,"./_export":23,"./_object-dp":41}],65:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":35,"./_string-at":51}],66:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":25,"./_hide":27,"./_iterators":38,"./_wks":59,"./es6.array.iterator":63}],67:[function(require,module,exports){
'use strict';

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

require('classlist-polyfill');

var _util = require('./services/util');

var _util2 = _interopRequireDefault(_util);

var _component = require('./services/component');

var _component2 = _interopRequireDefault(_component);

var _icons = require('./services/icons');

var _icons2 = _interopRequireDefault(_icons);

var _accordion = require('./components/accordion');

var _accordion2 = _interopRequireDefault(_accordion);

var _cookieprompt = require('./components/cookieprompt');

var _cookieprompt2 = _interopRequireDefault(_cookieprompt);

var _icon = require('./components/icon');

var _icon2 = _interopRequireDefault(_icon);

var _modal = require('./components/modal');

var _modal2 = _interopRequireDefault(_modal);

var _skiplink = require('./components/skiplink');

var _skiplink2 = _interopRequireDefault(_skiplink);

var _tab = require('./components/tab');

var _tab2 = _interopRequireDefault(_tab);

require('./services/extends');

var _globalheader = require('./components/globalheader');

var _globalheader2 = _interopRequireDefault(_globalheader);

var _table = require('./components/table');

var _table2 = _interopRequireDefault(_table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise Components


// Services
document.addEventListener('DOMContentLoaded', function () {
	// Accordion
	(0, _from2.default)(document.querySelectorAll('.js-accordion')).forEach(function (el) {
		return new _accordion2.default(el);
	});
	// Cookieprompt
	(0, _from2.default)(document.querySelectorAll('.js-cookieprompt')).forEach(function (el) {
		return new _cookieprompt2.default(el);
	});
	// Header
	(0, _from2.default)(document.querySelectorAll('.global-header')).forEach(function (el) {
		return new _globalheader2.default(el);
	});
	// Icon
	(0, _from2.default)(document.querySelectorAll('[data-icon-embed]')).forEach(function (el) {
		return new _icon2.default(el);
	});
	// Modal
	(0, _from2.default)(document.querySelectorAll('.js-modal')).forEach(function (el) {
		return new _modal2.default(el);
	});
	// Skiplinks
	(0, _from2.default)(document.querySelectorAll('.js-skiplink')).forEach(function (el) {
		return new _skiplink2.default(el, document.querySelector('body'));
	});
	// Tab
	(0, _from2.default)(document.querySelectorAll('.js-tab')).forEach(function (el) {
		return new _tab2.default(el);
	});
	// Table
	(0, _from2.default)(document.querySelectorAll('.js-table')).forEach(function (el) {
		return new _table2.default(el);
	});
});

/**
 * Public API
 * @public
 * @type {Object}
 */


// Legacy JS


// Components
/*
 * Barclays Design Language
 * @desc BDL entry point
 * @version 1.13.0
 */

// Polyfills
var API = {
	Components: {
		Accordion: _accordion2.default,
		Cookieprompt: _cookieprompt2.default,
		Header: _globalheader2.default,
		Icon: _icon2.default,
		Modal: _modal2.default,
		Skiplink: _skiplink2.default,
		Tab: _tab2.default,
		Table: _table2.default
	},
	Util: _util2.default,
	Icons: _icons2.default,
	getAllComponents: _component2.default.getAllComponents,
	getComponent: _component2.default.getComponent
};

window.bdl = API;

},{"./components/accordion":68,"./components/cookieprompt":69,"./components/globalheader":70,"./components/icon":71,"./components/modal":72,"./components/skiplink":73,"./components/tab":74,"./components/table":75,"./services/component":76,"./services/extends":77,"./services/icons":78,"./services/util":79,"babel-runtime/core-js/array/from":1,"classlist-polyfill":6}],68:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('../services/util');

var _util2 = _interopRequireDefault(_util);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Accordion Classes
/**
 * Accordion
 * @module Accordion
 * @version 1.13.0
 */
var HASJS_CLASS = 'accordion-hasjs';
var HEADING_CLASS = 'accordion-heading-link';
var HEADING_ACTIVE_CLASS = 'accordion-heading-active';
var CONTENT_WRAPPER_CLASS = 'accordion-content-wrapper';
var CONTENT_TRANSITIONING_CLASS = 'accordion-content-transitioning';
var CONTENT_CLOSED_CLASS = 'accordion-content-closed';
var CONTENT_CLASS = 'accordion-content';

// Accordion Data Attributes
var DATA = {
	OPEN: 'data-accordion-open',
	MULTIPLE: 'data-accordion-multiple',
	TRANSITION: 'data-accordion-transition'
};

/**
 * Create a new Accordion component
 * @class
 */

var Accordion = function () {
	/**
  * Initialise Accordion
  * @public
  * @param {Node} el - Containing Accordion element
  * @return {Boolean} success
  */
	function Accordion(el) {
		var _this = this;

		(0, _classCallCheck3.default)(this, Accordion);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Add *-hasjs class
		el.classList.add(HASJS_CLASS);

		// Store containing element
		this._el = el;
		// Store array of element IDs
		this._ids = [];
		// Get array of all headings
		this._headings = (0, _from2.default)(el.querySelectorAll('.' + HEADING_CLASS));
		// Get array of all content sections
		this._contentSections = (0, _from2.default)(el.querySelectorAll('.' + CONTENT_WRAPPER_CLASS));
		// Check if multiple data attribute is set
		this._allowMultiple = el.getAttribute(DATA.MULTIPLE) !== null;

		// generate IDs
		this._generateIDs();

		// init ARIA attributes
		this._initAriaAttributes(el);

		// close all content sections
		this._closeAllContentSections();

		// Open specific section if anchor exists in URL
		var anchor = this._openAnchor();

		// open all sections with data attribute if no anchor present in URL
		if (!anchor) {
			this._contentSections.forEach(function (section, index) {
				if (section.getAttribute(DATA.OPEN) !== null) {
					_this._openContentSection(index, true);
				}
			});
		}

		// Attach events
		this._attachKeyboardEvents();
		this._attachLinkEvents();

		// Enable transitions
		// Done last so the initial close of content sections isn't transitioned
		this._useTransitions = _util2.default.getEnableTransitions();
		this._transitionSpeeds = _util2.default.getTransitionSpeeds();
		this._transitionViewport = el.getAttribute(DATA.TRANSITION) !== null;

		return this.success;
	}

	/**
  * Set whether multiple components can be opened at once
  * @public
  * @param {Boolean} multiple
  */


	(0, _createClass3.default)(Accordion, [{
		key: 'setAllowMultiple',
		value: function setAllowMultiple(multiple) {
			this._allowMultiple = multiple;
		}

		/**
   * Open section in accordion by id
   * @public
   * @param {String} id
   */

	}, {
		key: 'openSectionById',
		value: function openSectionById(id) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)(this._contentSections), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var section = _step.value;

					if (section.id === id) {
						var index = this._contentSections.indexOf(section);
						this._openContentSection(index);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}

		/**
   * Set whether viewport should transition to content when opened
   * @public
   * @param {Boolean} enable
   * @note Does not work in IE
   */

	}, {
		key: 'setTransitionViewport',
		value: function setTransitionViewport(enable) {
			this._transitionViewport = enable;
		}

		/**
   * Generate IDs for each section from the href
   * @private
   */

	}, {
		key: '_generateIDs',
		value: function _generateIDs() {
			var _this2 = this;

			this._headings.forEach(function (link) {
				var id = link.href.split('#')[1];

				// Store IDs in private object
				_this2._ids.push({
					tab: id + '-tab',
					panel: id
				});
			});
		}

		/**
   * Initialise ARIA attributes
   * @private
   * @param {Node} el - Containing Accordion element
   */

	}, {
		key: '_initAriaAttributes',
		value: function _initAriaAttributes(el) {
			var _this3 = this;

			el.setAttribute('role', 'tablist');
			this._headings.forEach(function (link, index) {
				link.setAttribute('role', 'tab');
				link.setAttribute('aria-selected', false);
				link.setAttribute('aria-expanded', false);
				link.setAttribute('id', _this3._ids[index].tab);
				link.setAttribute('aria-controls', _this3._ids[index].panel);
			});
			this._contentSections.forEach(function (section, index) {
				section.setAttribute('role', 'tabpanel');
				section.setAttribute('aria-hidden', false);
				section.setAttribute('id', _this3._ids[index].panel);
				section.setAttribute('aria-labelledby', _this3._ids[index].tab);
			});
		}

		/**
   * Attach keyboard events
   * @private
   */

	}, {
		key: '_attachKeyboardEvents',
		value: function _attachKeyboardEvents() {
			var _this4 = this;

			this._headings.forEach(function (link, index) {
				link.addEventListener('keydown', function (e) {
					if (/(40|39|38|37|36|35|32)/.test(e.keyCode)) {
						e.preventDefault();
					}

					if (/(40|39)/.test(e.keyCode)) {
						// Down/Right arrow
						if (index < _this4._headings.length - 1) {
							_this4._headings[index + 1].focus();
						} else {
							_this4._headings[0].focus();
						}
					} else if (/(38|37)/.test(e.keyCode)) {
						// Up/Left arrow
						if (index === 0) {
							_this4._headings[_this4._headings.length - 1].focus();
						} else {
							_this4._headings[index - 1].focus();
						}
					} else if (e.keyCode === 36) {
						// Home key
						_this4._headings[0].focus();
						_this4._openContentSection(0);
					} else if (e.keyCode === 35) {
						// End key
						_this4._headings[_this4._headings.length - 1].focus();
						_this4._openContentSection(_this4._headings.length - 1);
					} else if (e.keyCode === 32) {
						// Space key
						if (link.getAttribute('aria-expanded') === 'true') {
							_this4._closeContentSection(index);
						} else {
							_this4._openContentSection(index);
						}
					}
				});
			});
		}

		/**
   * Attach click events to this._headings
   * @private
   */

	}, {
		key: '_attachLinkEvents',
		value: function _attachLinkEvents() {
			var _this5 = this;

			this._headings.forEach(function (link, index) {
				link.addEventListener('click', function (e) {
					e.preventDefault();
					if (link.getAttribute('aria-expanded') === 'true') {
						_this5._closeContentSection(index);
					} else {
						_this5._openContentSection(index);
					}
				});
			});
		}

		/**
   * Set Content section element height to child height
   * @private
   * @param {Integer} index - Index of content section
   * @param {Integer} height - Optional height (will override the child's height)
   * @returns {Boolean} success
   */

	}, {
		key: '_setContentSectionHeight',
		value: function _setContentSectionHeight(index) {
			var section = this._contentSections[index];
			if (section) {
				var height = section.querySelector('.' + CONTENT_CLASS).clientHeight || 0;
				section.style.maxHeight = height + 'px';
				return height > 0;
			}
			return false;
		}

		/**
   * Open specific section if anchor is present
   * @private
   * @returns {Boolean} success
   */

	}, {
		key: '_openAnchor',
		value: function _openAnchor() {
			// Strip out illegal chars from hash
			var id = window.location.hash.replace(/[^0-9a-z_-]/gi, '');
			// Check if element with corresponding ID exists in the DOM
			var el = id && this._el.querySelector('#' + id);
			if (el) {
				// Open specific section
				this._openContentSection(this._contentSections.indexOf(el), true);
				return true;
			}
			return false;
		}

		/**
   * Close all content sections
   * @private
   */

	}, {
		key: '_closeAllContentSections',
		value: function _closeAllContentSections() {
			var _this6 = this;

			// Update all headings
			this._headings.forEach(function (heading) {
				heading.setAttribute('aria-selected', false);
				heading.setAttribute('aria-expanded', false);
				heading.classList.remove(HEADING_ACTIVE_CLASS);
			});
			// Close all content sections
			this._contentSections.forEach(function (section, index) {
				_this6._closeContentSection(index);
			});
		}

		/**
   * Close content section
   * @private
   * @param {Integer} index - Index of content section to close
   */

	}, {
		key: '_closeContentSection',
		value: function _closeContentSection(index) {
			var _this7 = this;

			var heading = this._headings[index];
			var section = this._contentSections[index];

			// If section isn't closed
			if (heading && section && !section.classList.contains(CONTENT_CLOSED_CLASS)) {
				// Update heading
				heading.setAttribute('aria-selected', false);
				heading.setAttribute('aria-expanded', false);
				heading.classList.remove(HEADING_ACTIVE_CLASS);

				if (this._useTransitions) {
					// To transition the content section closed, we must first manually set the height
					this._setContentSectionHeight(index);
					section.classList.add(CONTENT_TRANSITIONING_CLASS);
					// Pause before removing the height attribute
					setTimeout(function () {
						section.style.maxHeight = null;
						// Wait for transition to finish before updating the class
						setTimeout(function () {
							section.classList.add(CONTENT_CLOSED_CLASS);
							section.classList.remove(CONTENT_TRANSITIONING_CLASS);
						}, _this7._transitionSpeeds.medium - 1);
					}, 1);
				} else {
					// No transition, just add closed class
					section.classList.add(CONTENT_CLOSED_CLASS);
				}
				section.setAttribute('aria-hidden', true);
			}
		}

		/**
   * Open content section
   * @private
   * @param {Integer} index - Index of content section to show
   * @param {Boolean} noTransitions - Force disable transitions
   */

	}, {
		key: '_openContentSection',
		value: function _openContentSection(index, noTransitions) {
			// Close all if multiple aren't allowed
			if (!this._allowMultiple) {
				this._closeAllContentSections();
			}
			var heading = this._headings[index];
			var section = this._contentSections[index];

			if (heading && section) {
				// Update headings
				heading.classList.add(HEADING_ACTIVE_CLASS);
				heading.setAttribute('aria-selected', true);
				heading.setAttribute('aria-expanded', true);

				// Open content section
				if (!noTransitions && this._useTransitions) {
					// Remove closed/closing class and add opening class and height
					section.classList.remove(CONTENT_TRANSITIONING_CLASS);
					section.classList.remove(CONTENT_CLOSED_CLASS);
					section.classList.add(CONTENT_TRANSITIONING_CLASS);
					this._setContentSectionHeight(index);
					// Pause and remove opening class and height
					setTimeout(function () {
						section.classList.remove(CONTENT_TRANSITIONING_CLASS);
						section.style.maxHeight = null;
					}, this._transitionSpeeds.medium);
				} else {
					// No transition, just remove closing/closed classed
					section.classList.remove(CONTENT_TRANSITIONING_CLASS);
					section.classList.remove(CONTENT_CLOSED_CLASS);
				}
				section.setAttribute('aria-hidden', false);

				// Transition viewport if enabled
				if (!noTransitions && this._transitionViewport) {
					this._transitionViewportToSection(index);
				}
			}
		}

		/**
   * Transition viewport to section
   * @private
   * @param {Integer} index - Index of content section to transition to
   */

	}, {
		key: '_transitionViewportToSection',
		value: function _transitionViewportToSection(index) {
			var _this8 = this;

			// Test if scroll method exists
			if (window.scrollBy) {
				(function () {
					// Stop any existing transitions
					clearInterval(_this8._transitionViewportInterval);

					var link = _this8._headings[index];
					var headerHeight = _util2.default.getHeaderHeight() + 10; // px height of header

					// Get destination
					var accordionPos = _util2.default.getElementPosition(_this8._el).top - headerHeight;
					var currentPos = _util2.default.getViewportPosition().top;
					var destination = accordionPos + link.clientHeight * index;

					var interval = 100 / 6; // 60fps
					var distance = Math.abs(destination - currentPos);
					var scrollStep = distance / (_this8._transitionSpeeds.fast / interval);
					var down = destination > currentPos; // true = down, false = up
					// Start transition
					_this8._transitionViewportInterval = setInterval(function () {
						window.scrollBy(0, down ? scrollStep : -scrollStep);
						// test if we should stop scrolling
						var pos = _util2.default.getViewportPosition().top;
						if (pos === currentPos || down && pos > destination || !down && pos < destination) {
							// Stop scroll
							clearInterval(_this8._transitionViewportInterval);
							window.scrollTo(0, destination);
						}
						currentPos = pos;
					}, interval);
				})();
			}
		}
	}]);
	return Accordion;
}();

// Initialise all elements on DOM ready


document.addEventListener('DOMContentLoaded', function () {
	(0, _from2.default)(document.querySelectorAll('.js-accordion')).forEach(function (el) {
		return new Accordion(el);
	});
});

exports.default = Accordion;

},{"../services/component":76,"../services/util":79,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],69:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CLOSING_CLASS = 'cookieprompt-close';

/**
 * Create a new Cookieprompt component
 * @class
 */
/**
 * Cookieprompt
 * @module Cookieprompt
 * @version 1.13.0
 */

var Cookieprompt = function () {
	/**
  * Initialise Cookieprompt
  * @public
  * @param {Node} el - Containing Cookieprompt element
  * @param {Callback} callback - Optional callback when button is clicked
  * @return {Boolean} success
  */
	function Cookieprompt(el, callback) {
		var _this = this;

		(0, _classCallCheck3.default)(this, Cookieprompt);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Store containing element
		this._el = el;
		// Store callback
		this.setCallback(callback);

		el.querySelector('.btn').addEventListener('click', function (e) {
			e.preventDefault();

			// Add closing class
			el.classList.add(CLOSING_CLASS);

			// Remove node after delay
			setTimeout(function () {
				return el.parentNode.removeChild(el);
			}, 500);

			// Execute callback
			if (_this._callback) _this._callback();
		});

		return this.success;
	}

	/**
  * Set callback
  * @public
  * @param {Function} callback
  * @return {Boolean} success
  */


	(0, _createClass3.default)(Cookieprompt, [{
		key: 'setCallback',
		value: function setCallback(callback) {
			if (typeof callback === 'function') {
				this._callback = callback;
				return true;
			}
			return false;
		}
	}]);
	return Cookieprompt;
}();

exports.default = Cookieprompt;

},{"../services/component":76,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],70:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Header
 * @module Header
 * @version 1.13.0
 */

/* eslint-disable */
var Header = function ($) {

	// Global state variables
	var state = '';
	var windowHeight, windowWidth;
	var headerHeight;
	var heights = {
		segment: {
			mobile: 36,
			tablet: 36,
			desktop: 36,
			minimised: 0
		},
		header: {
			mobile: 54,
			tablet: 66,
			desktop: 126,
			minimised: 54
		}
	};
	var breakpoints = {
		desktop: {
			min: 1024,
			max: 9999
		},
		tabletPortrait: {
			min: 768,
			max: 1023
		},
		mobile: {
			min: 1,
			max: 767
		}
	};
	var options = {
		basepath: '/bdl/',
		form: {
			addModClassName: true
		},
		gridType: null,
		hasTouch: false,
		log: {
			enabled: false
		},
		modsForInit: {},
		modsInPage: {},
		overlayActive: false,
		tapOrClickEvent: 'click',
		timings: {
			resizeDebounce: 50,
			scrollDebounce: 15,
			debounce: 250
		},
		windowHeight: getViewportElement().height(),
		windowWidth: window.innerWidth || $(window).width(),
		ariaDescribedby: {
			ariaOpenConfirm: 'sub heading level 2 of expanded menu item level 1.',
			ariaLeftRightArrowMoveBetweenHeading: 'Use left and right arrow to move around sub heading of menu.',
			ariaUpDownArrow: 'Use up and down arrow or tab to navigate between each link and section.',
			ariaClearField: 'Press enter to clear text field.'
		}
	};

	/*
  * Return window or viewport if parallax is enabled
  */
	function getViewportElement() {
		var parallax = $('.parallax-viewport');
		return parallax.length ? parallax : $(window);
	}

	function Header() {

		// Call size function. Sets up initial state variable
		size();

		// Update state variable
		updateState();

		// Setup initial state
		changeState(state);

		// state change on scroll
		onScrollChangeState();

		// update segment when on scroll
		onScrollSegmentBar();

		// Resize
		resize();

		// Setup Utilities list for Desktop state
		getUtilities();

		// show segment bar
		$('body').addClass('segment-visible');
		// wait and enable transitions
		setTimeout(function () {
			$('.global-header .segment').addClass('segment-transition');
		}, 250);

		appendAriaDescription();
	}

	/*
 * Appends all the description from object options.ariaDescribedby to body.
 */
	function appendAriaDescription() {
		for (var key in options.ariaDescribedby) {
			var descriptionItem = $('<p>').attr({ 'class': 'access', 'aria-hidden': 'true', 'id': key }).text(options.ariaDescribedby[key]);
			$('.global-header').append(descriptionItem);
		}
	}

	/*
 * Reset and initialise bindings, update header class
 *@param (string) : State to be changed to
 */

	function changeState(toState) {

		$('header').removeClass().addClass('global-header js-globalheader ' + toState);

		$('.main-nav').find('.active').removeClass('active');

		resetStateEvents();

		initialiseState(toState);

		updateBodyClasses();
	}

	/*
 * Reset and initialise bindings
 */

	function resetStateEvents() {
		$('.global-header, .global-header *').unbind();
	}

	/*
 * State router
 */

	function initialiseState(toState) {

		switch (toState) {

			case 'minimised':
				minimised();
				break;

			case 'tablet-portrait':
				tabletPortrait();
				break;

			case 'tablet-portrait-nav':
				tabletPortraitNav();
				break;

			case 'tablet-portrait-sub-nav':
				tabletPortraitSubNav();
				break;

			case 'mobile':
				mobile();
				break;

			case 'mobile-nav':
				mobileNav();
				break;

			case 'mobile-sub-nav':
				mobileSubNav();
				break;

			case 'mobile-sub-nav-l3':
				mobileSubNavL3();
				break;

			case 'desktop':
				desktop();
				break;

			default:
				desktop();
				break;

		}
	}

	function overlay(flag, overlayDom, id) {
		//overlayDom, overlayContent
		if (flag === 'hide') {
			$('.overlay-light-box').remove();
		}
		if (flag === 'show') {
			if ($('#' + id).length === 0) {
				var overlayEle = $('<div>').attr({ 'id': id, 'class': 'overlay-light-box' }).css('height', $('body').height());
				$(overlayDom).before(overlayEle);
				$(overlayEle).on('click', function () {
					overlay('hide');
				});
			}
		}
	}

	//	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------


	/*
 * Initialise Desktop
 */
	function desktop() {

		//Set up Global state variable to Desktop
		state = 'desktop';
		// Show segment bar
		$('body').addClass('segment-visible');
		headerHeight = heights.header.desktop + heights.segment.desktop;
		// if nav-l2 is open set height of header accordingly
		if ($('.global-header').outerHeight() > 126) {
			var openItem = $('.global-header').find('.nav-l2.selected');
			var openItemHeight = openItem.outerHeight();

			headerHeight += openItemHeight;
		}

		// Set up height of the Header
		$('.global-header').css('height', headerHeight + 'px');

		// Clear any hung over dynamic/inline styles
		resetStyles();

		//Aria nav-l2 to headings
		$('.global-header .nav-l2 > ul > li > a').attr('role', 'heading');

		//resets
		$('.global-header .header-nav').removeAttr('style');

		$('.utilities a span').removeClass('access');

		// Create more before Navigation events are bound
		more();

		// navigation
		navigation();

		// search
		searchBar();
	}

	//	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------

	/*
 * Initialise minimised
 */
	function minimised() {

		state = 'minimised';

		// Clear any hung over dynamic/inline styles
		resetStyles();

		calcWidthMinimised();

		headerHeight = 54;

		// if nav-l2 is open set height of header accordingly
		if ($('.global-header').outerHeight() > 54) {

			var openItem = $('.global-header').find('.nav-l2.selected');
			var openItemHeight = openItem.outerHeight();

			headerHeight += openItemHeight;
		}

		// else set to height of headerHeight
		$('.global-header').css('height', headerHeight + 'px');

		$('.global-header .header-nav .main-nav').hide().show(function () {
			more();
			navigation();
			searchBar();
			$('.global-header .header-nav .main-nav').addClass('visible');
		});

		//Focus outside search bar on shift + tab

		var shiftTab = false;
		$('.global-header .search-bar input').on({
			keydown: function keydown(event) {
				if (/9/.test(event.which) && event.shiftKey) {
					// Shift+Tab
					event.preventDefault();
					closeSearch();
					$('.global-header .branch-finder a').focus();
				}
			}
		});
	}

	var lastScrollTop = 0,
	    lastStateChange = 0,
	    st = 0;

	function isScrollPosNearStateChange(scrollPos) {
		var buffer = 25; //px
		return scrollPos > lastStateChange - buffer && scrollPos < lastStateChange + buffer;
	}

	function onScrollChangeState() {
		//Storing if space keycode was trigger to prevent the scroll on header apart from where it is required.
		$('.global-header').on('keydown', function (event) {
			options.currentEvent = event.which;
		});

		if (options.currentEvent !== 32) {
			// Not space

			overlay('hide');
			getViewportElement().scroll($.debounce(function (event) {
				var isMoreOpen = $('.global-header .header-nav .main-nav li.more').hasClass('open');

				if (!isMoreOpen && (state === 'desktop' || state === 'minimised')) {

					if (state === 'desktop') {
						$('.global-header .header-nav .main-nav').show();
					}
				}
				st = $(this).scrollTop();
				var bottom = $('body').height() - $(window).height();
				if (st > 50 && // 50px buffer at the top
				st > lastScrollTop && // scroll position is greater than the last position
				!isScrollPosNearStateChange(st)) {
					// small buffer to prevent frequent state changes
					$('body').removeClass('segment-visible');
					if (state === 'desktop') {
						// state is currently desktop
						$('.global-header .header-nav .main-nav').removeClass('main-nav-hide');
						state = 'minimised';
						changeState(state);
						overlay('hide');
					}
					var h = heights.header[state.split('-')[0]];
					$('.global-header').css('height', h + 'px');
					lastStateChange = st;
				} else if (st < bottom && // scroll position is less than document height
				st < lastScrollTop && // scroll position is less than last position
				!isScrollPosNearStateChange(st)) {
					// small buffer to prevent frequent state changes
					$('body').addClass('segment-visible');
					if (state === 'minimised') {
						// state is currently minimised
						$('.global-header .header-nav .main-nav').show().removeClass('visible');
						state = 'desktop';
						changeState(state);
						overlay('hide');
					}
					var h = heights.header[state.split('-')[0]];
					var s = heights.segment[state.split('-')[0]];
					$('.global-header').css('height', h + s + 'px');
					lastStateChange = st;
				}
				lastScrollTop = st;
			}, 100));
		}
	}

	function onScrollSegmentBar() {
		$('.global-header .segment-body').on('scroll', function (event) {
			if (event.target.scrollLeft + event.target.clientWidth === event.target.scrollWidth) {
				$(this).addClass('segment-body-scrollend');
			} else {
				$(this).removeClass('segment-body-scrollend');
			}
		});
	}

	function onScrollNav() {
		$('.nav-l2').on('scroll', function (event) {
			if (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight) {
				$(this).addClass('nav-l2-scrollend');
			} else {
				$(this).removeClass('nav-l2-scrollend');
			}
		});
	}

	//	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------


	function navigation() {

		//notes:
		//1) attribute 'data-menustate' is set to true or false based on the menu dropdown is opending or closed
		//2) attribure 'data-interaction' is set to true of false to identify if the user is mouse user or a pure keyborad user.
		var $header = $('.global-header');
		var $mainNav = $header.find('.main-nav');
		var $primaryNav = $mainNav.find(' > ul > li');
		var $secondaryNav = $mainNav.find('.nav-l2');
		var $teritaryNav = $secondaryNav.find('.nav-l3 li');
		var dom;

		$header.attr('data-interaction', 'mouse');

		$header.on({
			mouseenter: function mouseenter() {

				// For 'more' this can be triggered by scroll when using tab nav -
				// Do not update data interaction in this case
				var moreOpen = $('.more', this).hasClass('open');

				if (!moreOpen) {
					$header.attr('data-interaction', 'mouse');
					$header.removeClass('keyboard');
				}
			},
			keydown: function keydown(event) {
				if (/(38|40)/.test(event.which)) {
					// Up/Down arrow
					event.preventDefault();
				}
			},
			keyup: function keyup() {
				$header.attr('data-interaction', 'keyboard');
				$header.addClass('keyboard');
			}

		});

		$header.find('.header-main .header-container').on({
			focusin: function focusin() {
				hideNav();
			}
		});

		$mainNav.attr('data-menustate', 'closed');

		$mainNav.on({
			mouseleave: function mouseleave() {

				$(this).find('.nav-l2').hide();
			}
		}).find('a').on('click', function (event) {

			if ($(this).attr('href') === '#') {
				event.preventDefault();
			}
		});

		$primaryNav.not('.more').on({

			mouseenter: function mouseenter() {

				if ($header.attr('data-interaction') === 'mouse') {
					displayNav($(this));
					if (!options.hasTouch) {
						menuOverlay();
					}
				}

				$('.global-header').removeClass('search-open');

				closeSearch();
			},
			mouseleave: function mouseleave() {

				hideNav('keepOverlay');
				clearTimeout(overlayDelay);
			},
			click: function click(event) {
				if ($header.attr('data-interaction') === 'keyboard') {

					if ($mainNav.attr('data-menustate') === 'closed') {
						displayNav($(this));
						menuOverlay();
					} else {
						hideNav();
					}
				}

				if ($header.attr('data-interaction') === 'mouse') {
					hideNav('keepOverlay');
					displayNav($(this));
					if (!$('.overlay-light-box').hasClass('visible')) {
						menuOverlay();
					}
				}

				if ($(this).children().length === 1) {

					$(this).addClass('active').siblings().removeClass('active');

					$(this).siblings().find('li').removeClass('active');
				}
			},
			keyup: function keyup(event) {
				event.stopPropagation();
				if ($header.hasClass('.search-open')) {
					$header.find('.search-close').trigger('click');
				}

				//ARIA
				if ($mainNav.attr('data-menustate') === 'open') {
					$header.find('.nav-l2,.nav-l3').attr('aria-hidden', 'false');
				}
				$secondaryNav.find('>ul>li').attr('aria-haspopup', 'false');

				if (/32/.test(event.which)) {
					// Space
					event.preventDefault();
					$(this).trigger('click');
				}

				if (/27/.test(event.which)) {
					// Esc
					hideNav();
				}

				if (/9/.test(event.which)) {
					// Tab
					dom = $(this).find('>a');
					focusMenu();
					hideNav();

					// More
					var inMainNav = $(this).closest('.header-nav');
					var isMore = $(this).hasClass('more');

					if (inMainNav.length && !isMore) {
						hideMoreNavigation();
					}
				}

				if (/40/.test(event.which)) {
					// Down arrow
					dom = $(this).find('.nav-l2 > ul > li:first-child >a').focus();
				}

				// Arrow key right for main menu
				if (/39/.test(event.which)) {
					// Right arrow
					if ($(this).next().length === 1) {
						dom = $(this).next().find('>a');
						focusMenu();
						hideNav();
					}
				}

				// Arrow key left for main menu
				if (/37/.test(event.which)) {
					// Left arrow
					event.stopPropagation();
					if ($(this).prev().length === 1) {
						dom = $(this).prev().find('>a');
						focusMenu();
						hideNav();
					}
				}

				if (/38/.test(event.which)) {
					// Up arrow
					event.preventDefault();
				}

				if ($('.global-header').hasClass('search-open')) {
					closeSearch();
				}
			},
			focusout: function focusout() {
				clearTimeout(overlayDelay);
			}
		});

		var overlayDelay;

		function menuOverlay() {
			if (!$('.overlay-light-box').hasClass('visible')) {
				overlayDelay = setTimeout(function () {
					overlay('show', '.global-header');
					$('.overlay-light-box').show().addClass('visible');
				}, 250);
			}
		}

		$('.global-header .main-nav > ul').on({
			mouseleave: function mouseleave() {

				overlay('hide');
			}
		});

		$secondaryNav.find('li').on('keyup', function (event) {
			var isNavl3Present = $(event.target).next().hasClass('nav-l3');
			var activePrimaryNav = $(event.target).closest('.nav-l2').parent();
			var closesetNavL3 = $(event.target).closest('.nav-l3');
			var nextMenuItem = $(event.target).parent().next();
			var closesetNavL2 = $(event.target).closest('.nav-l2 > ul > li');
			var relatedPrimaryNav = $(event.target).offsetParent().parent();

			event.stopPropagation();
			event.preventDefault();

			//on pressing esc key in between naviation
			if (/27/.test(event.which)) {
				// Esc
				hideNav();
				activePrimaryNav.find('>a').focus();
			}

			//on keybord down arrow
			if (/40/.test(event.which)) {
				// Down arrow
				if (isNavl3Present) {
					// secondary menu
					dom = $(event.target).next().find('li:first-child a');
				} else {
					// teritary menu
					if (nextMenuItem.length === 1) {
						dom = nextMenuItem.find('a');
					} else if (nextMenuItem.length === 0) {
						if (closesetNavL2.next().length === 0) {
							dom = $(event.target).closest('.nav-l2').parent().next().find('>a');
							hideNav();
						} else {
							dom = closesetNavL2.next().find('>a');
						}
					}
				}
			}

			//on keybord up arrow
			else if (/38/.test(event.which)) {
					// Up arrow
					var prevMenuItem = $(event.target).parent().prev();
					if (isNavl3Present) {
						// secondary menu
						if ($(event.target).parent().prev().length === 0) {
							dom = relatedPrimaryNav.find('> a');
						} else {
							dom = $(event.target).parent().prev().find(' li:last-child a');
						}
					} else {
						// teritary menu
						if (prevMenuItem.length === 1) {
							dom = prevMenuItem.find('a');
						} else if (prevMenuItem.length === 0) {
							dom = closesetNavL3.prev();
						}
					}
				} else {
					dom = $(event.target);
				}

			// secondary nav horizonal keyboard navigation
			if (/39/.test(event.which)) {
				// Right arrow
				if (closesetNavL2.next().length === 0) {
					dom = relatedPrimaryNav.find('> a');
				} else {
					dom = closesetNavL2.next().find('>a');
				}
			}

			if (/37/.test(event.which)) {
				// Left arrow
				if (closesetNavL2.prev().length === 0) {
					dom = relatedPrimaryNav.find('> a');
				} else {
					dom = closesetNavL2.prev().find('>a');
				}
			}
			if (event.which !== 27) {
				// Esc
				dom.focus();
			}
		});

		$secondaryNav.find('> ul > li > a').on('click', function (event) {
			event.preventDefault();
		});

		$teritaryNav.on({

			click: function click(event) {
				var activePrimaryNav = $(event.target).closest('.nav-l2').parent();

				// Clear all active states from items but NOT those in the hidden 'more' navigation
				$header.find('.header-nav .main-nav > ul > li:not(.more-item)').removeClass('active');

				$header.find('.header-nav .main-nav > ul > li:not(.more-item) .nav-l3 li').removeClass('active').attr('aria-selected', 'false');

				$header.find('.header-more .main-nav li').removeClass('active').attr('aria-selected', 'false');

				// Add active states
				$(this).closest('li').addClass('active').attr('aria-selected', 'true');

				// l2 headers need to be set to active for mobile state
				$(this).closest('.nav-l3').closest('li').addClass('active');

				$(this).offsetParent().parent().attr('aria-selected', 'true').siblings().attr('aria-selected', 'false');

				$(this).offsetParent().parent().addClass('active');

				hideNav();

				activePrimaryNav.find('>a').focus();
			},

			keydown: function keydown(event) {
				var activePrimaryNav = $(event.target).closest('.nav-l2').parent();
				var closesetNavL3 = $(event.target).closest('.nav-l3');
				var nextPrimaryNav = activePrimaryNav.next();
				//tabbing
				if (/9/.test(event.which)) {
					// Tab
					if (nextPrimaryNav.length === 0) {
						var nextSetofmenu = closesetNavL3.parent();
						if (nextSetofmenu.length === 1 && nextSetofmenu.next().length === 0) {
							hideNav();
						}
					}
				}
			}
		});

		function focusMenu() {
			dom.focus();
		}

		function displayNav(navItem) {

			var navHeight;

			navItem.find('.nav-l2').css('display', 'block');

			navHeight = navItem.find('.nav-l2').outerHeight();

			// Check for 'More' being opened
			var moreOpen = $('.global-header .header-more').hasClass('open');
			var moreHeight = 54;

			if (state === 'minimised') {

				if (moreOpen) {
					headerHeight = 54 + moreHeight;
				} else {
					headerHeight = 54;
				}
			} else if (state === 'desktop') {

				if (moreOpen) {
					headerHeight = 126 + moreHeight;
				} else {
					headerHeight = 126;
				}
			}

			$('.global-header').css('height', headerHeight + navHeight + 'px');

			navItem.find('.nav-l2').addClass('selected');

			$mainNav.attr('data-menustate', 'opened');
			//aria
			navItem.find('.nav-l2,.nav-l3').attr('aria-hidden', 'false');
			navItem.find('>a').attr('aria-expanded', 'true');
		}

		function hideNav(overlayState) {

			if ($mainNav.attr('data-menustate') === 'opened') {

				if (overlayState !== 'keepOverlay') {
					overlay('hide');
				}

				$secondaryNav.hide();
				$mainNav.find('>ul>li>a').attr('aria-expanded', 'false');
				$header.find('.nav-l2,.nav-l3').attr('aria-hidden', 'true');
				$header.find('.nav-l2').removeClass('selected');
				$mainNav.attr('data-menustate', 'closed');

				if (state === 'minimised') {
					headerHeight = 54;
				} else if (state === 'desktop') {
					headerHeight = 126;
				}

				$header.css('height', headerHeight + 'px');
			}
		}
	}

	// -----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------

	/*
 * Initialise Tablet Portrait
 */
	function tabletPortrait() {

		state = 'tablet-portrait';

		// Set up height of the Header
		headerHeight = heights.header.tablet + heights.segment.tablet;

		$('.global-header').css('height', headerHeight + 'px');

		// Clear/Reset any open states
		$('.global-header .main-nav li').removeClass('open');
		$('.utilities a span').removeClass('access');

		// Clear any hung over dynamic/inline styles
		resetStyles();

		// If close is present reset to menu
		$('.global-header .close span').text('Menu');

		//document.ontouchmove = function(event){
		// event.preventDefault();
		//}

		swapClass('close', 'hamburger');

		addMenuButtonEvent();

		hasTouch();

		searchBarMobile();
	}

	/*
 * Initialise Tablet Portrait Nav
 */
	function tabletPortraitNav() {

		var windowHeight = getViewportElement().height();

		state = 'tablet-portrait-nav';

		//Disable page scroll on menu open
		$('html').css('overflow', 'hidden');

		// //Disable page scroll on menu open for touch devices
		// document.ontouchmove = function(event){
		// 	 event.preventDefault();
		// }


		// Clear/Reset any open states
		$('.global-header .main-nav li').removeClass('open');

		// -------------------------------

		// Update the Menu to Close

		$('.global-header .hamburger span').text('Close');

		swapClass('hamburger', 'close');

		addCloseButtonEvent();

		// -------------------------------

		//Init active NavItem to open
		var firstNavItem = $('.global-header .header-nav .main-nav a:first'),
		    activeNavItem = $('.global-header .header-nav .main-nav li.active'),
		    isActive = $('.global-header .header-nav .main-nav a').closest('li').hasClass('active');

		$('.global-header .header-nav').css('min-height', windowHeight);

		var invSegmentHeight = $('body').hasClass('segment-visible') ? 0 : heights.segment.tablet;
		$('.global-header .nav-l2').css('height', windowHeight - headerHeight + invSegmentHeight + 50);
		//alert(windowHeight+' '+headerHeight+' '+invSegmentHeight);

		// No L1 item currently active
		$('.global-header .header-nav .main-nav li').removeClass('active open');

		// Navigation L1
		$('.global-header .header-nav .main-nav > ul > li > a').on('click', function (event) {

			changeMainNavFormat($(this));

			// Clear/Reset any open states
			$('.global-header .header-nav .main-nav li').removeClass('open');

			// Check this is a click we expect to be handled
			var href = $(this).attr('href');

			if (href === '#' || href === undefined) {

				setActiveOpen(this, 'active open');

				event.preventDefault();
			}
		});

		// update navigation (L2) when on scroll
		onScrollNav();

		// Navigation L3
		$('.global-header .header-nav .main-nav .nav-l3 li').on('click', function (event) {

			$('.global-header').find('.nav-l3 li').removeClass('active');

			$(this).addClass('active');

			$(this).parent().parent().parent().addClass('active').siblings().removeClass('active');

			$(this).offsetParent().parent().addClass('active').siblings().removeClass('active');

			//close menu
			changeState('tablet-portrait');
		});

		hasTouch();

		searchBarMobile();
	}

	/*
 * Initialise Tablet Portrait Sub Nav
 */

	function tabletPortraitSubNav() {

		state = 'tablet-portrait-sub-nav';

		addCloseButtonEvent();
		hasTouch();
	}

	//	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------

	/*
 * Initialise Mobile
 */

	function mobile() {

		//Set up Global state variable to Mobile
		state = 'mobile';

		// Set up height of the Header
		headerHeight = heights.header.mobile + heights.segment.mobile;
		$('.global-header').css('height', headerHeight + 'px');

		// Clear/Reset any open states
		$('.global-header .header-nav .main-nav li').removeClass('open');

		//Area
		$('.global-header .header-nav .main-nav .nav-l2').attr('aria-hidden', 'true');
		$('.global-header .header-nav .main-nav .nav-l3').attr('aria-hidden', 'true');

		// Clear any hung over dynamic/inline styles
		resetStyles();

		// If close is present reset to hanburger
		$('.global-header .close span').text('Menu');
		// $('.utilities a span').addClass('access'); Remove comments if you want to hide the the label text for icons in the mobile state

		swapClass('close', 'hamburger');

		addMenuButtonEvent();

		hasTouch();

		searchBarMobile();
	}

	/*
 * Initialise Mobile Nav
 */
	function mobileNav() {

		state = 'mobile-nav';

		// Add dynanmic heights
		setHeight('.header-nav', 48);

		//Disable page scroll on menu open
		$('html').css('overflow', 'hidden');

		// Clear/Reset any open states
		$('.global-header .header-nav .main-nav li').removeClass('open');

		// Aria
		$('.global-header .header-nav .main-nav .nav-l2').attr('aria-hidden', 'true');
		$('.global-header .header-nav .main-nav .nav-l3').attr('aria-hidden', 'true');

		// -------------------------------

		// Update the Menu to Close

		$('.global-header .hamburger span').text('Close');

		swapClass('hamburger', 'close');

		addCloseButtonEvent();

		// Navigation
		$('.global-header .header-nav .main-nav a').on('click', function (event) {
			// Check this is a click we expect to be handled
			var href = $(this).attr('href');

			if (href === '#' || href === undefined) {

				changeState('mobile-sub-nav');

				setActiveOpen(this, 'active open');

				//Aria
				setAriaStates($(this));

				event.preventDefault();
			}
		});

		hasTouch();

		searchBarMobile();
	}

	/*
 * Initialise Mobile Sub Nav
 */
	function mobileSubNav() {

		state = 'mobile-sub-nav';

		addCloseButtonEvent();

		addBackButtonEvent('mobile-nav');

		// Clear any open states in l2 submenu's
		$('.global-header .header-nav .main-nav .nav-l2 li').removeClass('open');

		// Init Menu Nav

		$('.global-header .header-nav .main-nav a').on('click', function (event) {

			var isBackLink = $(this).parent().attr('data-component-type') === 'MenuItemLevel1';

			// Check this is a click we expect to be handled
			var href = $(this).attr('href');

			// Is the anchor the reporposed type as sub nav header?
			var header = $(this).parent('li').hasClass('open');

			if (isBackLink) {
				event.preventDefault();
				changeState('mobile-nav');
				$('.global-header .main-nav .nav-l3, .global-header .main-nav .nav-l2').attr('aria-hidden', 'true');
			} else if (header) {
				event.preventDefault();
			} else if (href === '#' || href === undefined) {

				changeState('mobile-sub-nav-l3');

				setActiveOpen(this, 'active open');

				//Aria
				setAriaStates($(this));

				event.preventDefault();
			}
		});

		hasTouch();
	}

	/*
 * Initialise Mobile Sub Nav - l3
 */
	function mobileSubNavL3() {

		state = 'mobile-sub-nav-l3';

		addCloseButtonEvent();

		addBackButtonEvent('mobile-sub-nav');

		$('.global-header .header-nav .main-nav a').on('click', function (event) {

			var isBackLink = $(this).parent().attr('data-component-type') === 'MenuItemLevel2';

			// Is the anchor the reporposed type as sub nav header?
			var header = $(this).parent('li').hasClass('open');

			if (isBackLink) {
				event.preventDefault();
				changeState('mobile-sub-nav');
				$('.global-header .main-nav .nav-l3, .global-header .main-nav .nav-l2').attr('aria-hidden', 'true');
			} else if (header) {
				event.preventDefault();
			} else {
				setActiveOpen(this, 'active');

				//Aria
				setAriaStates($(this));

				//close menu
				changeState('mobile');
			}
		});

		hasTouch();
	}

	/*
 * Mobile Supporting functions/utils
 */

	function addMenuButtonEvent() {

		$('.global-header .hamburger a').on('click', function (event) {

			if (state === 'tablet-portrait') {
				changeState('tablet-portrait-nav');
			} else {
				changeState('mobile-nav');
			}

			event.preventDefault();
		});
	}

	function addCloseButtonEvent() {

		$('.global-header .close a').on('click', function (event) {

			if (state === 'tablet-portrait-nav' || state === 'tablet-portrait-sub-nav') {
				changeState('tablet-portrait');
			} else {
				changeState('mobile');
			}

			//Reset page scroll on menu close
			$('html').css('overflow', '');

			event.preventDefault();
		});
	}

	function addBackButtonEvent(backToState) {

		$('.global-header a.back').on('click', function (event) {

			changeState(backToState);

			if (backToState === 'mobile-sub-nav') {
				$('.global-header .header-nav .main-nav .nav-l3').attr('aria-hidden', 'true');
			}

			if (backToState === 'mobile-nav') {
				$('.global-header .header-nav .main-nav .nav-l2').attr('aria-hidden', 'true');
			}

			event.preventDefault();
		});
	}

	function setActiveOpen(item, addClasses) {

		var parentList = $(item).closest('ul');

		var isActive = $(item).closest('li').hasClass('active');

		// If new selection clear sub active states
		if (!isActive) {
			// Clear any active states
			$('li', parentList).removeClass('open').removeClass('active');
		}

		$(item).closest('li').addClass(addClasses);
	}

	function setAriaStates(el) {
		// Aria show hide nav section
		el.next().attr('aria-hidden', 'false');

		// Aria checking the selected area
		$('.global-header .main-nav li').attr('aria-selected', 'false');
		$('.global-header .main-nav li.active').attr('aria-selected', 'true');
	}

	function swapClass(oldClass, newClass) {
		var previousState = oldClass === 'hamburger' ? 'menu' : 'close';
		$('.global-header .' + oldClass + ' a').attr('data-previous-state', previousState);
		$('.global-header .' + oldClass).removeClass(oldClass).addClass(newClass).attr('ariaDescribedby', 'ariaTapexpand');
	}

	function setHeight(classPath, offset) {

		var menuHeight = windowHeight - offset;

		$('.global-header ' + classPath).height(menuHeight);
	}

	function resetStyles() {

		$('html').css('overflow', '');
		$('.global-header *').removeAttr('style');

		// Aria removing role heading below desktop view
		$('.global-header .nav-l2 > ul > li > a').removeAttr('role', 'heading');

		resetMainNavFormat();
	}

	function hasTouch() {

		if (options.hasTouch) {

			$('.global-header').removeClass('no-touch');
			$('.global-header').addClass('has-touch');
		} else {

			$('.global-header').removeClass('has-touch');
			$('.global-header').addClass('no-touch');
		}
	}

	/*
 * Initialise Size
 */
	function size() {
		windowHeight = getViewportElement().height();
		windowWidth = $(window).width();
	}

	/*
 * Update State Variable
 */
	function updateState() {

		if (windowWidth >= breakpoints.desktop.min && windowWidth <= breakpoints.desktop.max) {

			state = 'desktop';
		}

		// For viewports greater than our standard desktop - default to desktop
		if (windowWidth >= breakpoints.desktop.max) {

			state = 'desktop';
		}

		if (windowWidth >= breakpoints.tabletPortrait.min && windowWidth <= breakpoints.tabletPortrait.max) {

			state = 'tablet-portrait';
		}

		if (windowWidth >= breakpoints.mobile.min && windowWidth <= breakpoints.mobile.max) {

			state = 'mobile';
		}
	}

	/*
 * Update body classes. Adds the current state class to the body. On state change, remove the previous state class
 */

	function updateBodyClasses() {

		var superStates = ['desktop', 'minimised', 'tablet-portrait', 'tablet-portrait-nav', 'tablet-portrait-sub-nav', 'mobile', 'mobile-nav', 'mobile-sub-nav', 'mobile-sub-nav-l3'];
		var toClasses = '';

		if ($('body').attr('class')) {

			var fromClasses = $('body').attr('class').split(' ');

			for (var i = 0; i < fromClasses.length; i++) {
				if ($.inArray(fromClasses[i], superStates) === -1) {
					toClasses = toClasses + ' ' + fromClasses[i];
				}
			}
		}

		toClasses = toClasses + ' ' + state;

		$('body').removeClass().addClass(toClasses);

		//if ($('body').hasClass('tablet-portrait-nav')) {
		//document.ontouchmove = function(event){
		// event.preventDefault();
		//}
		//}
	}

	/*
 * Resize
 */
	function resize() {
		$(window).resize($.debounce(function () {
			size();

			// How about we don't actually do all this if the state doesn't need changing?
			var currentState = state;

			updateState();
			if (currentState !== state) {
				changeState(state);
				// Setup Utilities list for Desktop state
				getUtilities(); // Should this be in the states? Doesn't seem right here
			}
		}, options.timings.resizeDebounce));
	}

	/*
 * Setup Utilities list for Desktop state
 */
	function getUtilities() {

		var header = $('.global-header.desktop'),
		    utilitiesBar = header.find('.utilities').width(),
		    utilitiesBarList = header.find('.utilities ul').width(),
		    primarylinksWidth = utilitiesBar - utilitiesBarList,
		    viewportWidth = $(window).width() / 2 - primarylinksWidth + 200,
		    utilitiesItems = header.find('.utilities li').length - 1,
		    i,
		    utilityWidth = 0;

		header.find('.utilities li:lt(' + utilitiesItems + ')').show();

		for (i = utilitiesItems; i >= 0; --i) {
			var utilitiesItem = header.find('.utilities li:eq(' + i + ')');

			utilityWidth += utilitiesItem.outerWidth(true);
			if (utilityWidth > viewportWidth) {
				utilitiesItem.hide();
			}
		}
	}

	/*
 * Desktop search bar utility
 */

	function searchBar() {

		// Search bar closed by default for change of state

		closeSearch();

		// On click search icon

		$('.global-header .search a').on({
			click: function click(event) {

				$('.global-header .utilities').hide();
				$('.global-header .search-bar').show();
				$('.global-header .search-bar input').focus();
				$('.global-header').addClass('search-open');
			}
		});

		$('.global-header .search-bar .search-close').on({
			click: function click(event) {
				event.preventDefault();
				closeSearch();
				$('.global-header .search a').focus();
			}
		});

		// Close search bar on press of ESC key

		$('.global-header .search-bar').on({
			keydown: function keydown(event) {
				if (/27/.test(event.which)) {
					// ESC pressed
					closeSearch();
					$('.global-header .search-bar .search-clear').hide();
					$('.global-header .search a').focus();
				}
			}
		});

		// Show/hide clear icon

		$('.global-header .search-bar input').on({
			keydown: function keydown(event) {
				if (/9/.test(event.which)) {
					// Tab
					$(this).parent().find('.global-header .search-bar .search-clear').focus();
				}
			},
			keyup: function keyup() {
				var textValue = $(this).val();
				if (textValue !== '') {
					$('.global-header .search-bar .search-clear').show();
				} else {
					$('.global-header .search-bar .search-clear').hide();
				}
			}
		});

		// Clear input field on click of x icon

		$('.global-header .search-bar .search-clear').on('click', function (event) {
			event.preventDefault();
			$('.search-bar input').val('').focus();
			$(this).hide();
		});
	}

	/*
 * Mobile - Tablet search bar utility
 */

	function searchBarMobile() {

		searchBar();

		$('.global-header .search a').on('click', function (event) {
			$('.global-header.mobile .logo-section').hide();
		});

		// Fix for mobile browser on focus issue
		if (options.hasTouch) {
			$(document).on('focus', '.search-bar input', function () {
				$('.global-header').addClass('position-fix');
				$('html, body').animate({ scrollTop: 0 }, 0);
			});

			$('.search-bar input').on('input', function () {
				$('.global-header').addClass('position-fix');
				$('html, body').animate({ scrollTop: 0 }, 0);
			});

			// Remove fix when out of focus
			$(document).on('blur', '.search-bar input', function () {
				$('.global-header').removeClass('position-fix');
			});
		}
	}

	/*
 * Close search bar utility
 */

	function closeSearch() {

		$('#search-input').val('');
		$('.global-header .search-bar').hide();
		$('.global-header .utilities, .global-header.mobile .logo-section').show();
		$('.global-header').removeClass('search-open');
	}

	//	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------	-----------


	/*
 * Setup More list for desktop, minimised states
 */

	function more() {

		if (state === 'desktop' || state === 'minimised') {

			var morePresent = false;

			var moreOffsetWidth = 140;
			var moreOffsetUsed = false;

			// Get Nav width
			var nav = $('.global-header .header-nav .main-nav');

			nav.css('visibility', 'hidden');

			var navWidth = nav.width();

			var navUlWidth = 50; // Give a default offset for a little breathing room

			var navLiItems = $('.global-header .header-nav .main-nav>ul>li');

			// Remove any previously set more classes
			$(navLiItems).removeClass('more-item'); //.show();// remove show?

			// Remove any previous more li structures
			$('>ul li.more', nav).remove();

			$('.global-header .header-more').remove();

			$(navLiItems).each(function (index) {

				var itemWidth = $(this).outerWidth();

				navUlWidth += itemWidth;

				// Check to see if with exceeds nav


				if (navUlWidth > navWidth) {

					// Add more list item
					$(this).addClass('more-item').hide();

					// Is the ul nav still greater than nav with more added?
					var adjustedUlWidth = navUlWidth - itemWidth + moreOffsetWidth;

					if (adjustedUlWidth > navWidth && moreOffsetUsed === false) {

						// Then hide previous item too
						$(this).prev().addClass('more-item').hide();

						moreOffsetUsed = true;
					}

					morePresent = true;
				}
			});

			if (morePresent) {

				// Do more


				// Test to make sure we have at least 2 items in more
				var moreCount = $('>ul li.more-item', nav).length;

				if (moreCount === 1) {

					$('>ul li.more-item', nav).prev().addClass('more-item').hide();
				}

				// * Construct the more link & nav *

				// More link
				var moreLi = $('<li class=\"more\" aria-haspopup=\"true\" />');
				var moreLink = $('<a href=\"#\" aria-expanded=\"false\"><span>More</span></a>');

				// Add the more link
				$('>ul li.more-item', nav).first().before(moreLi);
				// Append items
				$(moreLink).appendTo(moreLi);

				// More nav
				var headerMore = $('<div class=\"header-more\">');
				var moreContainer = $('<div class=\"header-container\">');
				var moreNav = $('<nav class=\"main-nav\">');
				var moreList = $('<ul class=\"more-list\">');

				$(headerMore).appendTo('.global-header');
				$(moreContainer).appendTo(headerMore);
				$(moreNav).appendTo(moreContainer);
				$(moreList).appendTo(moreNav);

				// Clone the elements to be used in the more navigation
				$('>ul li.more-item', nav).clone().appendTo(moreList).show();

				// Check for active contents of the more-nav
				var isActive = $('.global-header .more-nav .main-nav .more-item').hasClass('active');

				// Set More link to active if present
				if (isActive) {
					$('.global-header .header-nav .main-nav li.more').addClass('active');
				}

				// Bind actions to the more button
				addMoreEvents();
			}
		} else {

			// Clean up any more items
			$('.global-header .header-nav .main-nav > ul li').removeClass('more-item');

			// Make sure more is not present in any other menu structures
			$('.global-header .header-nav .main-nav > ul li.more').remove();
			$('.global-header .header-more').remove();
		}

		nav.css('visibility', 'visible');
	}

	function showMoreNavigation() {

		$('.global-header .header-nav .main-nav li.more').addClass('open').find('>a').attr('aria-expanded', 'true');

		$('.global-header .header-more').addClass('open').show();

		// Copy active states to hidden menu items
		$('.global-header .header-more .main-nav .more-list .nav-l3 a').on('click', function (event) {

			// Copy active states to hidden menu items
			copyActiveState(this);
		});
	}

	function hideMoreNavigation() {

		//Reset page scroll on menu close
		$('html').css('overflow', '');

		$('.global-header .main-nav li.more').removeClass('open').find('>a').attr('aria-expanded', 'false');

		$('.global-header .header-more').removeClass('open').hide();
	}

	function addMoreEvents() {

		/* Button */

		var moreButton = $('.global-header .main-nav li.more>a');
		var headerMore = $('.global-header .header-more');

		$(moreButton).on({

			mouseenter: function mouseenter() {

				overlay('hide');

				closeSearch();

				showMoreNavigation();
			},
			mouseleave: function mouseleave() {

				setTimeout(function () {

					var headerMoreInteractive = $(headerMore).hasClass('interactive');

					if (!headerMoreInteractive) {

						hideMoreNavigation();
					}
				}, 250);
			},
			click: function click(event) {

				event.preventDefault();

				var isOpen = $('.global-header .main-nav li.more').hasClass('open');

				if (isOpen) {
					hideMoreNavigation();
					hideNavForMore();
				} else {
					showMoreNavigation();
				}
			}

		});

		// Accessibility -  more interactions

		$(moreButton).on({

			keyup: function keyup(event) {

				if (/27/.test(event.which)) {
					// Esc

					hideMoreNavigation();
				}

				if (/37/.test(event.which)) {
					// Left arrow

					$(this).closest('li').prev().find('>a').focus();

					hideMoreNavigation();
					hideNavForMore();
				}

				if (/40/.test(event.which)) {
					// Down arrow


					var isOpen = $('.global-header .main-nav li.more').hasClass('open');

					if (isOpen) {

						$('.global-header .header-more .main-nav .more-item >a').first().focus();
					}
				}

				if (/32/.test(event.which)) {
					// Space


					$(this).trigger('click');
				}
			}

		});

		/* More Area */

		$(headerMore).on({

			mouseenter: function mouseenter() {

				$(this).addClass('interactive');
			},
			mouseleave: function mouseleave() {

				$(this).removeClass('interactive');

				hideMoreNavigation();
			}

		});

		/* Up on first item of the nav */

		$('.more-list > li', headerMore).on({

			keyup: function keyup(event) {

				if (/38/.test(event.which)) {
					// Up arrow


					$(moreButton).focus();
				}
			}

		});

		function hideNavForMore() {

			// A Variation on 'hideNav' for more / not ideal
			var header = $('.global-header');
			var mainNavs = $('.global-header .main-nav');
			var secondaryNavs = $('.global-header .main-nav .nav-l2');

			if (mainNavs.attr('data-menustate') === 'opened') {

				overlay('hide');

				secondaryNavs.hide();

				mainNavs.attr('data-menustate', 'closed');

				if (state === 'minimised') {
					headerHeight = 54;
				} else if (state === 'desktop') {
					headerHeight = 126;
				}

				header.css('height', headerHeight + 'px');
			}
		}
	}

	function copyActiveState(activeItem) {

		// Get active item root menu
		var activeItemRoot = $(activeItem).closest('.more-item');
		var activeItemRootLink = $('> a', activeItemRoot);
		// Get root menu item text
		var activeItemRootKey = activeItemRootLink[0].innerText;
		activeItemRootKey = activeItemRootKey.replace(/\s+/g, '');

		// Get item text
		var activeItemKey = activeItem.innerText;
		activeItemKey = activeItemKey.replace(/\s+/g, '');

		// Search for match in more-item's not in '.more'
		var hiddenMoreItems = $('.global-header .header-nav .main-nav > ul > li.more-item');

		var matches = $('a', hiddenMoreItems);

		var filteredMatches = $(matches).filter(function (index) {

			var filterItemKey = this.innerText;
			filterItemKey = filterItemKey.replace(/\s+/g, '');

			//
			//

			if (filterItemKey === activeItemKey) {}

			return filterItemKey === activeItemKey;
		});

		$(filteredMatches).each(function (index) {

			var matchItemRoot = $(this).closest('.more-item');
			var matchItemRootLink = $('> a', matchItemRoot);

			// Get match item root menu item text
			var matchItemRootKey = matchItemRootLink[0].innerText;
			matchItemRootKey = matchItemRootKey.replace(/\s+/g, '');

			if (matchItemRootKey === activeItemRootKey) {

				var matchItemKey = this.innerText;
				matchItemKey = matchItemKey.replace(/\s+/g, '');

				if (matchItemKey === activeItemKey && activeItemKey !== activeItemRootKey) {

					// Check the l2 nav header/key

					// Get/Check active l2 item menu
					var activeL2ItemRoot = $(activeItem).closest('.nav-l2 > ul > li');
					var activeL2ItemRootLink = $('> a', activeL2ItemRoot);

					var activeL2ItemRootKey = activeL2ItemRootLink[0].innerText;
					activeL2ItemRootKey = activeL2ItemRootKey.replace(/\s+/g, '');

					// Get/Check matched l2 item menu
					var matchL2ItemRoot = $(this).closest('.nav-l2 > ul > li');
					var matchL2ItemRootLink = $('> a', matchL2ItemRoot);

					var matchL2ItemRootKey = matchL2ItemRootLink[0].innerText;
					matchL2ItemRootKey = matchL2ItemRootKey.replace(/\s+/g, '');

					if (matchL2ItemRootKey === activeL2ItemRootKey) {

						// Clear any active states in hidden more items
						$('.global-header .header-nav .main-nav li.more-item').removeClass('active');
						$('.global-header .header-nav .main-nav li.more-item li').removeClass('active');

						// Add the new active classes
						$(matchItemRoot).addClass('active');
						$(this).closest('li').addClass('active');

						// Add active to nav-l2
						$(matchL2ItemRoot).addClass('active');
					}
				}
			}
		});
	}

	/*
 * Calculate width of navbar on minimised state, depending on length of utilities bar
 */
	function calcWidthMinimised() {

		var header = $('.global-header.minimised'),
		    headerWidth = header.find('.header-main .header-container').width(),
		    iconWidth = 60,
		    //Width of single icon including margins
		utilitiesBar = header.find('.utilities').width(),
		    utilitiesBarList = header.find('.utilities ul').width(),
		    primarylinksWidth = utilitiesBar - utilitiesBarList,
		    iconsWidth = iconWidth * header.find('.utilities li').length,
		    utilitiesBarMin = primarylinksWidth + iconsWidth; // Width of minimised utilities bar

		// Calculate and assign new width to navigation bar
		var newNavWidth = headerWidth - utilitiesBarMin;

		header.find('.header-nav .main-nav').width(newNavWidth);
	}

	/*
 * Actions on initial click of main navigation item (tablet)
 */

	function changeMainNavFormat(el) {

		el.parents('.header-nav').addClass('main-nav-selected');
		el.parents('ul').addClass('norightborder');
		el.addClass('main-nav-link-focus no-link-highlight');

		el.parent().siblings().find('a').removeClass('main-nav-link-focus').addClass('no-link-highlight');

		el.closest('ul').find('li').addClass('list-activated');
	}

	/*
 * Reset navigation item styling to initial (tablet)
 */

	function resetMainNavFormat() {

		var $el = $('.global-header .header-nav .main-nav > ul > li > a');

		$el.parents('.header-nav').removeClass('main-nav-selected');
		$el.parents('ul').removeClass('norightborder');
		$el.parent().removeClass('extra-height');
		$el.removeClass('main-nav-link-focus no-link-highlight');
		$el.closest('ul').find('li').removeClass('list-activated');
	}

	return Header;
}(jQuery);

exports.default = Header;

},{}],71:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

var _icons = require('../services/icons');

var _icons2 = _interopRequireDefault(_icons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Icon
 * @module Icon
 * @version 1.13.0
 */
var PREFIX = 'icon';
var EMBED_ATTR = 'data-icon-embed';

/**
 * Create a new Icon component
 * @class
 */

var Icon = function () {
	/**
  * Initialise Icon
  * @public
  * @param {Node} el - element to embed SVG in to
  * @param {String} cssName - Optional: name of css file that contains the icons
  * @return {Boolean} success
  */
	function Icon(el) {
		(0, _classCallCheck3.default)(this, Icon);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Store containing element
		this._el = el;

		var name = this._getIconName();
		if (!name) return false;

		var icon = _icons2.default.getIcon(name);
		if (!icon) return false;

		this.success = this._embedSVG(icon.svg);
		return this.success;
	}

	/**
  * Get icon name
  * @private
  * @return {String} Icon name
  */


	(0, _createClass3.default)(Icon, [{
		key: '_getIconName',
		value: function _getIconName() {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = (0, _getIterator3.default)((0, _from2.default)(this._el.classList)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var c = _step.value;

					if (c.indexOf(PREFIX + '-') === 0) {
						return c.replace(PREFIX + '-', '');
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return false;
		}

		/**
   * Embed SVG
   * @private
   * @param {String} svg - SVG as a string
   * @return {Boolean} success
   */

	}, {
		key: '_embedSVG',
		value: function _embedSVG(svg) {
			this._el.innerHTML = svg;
			this._el.removeAttribute(EMBED_ATTR);
			this._el.style.backgroundImage = 'none';
			this._el.querySelector('svg').style.width = this._el.clientWidth;
			this._el.querySelector('svg').style.height = this._el.clientHeight;
			return true;
		}
	}]);
	return Icon;
}();

exports.default = Icon;

},{"../services/component":76,"../services/icons":78,"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/get-iterator":2,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],72:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

var _util = require('../services/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Modal Aria Attribute
/**
 * Modal
 * @module Modal
 * @version 1.13.0
 */

var ARIA_HIDDEN = 'aria-hidden';

// Modal Data Dismiss Attributes
var DATA_DISMISS = '[data-modal-dismiss]';

// Modal Classes
var CLASSNAME = {
	OPEN: 'modal-open',
	SHOW: 'modal-show',
	ANIMATE: 'modal-content-animation',
	BACKDROP: 'modal',
	DIALOG: 'modal-dialog',
	CONTENT: 'modal-content'
};
// Event Keys
var KEY = {
	TAB: 9,
	ESC: 27
};

/**
 * Create a new Modal component
 * @class
 */

var Modal = function () {
	/**
  * Initialise Modal
  * @public
  * @param {Node} el - Containing Modal element
  * @return {Boolean} success
  */
	function Modal(el) {
		(0, _classCallCheck3.default)(this, Modal);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Callbacks object
		this._callbacks = {};

		// Store containing element
		this._el = el;

		// Store modal transition speed
		this._transitionSpeed = _util2.default.getTransitionSpeed('medium');

		// Store html element tag
		this._html = document.querySelector('html');

		// Store modal Id
		this._Id = this._el.id;

		// Get array of all elements with [data-target="this._Id"]
		this._triggerElement = (0, _from2.default)(document.querySelectorAll('[data-modal-target="' + this._Id + '"]'));

		// Get array of all element with dataset dismiss
		this._dismissElements = (0, _from2.default)(this._el.querySelectorAll('' + DATA_DISMISS));

		// Get modal content section
		this._contentSection = this._el.querySelector('.' + CLASSNAME.CONTENT);

		// Get array of all tabable elements within the modal content section
		this._tabableElements = (0, _from2.default)(this._el.querySelectorAll('\n\t\t\ta[href],\n\t\t\tarea[href],\n\t\t\tinput:not([disabled]),\n\t\t\tselect:not([disabled]),\n\t\t\ttextarea:not([disabled]),\n\t\t\tbutton:not([disabled]),\n\t\t\t[tabindex="0"]\n\t\t'));

		// Store first tabable element
		this.firstFocusableElem = this._tabableElements[0];

		// Store last tabable element
		this.lastFocusableElem = this._tabableElements[this._tabableElements.length - 1];

		// Init default modal state
		this._initDefaultState(); // attach events
		this._events();

		return this.success;
	}

	/**
  * Initialise ARIA attribute
  * Add 'modal-close' class to modal
  * @private
  */


	(0, _createClass3.default)(Modal, [{
		key: '_initDefaultState',
		value: function _initDefaultState() {
			this._contentSection.setAttribute('' + ARIA_HIDDEN, 'true');
		}

		/**
   * Attach click events
   * @private
   */

	}, {
		key: '_events',
		value: function _events() {
			var _this = this;

			/**
    * Attach click event to this._triggerElement
    * @param {Event} e - Click event
    */
			this._triggerElement.forEach(function (e) {
				return e.addEventListener('click', function (e) {
					e.preventDefault();
					_this.showModal();
				});
			});

			/**
    * Attach click event to this._dismissElements array
    * @param {Event} e - Click event
    */
			this._dismissElements.forEach(function (e) {
				return e.addEventListener('click', function (e) {
					e.preventDefault();
					_this.hideModal(e);
				});
			});

			/**
    * Attach click event to modal backdrop
    * @param {Event} e - Click event
    */
			this._el.addEventListener('click', function (e) {
				if (e.target.classList.contains(CLASSNAME.BACKDROP) || e.target.classList.contains(CLASSNAME.DIALOG)) {
					_this.hideModal();
				}
			});

			/**
    * Attach keyboard events to modal content section
    * @param {Event} e - Click event
    */
			this._contentSection.addEventListener('keydown', function (e) {
				switch (e.keyCode) {
					case KEY.TAB:
						if (_this._tabableElements.length === 1) {
							e.preventDefault();
							break;
						}

						if (e.shiftKey) {
							_this._handleBackwardTab(e);
						} else {
							_this._handleForwardTab(e);
						}
						break;
					case KEY.ESC:
						_this.hideModal(e);
						break;
					default:
						break;
				}
			});
		}

		/**
   * Add callback for public modal methods
   * @public
   * @param {String} event
   * @param {Function} callback
   */

	}, {
		key: 'addCallback',
		value: function addCallback(event, callback) {
			if (typeof callback === 'function' && typeof event === 'string') {
				if (!this._callbacks[event]) {
					this._callbacks[event] = [];
				}
				this._callbacks[event].push(callback);
			}
		}

		/**
   * Public method to show modal
   * @public
   */

	}, {
		key: 'showModal',
		value: function showModal() {
			var _this2 = this;

			// Update modal
			this._contentSection.setAttribute('' + ARIA_HIDDEN, 'false');
			this._el.classList.add('' + CLASSNAME.SHOW);

			// Add modal-open class to html element tag to disable page scroll
			this._html.classList.add('' + CLASSNAME.OPEN);

			// Add transition class
			this._contentSection.classList.add('' + CLASSNAME.ANIMATE);

			/* SetTimeout to allow transition to complete
    * Set focus to first tabable element
   */
			setTimeout(function () {
				if (_this2.firstFocusableElem) {
					_this2.firstFocusableElem.focus();
				}
			}, this._transitionSpeed);

			// Store original focus element
			this.focusedElemBeforeOpen = document.activeElement;

			// Call callback
			if (this._callbacks.show) this._callbacks.show.forEach(function (fn) {
				return fn();
			});
		}

		/**
   * Public method to hide modal
   * @public
   */

	}, {
		key: 'hideModal',
		value: function hideModal() {
			// Update modal
			this._contentSection.setAttribute('' + ARIA_HIDDEN, 'true');
			this._el.classList.remove('' + CLASSNAME.SHOW);

			// Remove modal-open class from html element tag to enable page scroll
			this._html.classList.remove('' + CLASSNAME.OPEN);

			// Remove transition class
			this._contentSection.classList.remove('' + CLASSNAME.ANIMATE);

			// Set focus to the original focus element
			if (this.focusedElemBeforeOpen) {
				this.focusedElemBeforeOpen.focus();
			}

			// Call callback
			if (this._callbacks.hide) this._callbacks.hide.forEach(function (fn) {
				return fn();
			});
		}

		/**
   * Private method to handle backward tab
   * @private
   * @param {Event} e - Click event
   */

	}, {
		key: '_handleBackwardTab',
		value: function _handleBackwardTab(e) {
			if (document.activeElement === this.firstFocusableElem) {
				e.preventDefault();
				this.lastFocusableElem.focus();
			}
		}

		/**
   * Private method to handle forward tab
   * @private
   * @param {Event} e - Click event
   */

	}, {
		key: '_handleForwardTab',
		value: function _handleForwardTab(e) {
			if (document.activeElement === this.lastFocusableElem) {
				e.preventDefault();
				this.firstFocusableElem.focus();
			}
		}
	}]);
	return Modal;
}();

exports.default = Modal;

},{"../services/component":76,"../services/util":79,"babel-runtime/core-js/array/from":1,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],73:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FOCUS_STATE = 'skiplink-focus'; /**
                                     * Skiplink
                                     * @module Skiplink
                                     * @version 1.11.0
                                     */

var HIDDEN_STATE = 'skiplink-hidden';

/**
 * Create a new Skiplink component
 * @class
 */

var Skiplink = function () {
	/**
  * Initialise Skiplink
  * @public
  * @param {Node} el - Containing Skiplink element
  * @param {Node} stateEl - Element to add state class to
  * @return {Boolean} success
  */
	function Skiplink(el, stateEl) {
		(0, _classCallCheck3.default)(this, Skiplink);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Store containing element
		this._el = el;
		// Store element to add state class to (or el if not defined)
		this._stateEl = stateEl || el;

		this._stateEl.classList.add(HIDDEN_STATE);
		this._attachLinkEvents();

		return this.success;
	}

	/**
  * Attach focus and blur events to links
  * @private
  */


	(0, _createClass3.default)(Skiplink, [{
		key: '_attachLinkEvents',
		value: function _attachLinkEvents() {
			var _this = this;

			var links = (0, _from2.default)(this._el.querySelectorAll('a'));

			links.forEach(function (link) {
				link.addEventListener('focus', function () {
					return _this._showSkiplink();
				});
				link.addEventListener('blur', function () {
					return _this._hideSkiplink();
				});
			});
		}

		/**
   * Show skiplink container
   * @private
   */

	}, {
		key: '_showSkiplink',
		value: function _showSkiplink() {
			this._stateEl.classList.add(FOCUS_STATE);
			this._stateEl.classList.remove(HIDDEN_STATE);
		}

		/**
   * Hide skipkinks container
   * @private
   */

	}, {
		key: '_hideSkiplink',
		value: function _hideSkiplink() {
			this._stateEl.classList.remove(FOCUS_STATE);
			this._stateEl.classList.add(HIDDEN_STATE);
		}
	}]);
	return Skiplink;
}();

exports.default = Skiplink;

},{"../services/component":76,"babel-runtime/core-js/array/from":1,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],74:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('../services/util');

var _util2 = _interopRequireDefault(_util);

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tab
 * @module Tab
 * @version 1.13.0
 */
var LIST_CLASS = 'tab-list';
var LIST_DROPDOWN_CLASS = 'tab-list-dropdown';
var PANEL_CLASS = 'tab-panel';
var CONTENT_CLASS = 'tab-content';
var CONTENT_CLOSING_CLASS = 'tab-content-closing';
var CONTENT_OPENING_CLASS = 'tab-content-opening';
var HEADING_CLASS = 'tab-heading';
var HEADING_ACTIVE_CLASS = 'tab-heading-active';
var DATA = {
	ACTIVE: 'data-tab-active'
};

// Enable dropdown on mobile
var MOBILE_DROPDOWN = true;

/**
 * Create a new Tab component
 * @class
 */

var Tab = function () {
	/**
  * Initialise Tab
  * @public
  * @param {Node} el - Containing Tab element
  * @return {Boolean} success
  */
	function Tab(el) {
		var _this = this;

		(0, _classCallCheck3.default)(this, Tab);

		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		// Store containing element
		this._el = el;
		// Store array of element IDs
		this._ids = [];
		// Store interactive elements
		this._listContainer = el.querySelector('.' + LIST_CLASS);
		this._panelContainer = el.querySelector('.' + PANEL_CLASS);
		this._listItems = (0, _from2.default)(el.querySelectorAll('.' + LIST_CLASS + ' a'));
		this._panelItems = (0, _from2.default)(el.querySelectorAll('.' + CONTENT_CLASS));
		// Store active panel
		this._activePanel = -1;
		// Is component transitioning
		this._transitioning = false;
		// Is dropdown enabled
		this._dropdownEnabled = false;
		// Enable transitions
		// Force disable transitions for now
		// this._useTransitions = Util.getEnableTransitions();
		this._useTransitions = false;
		this._transitionSpeed = this._useTransitions ? _util2.default.getTransitionSpeed('medium') : 0;

		// Generate IDs
		this._generateIDs();

		// Initialise ARIA attributes
		this._initAriaAttributes();

		// Show tab list
		this._listContainer.style.display = 'block';
		// Remove non-js Headings
		(0, _from2.default)(this._panelContainer.querySelectorAll('.' + HEADING_CLASS)).forEach(function (el) {
			return el.parentNode.removeChild(el);
		});

		// Attach events
		this._attachClickEvents();
		this._attachKeyboardEvents();

		// Watch for window resize and configure dropdown (if enabled)
		if (MOBILE_DROPDOWN) {
			(function () {
				_this._initDropdown(el);
				var resizeTimeout = void 0;
				window.addEventListener('resize', function () {
					clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(function () {
						_this._toggleDropdown(el);
					}, 250);
				});
			})();
		}

		// Set and open active tab
		var openPanel = parseInt(el.getAttribute(DATA.ACTIVE), 10) || 0;
		this._openPanel(openPanel);

		return this.success;
	}

	/**
  * Generate IDs for each section from the href
  * @private
  */


	(0, _createClass3.default)(Tab, [{
		key: '_generateIDs',
		value: function _generateIDs() {
			var _this2 = this;

			this._listItems.forEach(function (link) {
				var id = link.href.split('#')[1];

				// Store IDs in private object
				_this2._ids.push({
					tab: id + '-tab',
					panel: id
				});
			});
		}

		/**
   * Initialise ARIA attributes
   * @private
   */

	}, {
		key: '_initAriaAttributes',
		value: function _initAriaAttributes() {
			var _this3 = this;

			this._listContainer.setAttribute('role', 'tablist');
			this._listItems.forEach(function (link, index) {
				link.setAttribute('role', 'tab');
				link.setAttribute('id', _this3._ids[index].tab);
				link.setAttribute('aria-controls', _this3._ids[index].panel);
				link.setAttribute('aria-selected', false);
				link.setAttribute('aria-expanded', false);
			});
			this._panelItems.forEach(function (panel, index) {
				panel.setAttribute('role', 'tabpanel');
				panel.setAttribute('id', _this3._ids[index].panel);
				panel.setAttribute('aria-labelledby', _this3._ids[index].tab);
				panel.setAttribute('aria-hidden', true);
			});
		}

		/**
   * Attach click events
   * @private
   */

	}, {
		key: '_attachClickEvents',
		value: function _attachClickEvents() {
			var _this4 = this;

			this._listItems.forEach(function (link, index) {
				link.addEventListener('click', function (e) {
					e.preventDefault();
					_this4._openPanel(index);
				});
			});
		}

		/**
   * Attach keyboard events
   * @private
   */

	}, {
		key: '_attachKeyboardEvents',
		value: function _attachKeyboardEvents() {
			var _this5 = this;

			this._listItems.forEach(function (link, index) {
				link.addEventListener('keydown', function (e) {
					if (/(40|39|38|37|36|35|32)/.test(e.keyCode)) {
						e.preventDefault();
					}

					if (/(40|39)/.test(e.keyCode)) {
						// Down/Right arrow
						if (index < _this5._listItems.length - 1) {
							_this5._listItems[index + 1].focus();
						} else {
							_this5._listItems[0].focus();
						}
					} else if (/(38|37)/.test(e.keyCode)) {
						// Up/Left arrow
						if (index === 0) {
							_this5._listItems[_this5._listItems.length - 1].focus();
						} else {
							_this5._listItems[index - 1].focus();
						}
					} else if (e.keyCode === 36) {
						// Home key
						_this5._listItems[0].focus();
						_this5._openPanel(0);
					} else if (e.keyCode === 35) {
						// End key
						_this5._listItems[_this5._listItems.length - 1].focus();
						_this5._openPanel(_this5._listItems.length - 1);
					} else if (e.keyCode === 32) {
						// Space key
						_this5._openPanel(index);
					}
				});
			});
		}

		/**
   * Close panels
   * @private
   */

	}, {
		key: '_closePanels',
		value: function _closePanels() {
			this._panelItems.forEach(function (panel) {
				panel.classList.add(CONTENT_CLOSING_CLASS);
				panel.setAttribute('aria-hidden', true);
			});
			this._listItems.forEach(function (link) {
				link.classList.remove(HEADING_ACTIVE_CLASS);
				link.setAttribute('aria-expanded', false);
				link.setAttribute('aria-selected', false);
			});
		}

		/**
   * Open panel
   * @private
   * @param {Integer} index - Index of the panel to open
   */

	}, {
		key: '_openPanel',
		value: function _openPanel(index) {
			var _this6 = this;

			// Override index if an invalid value is provided
			var i = this._panelItems[index] ? index : 0;
			if (i !== this._activePanel) {
				(function () {
					// Stop the previous transition from removing the closing class
					// if multple click events occur in a short interval
					clearTimeout(_this6._transitioning);

					_this6._closePanels();

					var panel = _this6._panelItems[i];
					var link = _this6._listItems[i];
					_this6._activePanel = i;

					// Activate new link
					link.classList.add(HEADING_ACTIVE_CLASS);

					// Keep dropdown in sync (if enabled)
					if (MOBILE_DROPDOWN) {
						_this6._dropdownContainer.querySelector('select').selectedIndex = i;
					}

					// Wait and open the new panel
					_this6._transitioning = setTimeout(function () {
						panel.classList.remove(CONTENT_CLOSING_CLASS);
						panel.classList.add(CONTENT_OPENING_CLASS);
						_this6._transitioning = setTimeout(function () {
							panel.classList.remove(CONTENT_OPENING_CLASS);
							panel.setAttribute('aria-hidden', false);
							link.setAttribute('aria-expanded', true);
							link.setAttribute('aria-selected', true);
						}, _this6._transitionSpeed);
					}, _this6._transitionSpeed);
				})();
			}
		}

		/**
   * Initialise dropdown element
   * @param {Node} el - Containing tab element
   */

	}, {
		key: '_initDropdown',
		value: function _initDropdown(el) {
			// Create dropdown element
			this._dropdownContainer = document.createElement('div');
			this._dropdownContainer.classList.add(LIST_DROPDOWN_CLASS);
			this._dropdownContainer.innerHTML = '\n\t\t\t<select class="select tab-select">\n\t\t\t\t' + this._listItems.map(function (item) {
				return '<option>' + item.innerText + '</option>';
			}) + '\n\t\t\t</select>\n\t\t';
			// Check current window width and show appropriate element
			if (window.innerWidth < _util2.default.getBreakpoint('sm')) {
				this._dropdownEnabled = true;
				this._listContainer.style.display = 'none';
			} else {
				this._dropdownEnabled = false;
				this._dropdownContainer.style.display = 'none';
			}
			// Attach element to DOM
			el.insertBefore(this._dropdownContainer, el.firstChild);
			// Attach dropdown events
			this._attachDropdownEvents();
		}

		/**
   * Attach dropdown events
   * @private
   */

	}, {
		key: '_attachDropdownEvents',
		value: function _attachDropdownEvents() {
			var _this7 = this;

			var select = this._dropdownContainer.querySelector('select');
			select.addEventListener('change', function () {
				_this7._openPanel(select.selectedIndex);
			});
		}

		/**
   * Toggle dropdown element
   * @private
   */

	}, {
		key: '_toggleDropdown',
		value: function _toggleDropdown() {
			var currentView = this._dropdownEnabled;
			this._dropdownEnabled = window.innerWidth < _util2.default.getBreakpoint('sm');
			// Transitioning to Dropdown
			if (!currentView && this._dropdownEnabled) {
				this._listContainer.style.display = 'none';
				this._dropdownContainer.style.display = 'block';
			}
			// Transitioning to Tab
			if (currentView && !this._dropdownEnabled) {
				this._dropdownContainer.style.display = 'none';
				this._listContainer.style.display = 'block';
			}
		}
	}]);
	return Tab;
}();

exports.default = Tab;

},{"../services/component":76,"../services/util":79,"babel-runtime/core-js/array/from":1,"babel-runtime/helpers/classCallCheck":4,"babel-runtime/helpers/createClass":5}],75:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _component = require('../services/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable */
var Table = function ($) {

	// ------------------------------------------------------------------
	// Table functions
	// ------------------------------------------------------------------

	/**
  * Initialise table
  * @function Table
  * @param {Node} Containing table element
  */
	function Table(el) {
		// Register component
		this.success = _component2.default.registerComponent(el, this);
		if (!this.success) return false;

		setResponsiveness($(el));
		setSorting($(el));
		return this.success;
	}

	/**
  * Sets th metadata for responsive tables on page (has table-responsive class)
  * @function setResponsiveness
  *
  */
	function setResponsiveness(tables) {
		tables.filter('.table-responsive').each(function (index, table) {
			var headertext = [],
			    headers = $(table).find('th'),
			    tablebody = $(table).find('tbody')[0];

			for (var h = 0; h < headers.length; h++) {
				var current = headers[h];
				headertext.push(current.textContent.replace(/\r?\n|\r/, ''));
			}
			for (var r = 0, row; row = tablebody.rows[r]; r++) {
				for (var c = 0, col; col = row.cells[c]; c++) {
					var html = '<div class="table-responsive-head">' + headertext[c] + '</div>';
					html += '<div class="table-responsive-content">' + col.innerHTML + '</div>';
					col.innerHTML = html;
				}
			}
		});
	}

	/**
  * Initialise sorting on sortable tables on page (has table-sortable class)
  * @function setResponsiveness
  *
  */
	function setSorting(tables) {
		var sortableTables = tables.filter('.table-sortable');
		//Clean up icons
		sortableTables.find('th .table-arrows').remove();

		//Append sort icons to every sortable column (th where data-sort attribute is present)
		sortableTables.find('th[data-sort]').append('<div class="table-arrows">' + '<span class="table-sort-arrow-up"></span>' + '<span class="table-sort-arrow-down"></span>' + '</div>');

		//initialise sortable tables
		sortableTables.each(function (index, table) {
			//if iterating table has sortable columns
			if ($(table).find('th[data-sort]').length) {
				$(table).tablesorter();
			}
		});
	}

	// ------------------------------------------------------------------
	// jQuery function extensions for table sorting
	// ------------------------------------------------------------------
	$.fn.tablesorter = function (sortFns) {
		return this.each(function () {
			var $table = $(this);
			sortFns = sortFns || {};
			sortFns = $.extend({}, $.fn.tablesorter.defaultSortFns, sortFns);
			$table.data('sortFns', sortFns);

			$table.on('click.tablesorter', 'thead th', function () {
				$(this).tablesort();
			});

			$table.on('click.tablesorter', 'thead th div', function () {
				$(this).tablesort();
			});
		});
	};

	// Expects $('#mytable').tablesorter() to have already been called.
	// Call on a table header.
	$.fn.tablesort = function (forceDirection) {
		var $thisTh = $(this);
		var thIndex = 0; // we'll increment this soon
		var dir = $.fn.tablesorter.dir;
		var $table = $thisTh.closest('table');
		var datatype = $thisTh.data('sort') || null;

		// No datatype? Nothing to do.
		if (datatype === null) {
			return;
		}

		// Account for colspans
		$thisTh.parents('tr').find('th').slice(0, $(this).index()).each(function () {
			var cols = $(this).attr('colspan') || 1;
			thIndex += parseInt(cols, 10);
		});

		$thisTh.parents('tr').find('th div').slice(0, $(this).parent().index()).each(function () {
			var cols = $(this).attr('colspan') || 1;
			thIndex += parseInt(cols, 10);
		});

		var sortDir;
		if (arguments.length === 1) {
			sortDir = forceDirection;
		} else {
			sortDir = forceDirection || $thisTh.data('sort-default') || dir.ASC;
			if ($thisTh.data('sort-dir')) {
				sortDir = $thisTh.data('sort-dir') === dir.ASC ? dir.DESC : dir.ASC;
			}
		}

		$table.trigger('beforetablesort', { column: thIndex, direction: sortDir });

		// More reliable method of forcing a redraw
		$table.css('display');

		// Run sorting asynchronously on a timout to force browser redraw after
		// `beforetablesort` callback. Also avoids locking up the browser too much.
		setTimeout(function () {
			// Gather the elements for this column
			var column = [];
			var sortFns = $table.data('sortFns');
			var sortMethod = sortFns[datatype];
			var trs = $table.children('tbody').children('tr');

			// Extract the data for the column that needs to be sorted and pair it up
			// with the TR itself into a tuple. This way sorting the values will
			// incidentally sort the trs.
			trs.each(function (index, tr) {
				var $e = $(tr).children().eq(thIndex);
				var sortVal = $e.data('sort-value');

				// Store and read from the .data cache for display text only sorts
				// instead of looking through the DOM every time
				if (typeof sortVal === 'undefined') {
					var txt = $e.text();
					$e.data('sort-value', txt);
					sortVal = txt;
				}
				column.push([sortVal, tr]);
			});

			// Sort by the data-order-by value
			column.sort(function (a, b) {
				return sortMethod(a[0], b[0]);
			});
			if (sortDir !== dir.ASC) {
				column.reverse();
			}

			// Replace the content of tbody with the sorted rows. Strangely
			// enough, .append accomplishes this for us.
			trs = $.map(column, function (kv) {
				return kv[1];
			});
			$table.children('tbody').append(trs);

			// Reset siblings
			$table.find('th').data('sort-dir', null).removeClass('sorting-desc sorting-asc');
			$table.find('th').attr('aria-sort', 'none');
			$table.find('th div').data('sort-dir', null).removeClass('sorting-desc sorting-asc');
			$thisTh.data('sort-dir', sortDir).addClass('sorting-' + sortDir);
			$thisTh.attr('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');

			$table.trigger('aftertablesort', { column: thIndex, direction: sortDir });

			$table.css('display');
		}, 10);

		return $thisTh;
	};

	// Call on a sortable td to update its value in the sort. This should be the
	// only mechanism used to update a cell's sort value. If your display value is
	// different from your sort value, use jQuery's .text() or .html() to update
	// the td contents, Assumes tablesorter has already been called for the table.
	$.fn.updateSortVal = function (newSortVal) {
		var $thisTd = $(this);
		if ($thisTd.is('[data-sort-value]')) {
			// For visual consistency with the .data cache
			$thisTd.attr('data-sort-value', newSortVal);
		}
		$thisTd.data('sort-value', newSortVal);
		return $thisTd;
	};

	$.fn.stripChars = function (val) {
		return val.replace(/[^0-9.]/g, '');
	};

	// ------------------------------------------------------------------
	// Default sorting settings
	// ------------------------------------------------------------------
	$.fn.tablesorter.dir = { ASC: 'asc', DESC: 'desc' };
	$.fn.tablesorter.defaultSortFns = {

		'int': function int(a, b) {
			a = $.fn.stripChars(a);
			b = $.fn.stripChars(b);
			return parseInt(a, 10) - parseInt(b, 10);
		},
		'float': function float(a, b) {
			a = $.fn.stripChars(a);
			b = $.fn.stripChars(b);
			return parseFloat(a) - parseFloat(b);
		},
		'string': function string(a, b) {
			return a.localeCompare(b);
		},
		'string-ins': function stringIns(a, b) {
			a = a.toLocaleLowerCase();
			b = b.toLocaleLowerCase();
			return a.localeCompare(b);
		}
	};

	return Table;
}(jQuery); /**
            * Table
            * @module Table
            * @version 1.13.0
            */
exports.default = Table;

},{"../services/component":76}],76:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Component Service
 * @module Component
 * @version 1.9.0
 */

var components = [];

function getAllComponents() {
	return components;
}

function getComponent(el) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(components), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var c = _step.value;

			if (c.el === el && c.component) {
				return c.component;
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	return false;
}

function registerComponent(el, component) {
	if (getComponent(el)) {
		return false;
	}
	components.push({
		el: el,
		component: component
	});
	return true;
}

exports.default = {
	getAllComponents: getAllComponents,
	getComponent: getComponent,
	registerComponent: registerComponent
};

},{"babel-runtime/core-js/get-iterator":2}],77:[function(require,module,exports){
'use strict';

/**
 * jQuery Extends
 * @module Extends
 * @version 1.9.0
 * @deprecated since 1.9.0
 */

/* eslint-disable */
(function ($) {
	if (!$) return false;

	$.extend({
		debounce: function debounce(fn, timeout, invokeAsap, context) {
			if (arguments.length === 3 && typeof invokeAsap !== 'boolean') {
				context = invokeAsap;
				invokeAsap = false;
			}

			var timer;

			return function () {
				var args = arguments;
				context = context || this;
				invokeAsap && !timer && fn.apply(context, args);

				clearTimeout(timer);

				timer = setTimeout(function () {
					!invokeAsap && fn.apply(context, args);
					timer = null;
				}, timeout);
			};
		}
	});
})(jQuery);

},{}],78:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Icons
 * @module Icons
 * @version 1.13.0
 */

var cached = false;
var cache = {};

var extractSVG = function extractSVG(cssText) {
	var encodedIcon = cssText.split(');')[0].match(/US-ASCII,([^"']+)/);
	if (encodedIcon && encodedIcon[1]) {
		return decodeURIComponent(encodedIcon[1]);
	}
	return false;
};

var cacheIcons = function cacheIcons() {
	var css = (0, _from2.default)(document.querySelectorAll('link[href*=".css"]'));
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = (0, _getIterator3.default)(css), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var file = _step.value;

			var rules = file.sheet.cssRules ? file.sheet.cssRules : file.sheet.rules;
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = (0, _getIterator3.default)((0, _from2.default)(rules)), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var rule = _step2.value;

					var className = rule.cssText.split(' ')[0];
					if (className.indexOf('.icon-') === 0) {
						var name = className.replace(/\.icon-/g, '');
						var svg = extractSVG(rule.cssText);
						if (name && svg) {
							cache[name] = {
								name: name,
								svg: svg
							};
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	cached = true;
};

var Icons = {
	/**
  * Get icon
  * @public
  * @param {String} name - icon name
  * @returns {String} icon
  */
	getIcon: function getIcon(name) {
		if (!cached) {
			cacheIcons();
		}
		return cache[name];
	}
};

exports.default = Icons;

},{"babel-runtime/core-js/array/from":1,"babel-runtime/core-js/get-iterator":2}],79:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Utilities
 * @module Util
 * @version 1.13.0
 */
var BREAKPOINTS = {
	sm: 768,
	md: 1024,
	lg: 1440
};

var ENABLETRANSITIONS = true;

var TRANSITIONSPEED = {
	fast: 0.15,
	medium: 0.3,
	slow: 0.6
};

var Util = {
	/**
  * Get breakpoint value
  * @public
  * @param {String} key - Breakpoint key
  */
	getBreakpoint: function getBreakpoint(key) {
		return BREAKPOINTS[key] || false;
	},


	/**
  * Get enable transitions
  * @public
  */
	getEnableTransitions: function getEnableTransitions() {
		return ENABLETRANSITIONS;
	},


	/**
  * Get all transition speeds
  * @public
  */
	getTransitionSpeeds: function getTransitionSpeeds() {
		var ts = TRANSITIONSPEED;
		return {
			fast: ts.fast * 1000,
			medium: ts.medium * 1000,
			slow: ts.slow * 1000
		};
	},


	/**
  * Get transition speed
  * @public
  * @param {String} key - Transition key
  */
	getTransitionSpeed: function getTransitionSpeed(key) {
		return TRANSITIONSPEED[key] * 1000 || false;
	},


	/**
  * Get header height
  * @public
  */
	getHeaderHeight: function getHeaderHeight() {
		return parseInt(window.getComputedStyle(document.body, null).getPropertyValue('padding-top'), 0);
	},


	/**
  * Get viewport position
  * @public
  */
	getViewportPosition: function getViewportPosition() {
		var doc = document.documentElement;
		var body = document.body;
		return {
			top: window.pageYOffset || doc.scrollTop || body.scrollTop,
			left: window.pageXOffset || doc.scrollLeft || body.scrollLeft
		};
	},


	/**
  * Get element's position in document
  * @public
  * @param {Node} el
  */
	getElementPosition: function getElementPosition(el) {
		var box = el.getBoundingClientRect();
		var body = document.body;
		var doc = document.documentElement;

		var scrollTop = window.pageYOffset || doc.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || doc.scrollLeft || body.scrollLeft;

		var clientTop = doc.clientTop || body.clientTop || 0;
		var clientLeft = doc.clientLeft || body.clientLeft || 0;

		return {
			top: Math.round(box.top + scrollTop - clientTop),
			left: Math.round(box.left + scrollLeft - clientLeft)
		};
	},


	/**
  * Check if element is in view
  * @public
  * @param {Node} el
  */
	isElementInView: function isElementInView(el) {
		var rect = el.getBoundingClientRect();

		return rect.top >= this.getHeaderHeight() && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
	}
};

exports.default = Util;

},{}]},{},[67])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2FycmF5L2Zyb20uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2dldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2NsYXNzbGlzdC1wb2x5ZmlsbC9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2Zyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS1pdGVyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJzcmNcXGpzXFxiZGwuanMiLCJzcmNcXGpzXFxjb21wb25lbnRzXFxhY2NvcmRpb24uanMiLCJzcmNcXGpzXFxjb21wb25lbnRzXFxjb29raWVwcm9tcHQuanMiLCJzcmNcXGpzXFxjb21wb25lbnRzXFxnbG9iYWxoZWFkZXIuanMiLCJzcmNcXGpzXFxjb21wb25lbnRzXFxpY29uLmpzIiwic3JjXFxqc1xcY29tcG9uZW50c1xcbW9kYWwuanMiLCJzcmNcXGpzXFxjb21wb25lbnRzXFxza2lwbGluay5qcyIsInNyY1xcanNcXGNvbXBvbmVudHNcXHRhYi5qcyIsInNyY1xcanNcXGNvbXBvbmVudHNcXHRhYmxlLmpzIiwic3JjXFxqc1xcc2VydmljZXNcXGNvbXBvbmVudC5qcyIsInNyY1xcanNcXHNlcnZpY2VzXFxleHRlbmRzLmpzIiwic3JjXFxqc1xcc2VydmljZXNcXGljb25zLmpzIiwic3JjXFxqc1xcc2VydmljZXNcXHV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUNBQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNMQTs7QUFHQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7OztBQUNBOzs7O0FB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QXRCO0FBQ0EsTUFBTSxNQUFNLFNBQVMsZUFBckI7O0FBRUEsTUFBTSxZQUFZLE9BQU8sV0FBUCxJQUFzQixJQUFJLFNBQTFCLElBQXVDLEtBQUssU0FBOUQ7QUFDQSxNQUFNLGFBQWEsT0FBTyxXQUFQLElBQXNCLElBQUksVUFBMUIsSUFBd0MsS0FBSyxVQUFoRTs7QUFFQSxNQUFNLFlBQVksSUFBSSxTQUFKLElBQWlCLEtBQUssU0FBdEIsSUFBbUMsQ0FBckQ7QUFDQSxNQUFNLGFBQWEsSUFBSSxVQUFKLElBQWtCLEtBQUssVUFBdkIsSUFBcUMsQ0FBeEQ7O0FBR0EsU0FBTztBQUNOLFFBQUssS0FBSyxLQUFMLENBQVksSUFBSSxHQUFKLEdBQVUsU0FBWCxHQUF3QixTQUFuQyxDQURDO0FBRU4sU0FBTSxLQUFLLEtBQUwsQ0FBWSxJQUFJLElBQUosR0FBVyxVQUFaLEdBQTBCLFVBQXJDO0FBRkEsR0FBUDtBQUlBLEVBbkZXOzs7QUFxRlo7Ozs7O0FBS0EsZ0JBMUZZLDJCQTBGSSxFQTFGSixFQTBGUTtBQUNuQixNQUFNLE9BQU8sR0FBRyxxQkFBSCxFQUFiOztBQUVBLFNBQ0MsS0FBSyxHQUFMLElBQVksS0FBSyxlQUFMLEVBQVosSUFDQSxLQUFLLElBQUwsSUFBYSxDQURiLElBRUEsS0FBSyxNQUFMLEtBQWdCLE9BQU8sV0FBUCxJQUFzQixTQUFTLGVBQVQsQ0FBeUIsWUFBL0QsQ0FGQSxJQUdBLEtBQUssS0FBTCxLQUFlLE9BQU8sVUFBUCxJQUFxQixTQUFTLGVBQVQsQ0FBeUIsV0FBN0QsQ0FKRDtBQU1BO0FBbkdXLENBQWI7O2tCQXVHZSxJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsIi8qXG4gKiBjbGFzc0xpc3QuanM6IENyb3NzLWJyb3dzZXIgZnVsbCBlbGVtZW50LmNsYXNzTGlzdCBpbXBsZW1lbnRhdGlvbi5cbiAqIDIwMTQtMDctMjNcbiAqXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXG4gKiBQdWJsaWMgRG9tYWluLlxuICogTk8gV0FSUkFOVFkgRVhQUkVTU0VEIE9SIElNUExJRUQuIFVTRSBBVCBZT1VSIE9XTiBSSVNLLlxuICovXG5cbi8qZ2xvYmFsIHNlbGYsIGRvY3VtZW50LCBET01FeGNlcHRpb24gKi9cblxuLyohIEBzb3VyY2UgaHR0cDovL3B1cmwuZWxpZ3JleS5jb20vZ2l0aHViL2NsYXNzTGlzdC5qcy9ibG9iL21hc3Rlci9jbGFzc0xpc3QuanMqL1xuXG4vKiBDb3BpZWQgZnJvbSBNRE46XG4gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9jbGFzc0xpc3RcbiAqL1xuXG5pZiAoXCJkb2N1bWVudFwiIGluIHdpbmRvdy5zZWxmKSB7XG5cbiAgLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxuICAvLyBJbmNsdWRpbmcgSUUgPCBFZGdlIG1pc3NpbmcgU1ZHRWxlbWVudC5jbGFzc0xpc3RcbiAgaWYgKCEoXCJjbGFzc0xpc3RcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKSlcbiAgICB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgIShcImNsYXNzTGlzdFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsXCJnXCIpKSkge1xuXG4gIChmdW5jdGlvbiAodmlldykge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoISgnRWxlbWVudCcgaW4gdmlldykpIHJldHVybjtcblxuICAgIHZhclxuICAgICAgICBjbGFzc0xpc3RQcm9wID0gXCJjbGFzc0xpc3RcIlxuICAgICAgLCBwcm90b1Byb3AgPSBcInByb3RvdHlwZVwiXG4gICAgICAsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXG4gICAgICAsIG9iakN0ciA9IE9iamVjdFxuICAgICAgLCBzdHJUcmltID0gU3RyaW5nW3Byb3RvUHJvcF0udHJpbSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csIFwiXCIpO1xuICAgICAgfVxuICAgICAgLCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHZhclxuICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAsIGxlbiA9IHRoaXMubGVuZ3RoXG4gICAgICAgIDtcbiAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xuICAgICAgLCBET01FeCA9IGZ1bmN0aW9uICh0eXBlLCBtZXNzYWdlKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgIH1cbiAgICAgICwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IERPTUV4KFxuICAgICAgICAgICAgICBcIlNZTlRBWF9FUlJcIlxuICAgICAgICAgICAgLCBcIkFuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZFwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoL1xccy8udGVzdCh0b2tlbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRE9NRXgoXG4gICAgICAgICAgICAgIFwiSU5WQUxJRF9DSEFSQUNURVJfRVJSXCJcbiAgICAgICAgICAgICwgXCJTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXJcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyckluZGV4T2YuY2FsbChjbGFzc0xpc3QsIHRva2VuKTtcbiAgICAgIH1cbiAgICAgICwgQ2xhc3NMaXN0ID0gZnVuY3Rpb24gKGVsZW0pIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAgICB0cmltbWVkQ2xhc3NlcyA9IHN0clRyaW0uY2FsbChlbGVtLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpIHx8IFwiXCIpXG4gICAgICAgICAgLCBjbGFzc2VzID0gdHJpbW1lZENsYXNzZXMgPyB0cmltbWVkQ2xhc3Nlcy5zcGxpdCgvXFxzKy8pIDogW11cbiAgICAgICAgICAsIGkgPSAwXG4gICAgICAgICAgLCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxuICAgICAgICA7XG4gICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICB0aGlzLnB1c2goY2xhc3Nlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlQ2xhc3NOYW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdGhpcy50b1N0cmluZygpKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgICwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXG4gICAgICAsIGNsYXNzTGlzdEdldHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDbGFzc0xpc3QodGhpcyk7XG4gICAgICB9XG4gICAgO1xuICAgIC8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcbiAgICAvLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cbiAgICBET01FeFtwcm90b1Byb3BdID0gRXJyb3JbcHJvdG9Qcm9wXTtcbiAgICBjbGFzc0xpc3RQcm90by5pdGVtID0gZnVuY3Rpb24gKGkpIHtcbiAgICAgIHJldHVybiB0aGlzW2ldIHx8IG51bGw7XG4gICAgfTtcbiAgICBjbGFzc0xpc3RQcm90by5jb250YWlucyA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgdG9rZW4gKz0gXCJcIjtcbiAgICAgIHJldHVybiBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pICE9PSAtMTtcbiAgICB9O1xuICAgIGNsYXNzTGlzdFByb3RvLmFkZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhclxuICAgICAgICAgIHRva2VucyA9IGFyZ3VtZW50c1xuICAgICAgICAsIGkgPSAwXG4gICAgICAgICwgbCA9IHRva2Vucy5sZW5ndGhcbiAgICAgICAgLCB0b2tlblxuICAgICAgICAsIHVwZGF0ZWQgPSBmYWxzZVxuICAgICAgO1xuICAgICAgZG8ge1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG4gICAgICAgIGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xuICAgICAgICAgIHRoaXMucHVzaCh0b2tlbik7XG4gICAgICAgICAgdXBkYXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2kgPCBsKTtcblxuICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjbGFzc0xpc3RQcm90by5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXJcbiAgICAgICAgICB0b2tlbnMgPSBhcmd1bWVudHNcbiAgICAgICAgLCBpID0gMFxuICAgICAgICAsIGwgPSB0b2tlbnMubGVuZ3RoXG4gICAgICAgICwgdG9rZW5cbiAgICAgICAgLCB1cGRhdGVkID0gZmFsc2VcbiAgICAgICAgLCBpbmRleFxuICAgICAgO1xuICAgICAgZG8ge1xuICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXSArIFwiXCI7XG4gICAgICAgIGluZGV4ID0gY2hlY2tUb2tlbkFuZEdldEluZGV4KHRoaXMsIHRva2VuKTtcbiAgICAgICAgd2hpbGUgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdoaWxlICgrK2kgPCBsKTtcblxuICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XG4gICAgICB0b2tlbiArPSBcIlwiO1xuXG4gICAgICB2YXJcbiAgICAgICAgICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxuICAgICAgICAsIG1ldGhvZCA9IHJlc3VsdCA/XG4gICAgICAgICAgZm9yY2UgIT09IHRydWUgJiYgXCJyZW1vdmVcIlxuICAgICAgICA6XG4gICAgICAgICAgZm9yY2UgIT09IGZhbHNlICYmIFwiYWRkXCJcbiAgICAgIDtcblxuICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICB0aGlzW21ldGhvZF0odG9rZW4pO1xuICAgICAgfVxuXG4gICAgICBpZiAoZm9yY2UgPT09IHRydWUgfHwgZm9yY2UgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmb3JjZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAhcmVzdWx0O1xuICAgICAgfVxuICAgIH07XG4gICAgY2xhc3NMaXN0UHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5qb2luKFwiIFwiKTtcbiAgICB9O1xuXG4gICAgaWYgKG9iakN0ci5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgdmFyIGNsYXNzTGlzdFByb3BEZXNjID0ge1xuICAgICAgICAgIGdldDogY2xhc3NMaXN0R2V0dGVyXG4gICAgICAgICwgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgICAsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcbiAgICAgIH0gY2F0Y2ggKGV4KSB7IC8vIElFIDggZG9lc24ndCBzdXBwb3J0IGVudW1lcmFibGU6dHJ1ZVxuICAgICAgICBpZiAoZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xuICAgICAgICAgIGNsYXNzTGlzdFByb3BEZXNjLmVudW1lcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICBvYmpDdHIuZGVmaW5lUHJvcGVydHkoZWxlbUN0clByb3RvLCBjbGFzc0xpc3RQcm9wLCBjbGFzc0xpc3RQcm9wRGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9iakN0cltwcm90b1Byb3BdLl9fZGVmaW5lR2V0dGVyX18pIHtcbiAgICAgIGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XG4gICAgfVxuXG4gICAgfSh3aW5kb3cuc2VsZikpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAvLyBUaGVyZSBpcyBmdWxsIG9yIHBhcnRpYWwgbmF0aXZlIGNsYXNzTGlzdCBzdXBwb3J0LCBzbyBqdXN0IGNoZWNrIGlmIHdlIG5lZWRcbiAgICAvLyB0byBub3JtYWxpemUgdGhlIGFkZC9yZW1vdmUgYW5kIHRvZ2dsZSBBUElzLlxuXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgICB2YXIgdGVzdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiX1wiKTtcblxuICAgICAgdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImMxXCIsIFwiYzJcIik7XG5cbiAgICAgIC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXG4gICAgICAvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cbiAgICAgIGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzJcIikpIHtcbiAgICAgICAgdmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICAgIHZhciBvcmlnaW5hbCA9IERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXTtcblxuICAgICAgICAgIERPTVRva2VuTGlzdC5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgICAgICB2YXIgaSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgIHRva2VuID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICBvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBjcmVhdGVNZXRob2QoJ2FkZCcpO1xuICAgICAgICBjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xuICAgICAgfVxuXG4gICAgICB0ZXN0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiYzNcIiwgZmFsc2UpO1xuXG4gICAgICAvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XG4gICAgICAvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gICAgICBpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYzNcIikpIHtcbiAgICAgICAgdmFyIF90b2dnbGUgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZTtcblxuICAgICAgICBET01Ub2tlbkxpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKHRva2VuLCBmb3JjZSkge1xuICAgICAgICAgIGlmICgxIGluIGFyZ3VtZW50cyAmJiAhdGhpcy5jb250YWlucyh0b2tlbikgPT09ICFmb3JjZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZvcmNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gX3RvZ2dsZS5jYWxsKHRoaXMsIHRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgIH1cblxuICAgICAgdGVzdEVsZW1lbnQgPSBudWxsO1xuICAgIH0oKSk7XG4gIH1cbn1cbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuQXJyYXkuZnJvbTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICRPYmplY3QuZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjICAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBpbmRleCwgdmFsdWUpe1xuICBpZihpbmRleCBpbiBvYmplY3QpJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07IiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBJVEVSQVRPUiAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJtb2R1bGUuZXhwb3J0cyA9IHRydWU7IiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGRQcyAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpXG4gICwgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIEVtcHR5ICAgICAgID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfVxuICAsIFBST1RPVFlQRSAgID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24oKXtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJylcbiAgICAsIGkgICAgICA9IGVudW1CdWdLZXlzLmxlbmd0aFxuICAgICwgbHQgICAgID0gJzwnXG4gICAgLCBndCAgICAgPSAnPidcbiAgICAsIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlKGktLSlkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcyl7XG4gIHZhciByZXN1bHQ7XG4gIGlmKE8gIT09IG51bGwpe1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzICAgPSBnZXRLZXlzKFByb3BlcnRpZXMpXG4gICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICwgaSA9IDBcbiAgICAsIFA7XG4gIHdoaWxlKGxlbmd0aCA+IGkpZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59OyIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJRV9QUk9UTyAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKVxuICAsIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24oTyl7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3Ipe1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07IiwidmFyIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSlcbiAgLCBJRV9QUk9UTyAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBuYW1lcyl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwgaSAgICAgID0gMFxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGtleTtcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKXtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJylcbiAgLCB1aWQgICAgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIFN5bWJvbCAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2xcbiAgLCBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTsiLCJ2YXIgY2xhc3NvZiAgID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpXG4gICwgSVRFUkFUT1IgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24oaXQpe1xuICBpZihpdCAhPSB1bmRlZmluZWQpcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTsiLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIGdldCAgICAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgaXRlckZuID0gZ2V0KGl0KTtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICByZXR1cm4gYW5PYmplY3QoaXRlckZuLmNhbGwoaXQpKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsIGNhbGwgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJylcbiAgLCBpc0FycmF5SXRlciAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgICAgID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpXG4gICwgZ2V0SXRlckZuICAgICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uKGl0ZXIpeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlLyosIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKi8pe1xuICAgIHZhciBPICAgICAgID0gdG9PYmplY3QoYXJyYXlMaWtlKVxuICAgICAgLCBDICAgICAgID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheVxuICAgICAgLCBhTGVuICAgID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7ZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZ9KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iLCIvKlxyXG4gKiBCYXJjbGF5cyBEZXNpZ24gTGFuZ3VhZ2VcclxuICogQGRlc2MgQkRMIGVudHJ5IHBvaW50XHJcbiAqIEB2ZXJzaW9uIDEuMTMuMFxyXG4gKi9cclxuXHJcbi8vIFBvbHlmaWxsc1xyXG5pbXBvcnQgJ2NsYXNzbGlzdC1wb2x5ZmlsbCc7XHJcblxyXG4vLyBTZXJ2aWNlc1xyXG5pbXBvcnQgVXRpbCBmcm9tICcuL3NlcnZpY2VzL3V0aWwnO1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4vc2VydmljZXMvY29tcG9uZW50JztcclxuaW1wb3J0IEljb25zIGZyb20gJy4vc2VydmljZXMvaWNvbnMnO1xyXG5cclxuLy8gQ29tcG9uZW50c1xyXG5pbXBvcnQgQWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb24nO1xyXG5pbXBvcnQgQ29va2llcHJvbXB0IGZyb20gJy4vY29tcG9uZW50cy9jb29raWVwcm9tcHQnO1xyXG5pbXBvcnQgSWNvbiBmcm9tICcuL2NvbXBvbmVudHMvaWNvbic7XHJcbmltcG9ydCBNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvbW9kYWwnO1xyXG5pbXBvcnQgU2tpcGxpbmsgZnJvbSAnLi9jb21wb25lbnRzL3NraXBsaW5rJztcclxuaW1wb3J0IFRhYiBmcm9tICcuL2NvbXBvbmVudHMvdGFiJztcclxuXHJcbi8vIExlZ2FjeSBKU1xyXG5pbXBvcnQgJy4vc2VydmljZXMvZXh0ZW5kcyc7XHJcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9jb21wb25lbnRzL2dsb2JhbGhlYWRlcic7XHJcbmltcG9ydCBUYWJsZSBmcm9tICcuL2NvbXBvbmVudHMvdGFibGUnO1xyXG5cclxuLy8gSW5pdGlhbGlzZSBDb21wb25lbnRzXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XHJcblx0Ly8gQWNjb3JkaW9uXHJcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWNjb3JkaW9uJykpXHJcblx0XHQuZm9yRWFjaChlbCA9PiBuZXcgQWNjb3JkaW9uKGVsKSk7XHJcblx0Ly8gQ29va2llcHJvbXB0XHJcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtY29va2llcHJvbXB0JykpXHJcblx0XHQuZm9yRWFjaChlbCA9PiBuZXcgQ29va2llcHJvbXB0KGVsKSk7XHJcblx0Ly8gSGVhZGVyXHJcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZ2xvYmFsLWhlYWRlcicpKVxyXG5cdFx0LmZvckVhY2goZWwgPT4gbmV3IEhlYWRlcihlbCkpO1xyXG5cdC8vIEljb25cclxuXHRBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWljb24tZW1iZWRdJykpXHJcblx0XHQuZm9yRWFjaChlbCA9PiBuZXcgSWNvbihlbCkpO1xyXG5cdC8vIE1vZGFsXHJcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtbW9kYWwnKSlcclxuXHRcdC5mb3JFYWNoKGVsID0+IG5ldyBNb2RhbChlbCkpO1xyXG5cdC8vIFNraXBsaW5rc1xyXG5cdEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXNraXBsaW5rJykpXHJcblx0XHQuZm9yRWFjaChlbCA9PiBuZXcgU2tpcGxpbmsoZWwsIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKSkpO1xyXG5cdC8vIFRhYlxyXG5cdEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXRhYicpKVxyXG5cdFx0LmZvckVhY2goZWwgPT4gbmV3IFRhYihlbCkpO1xyXG5cdC8vIFRhYmxlXHJcblx0QXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtdGFibGUnKSlcclxuXHRcdC5mb3JFYWNoKGVsID0+IG5ldyBUYWJsZShlbCkpO1xyXG59KTtcclxuXHJcblxyXG4vKipcclxuICogUHVibGljIEFQSVxyXG4gKiBAcHVibGljXHJcbiAqIEB0eXBlIHtPYmplY3R9XHJcbiAqL1xyXG5jb25zdCBBUEkgPSB7XHJcblx0Q29tcG9uZW50czoge1xyXG5cdFx0QWNjb3JkaW9uLFxyXG5cdFx0Q29va2llcHJvbXB0LFxyXG5cdFx0SGVhZGVyLFxyXG5cdFx0SWNvbixcclxuXHRcdE1vZGFsLFxyXG5cdFx0U2tpcGxpbmssXHJcblx0XHRUYWIsXHJcblx0XHRUYWJsZSxcclxuXHR9LFxyXG5cdFV0aWwsXHJcblx0SWNvbnMsXHJcblx0Z2V0QWxsQ29tcG9uZW50czogQ29tcG9uZW50LmdldEFsbENvbXBvbmVudHMsXHJcblx0Z2V0Q29tcG9uZW50OiBDb21wb25lbnQuZ2V0Q29tcG9uZW50LFxyXG59O1xyXG5cclxud2luZG93LmJkbCA9IEFQSTtcclxuIiwiLyoqXHJcbiAqIEFjY29yZGlvblxyXG4gKiBAbW9kdWxlIEFjY29yZGlvblxyXG4gKiBAdmVyc2lvbiAxLjEzLjBcclxuICovXHJcbmltcG9ydCBVdGlsIGZyb20gJy4uL3NlcnZpY2VzL3V0aWwnO1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL3NlcnZpY2VzL2NvbXBvbmVudCc7XHJcblxyXG4vLyBBY2NvcmRpb24gQ2xhc3Nlc1xyXG5jb25zdCBIQVNKU19DTEFTUyA9ICdhY2NvcmRpb24taGFzanMnO1xyXG5jb25zdCBIRUFESU5HX0NMQVNTID0gJ2FjY29yZGlvbi1oZWFkaW5nLWxpbmsnO1xyXG5jb25zdCBIRUFESU5HX0FDVElWRV9DTEFTUyA9ICdhY2NvcmRpb24taGVhZGluZy1hY3RpdmUnO1xyXG5jb25zdCBDT05URU5UX1dSQVBQRVJfQ0xBU1MgPSAnYWNjb3JkaW9uLWNvbnRlbnQtd3JhcHBlcic7XHJcbmNvbnN0IENPTlRFTlRfVFJBTlNJVElPTklOR19DTEFTUyA9ICdhY2NvcmRpb24tY29udGVudC10cmFuc2l0aW9uaW5nJztcclxuY29uc3QgQ09OVEVOVF9DTE9TRURfQ0xBU1MgPSAnYWNjb3JkaW9uLWNvbnRlbnQtY2xvc2VkJztcclxuY29uc3QgQ09OVEVOVF9DTEFTUyA9ICdhY2NvcmRpb24tY29udGVudCc7XHJcblxyXG4vLyBBY2NvcmRpb24gRGF0YSBBdHRyaWJ1dGVzXHJcbmNvbnN0IERBVEEgPSB7XHJcblx0T1BFTjogJ2RhdGEtYWNjb3JkaW9uLW9wZW4nLFxyXG5cdE1VTFRJUExFOiAnZGF0YS1hY2NvcmRpb24tbXVsdGlwbGUnLFxyXG5cdFRSQU5TSVRJT046ICdkYXRhLWFjY29yZGlvbi10cmFuc2l0aW9uJyxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgQWNjb3JkaW9uIGNvbXBvbmVudFxyXG4gKiBAY2xhc3NcclxuICovXHJcbmNsYXNzIEFjY29yZGlvbiB7XHJcblx0LyoqXHJcblx0ICogSW5pdGlhbGlzZSBBY2NvcmRpb25cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOb2RlfSBlbCAtIENvbnRhaW5pbmcgQWNjb3JkaW9uIGVsZW1lbnRcclxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSBzdWNjZXNzXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoZWwpIHtcclxuXHRcdC8vIFJlZ2lzdGVyIGNvbXBvbmVudFxyXG5cdFx0dGhpcy5zdWNjZXNzID0gQ29tcG9uZW50LnJlZ2lzdGVyQ29tcG9uZW50KGVsLCB0aGlzKTtcclxuXHRcdGlmICghdGhpcy5zdWNjZXNzKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0Ly8gQWRkICotaGFzanMgY2xhc3NcclxuXHRcdGVsLmNsYXNzTGlzdC5hZGQoSEFTSlNfQ0xBU1MpO1xyXG5cclxuXHRcdC8vIFN0b3JlIGNvbnRhaW5pbmcgZWxlbWVudFxyXG5cdFx0dGhpcy5fZWwgPSBlbDtcclxuXHRcdC8vIFN0b3JlIGFycmF5IG9mIGVsZW1lbnQgSURzXHJcblx0XHR0aGlzLl9pZHMgPSBbXTtcclxuXHRcdC8vIEdldCBhcnJheSBvZiBhbGwgaGVhZGluZ3NcclxuXHRcdHRoaXMuX2hlYWRpbmdzID0gQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtIRUFESU5HX0NMQVNTfWApKTtcclxuXHRcdC8vIEdldCBhcnJheSBvZiBhbGwgY29udGVudCBzZWN0aW9uc1xyXG5cdFx0dGhpcy5fY29udGVudFNlY3Rpb25zID0gQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDT05URU5UX1dSQVBQRVJfQ0xBU1N9YCkpO1xyXG5cdFx0Ly8gQ2hlY2sgaWYgbXVsdGlwbGUgZGF0YSBhdHRyaWJ1dGUgaXMgc2V0XHJcblx0XHR0aGlzLl9hbGxvd011bHRpcGxlID0gZWwuZ2V0QXR0cmlidXRlKERBVEEuTVVMVElQTEUpICE9PSBudWxsO1xyXG5cclxuXHRcdC8vIGdlbmVyYXRlIElEc1xyXG5cdFx0dGhpcy5fZ2VuZXJhdGVJRHMoKTtcclxuXHJcblx0XHQvLyBpbml0IEFSSUEgYXR0cmlidXRlc1xyXG5cdFx0dGhpcy5faW5pdEFyaWFBdHRyaWJ1dGVzKGVsKTtcclxuXHJcblx0XHQvLyBjbG9zZSBhbGwgY29udGVudCBzZWN0aW9uc1xyXG5cdFx0dGhpcy5fY2xvc2VBbGxDb250ZW50U2VjdGlvbnMoKTtcclxuXHJcblx0XHQvLyBPcGVuIHNwZWNpZmljIHNlY3Rpb24gaWYgYW5jaG9yIGV4aXN0cyBpbiBVUkxcclxuXHRcdGNvbnN0IGFuY2hvciA9IHRoaXMuX29wZW5BbmNob3IoKTtcclxuXHJcblx0XHQvLyBvcGVuIGFsbCBzZWN0aW9ucyB3aXRoIGRhdGEgYXR0cmlidXRlIGlmIG5vIGFuY2hvciBwcmVzZW50IGluIFVSTFxyXG5cdFx0aWYgKCFhbmNob3IpIHtcclxuXHRcdFx0dGhpcy5fY29udGVudFNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24sIGluZGV4KSA9PiB7XHJcblx0XHRcdFx0aWYgKHNlY3Rpb24uZ2V0QXR0cmlidXRlKERBVEEuT1BFTikgIT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHRoaXMuX29wZW5Db250ZW50U2VjdGlvbihpbmRleCwgdHJ1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblxyXG5cdFx0Ly8gQXR0YWNoIGV2ZW50c1xyXG5cdFx0dGhpcy5fYXR0YWNoS2V5Ym9hcmRFdmVudHMoKTtcclxuXHRcdHRoaXMuX2F0dGFjaExpbmtFdmVudHMoKTtcclxuXHJcblx0XHQvLyBFbmFibGUgdHJhbnNpdGlvbnNcclxuXHRcdC8vIERvbmUgbGFzdCBzbyB0aGUgaW5pdGlhbCBjbG9zZSBvZiBjb250ZW50IHNlY3Rpb25zIGlzbid0IHRyYW5zaXRpb25lZFxyXG5cdFx0dGhpcy5fdXNlVHJhbnNpdGlvbnMgPSBVdGlsLmdldEVuYWJsZVRyYW5zaXRpb25zKCk7XHJcblx0XHR0aGlzLl90cmFuc2l0aW9uU3BlZWRzID0gVXRpbC5nZXRUcmFuc2l0aW9uU3BlZWRzKCk7XHJcblx0XHR0aGlzLl90cmFuc2l0aW9uVmlld3BvcnQgPSBlbC5nZXRBdHRyaWJ1dGUoREFUQS5UUkFOU0lUSU9OKSAhPT0gbnVsbDtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zdWNjZXNzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2V0IHdoZXRoZXIgbXVsdGlwbGUgY29tcG9uZW50cyBjYW4gYmUgb3BlbmVkIGF0IG9uY2VcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtCb29sZWFufSBtdWx0aXBsZVxyXG5cdCAqL1xyXG5cdHNldEFsbG93TXVsdGlwbGUobXVsdGlwbGUpIHtcclxuXHRcdHRoaXMuX2FsbG93TXVsdGlwbGUgPSBtdWx0aXBsZTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIE9wZW4gc2VjdGlvbiBpbiBhY2NvcmRpb24gYnkgaWRcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGlkXHJcblx0ICovXHJcblx0b3BlblNlY3Rpb25CeUlkKGlkKSB7XHJcblx0XHRmb3IgKGNvbnN0IHNlY3Rpb24gb2YgdGhpcy5fY29udGVudFNlY3Rpb25zKSB7XHJcblx0XHRcdGlmIChzZWN0aW9uLmlkID09PSBpZCkge1xyXG5cdFx0XHRcdGNvbnN0IGluZGV4ID0gdGhpcy5fY29udGVudFNlY3Rpb25zLmluZGV4T2Yoc2VjdGlvbik7XHJcblx0XHRcdFx0dGhpcy5fb3BlbkNvbnRlbnRTZWN0aW9uKGluZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2V0IHdoZXRoZXIgdmlld3BvcnQgc2hvdWxkIHRyYW5zaXRpb24gdG8gY29udGVudCB3aGVuIG9wZW5lZFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IGVuYWJsZVxyXG5cdCAqIEBub3RlIERvZXMgbm90IHdvcmsgaW4gSUVcclxuXHQgKi9cclxuXHRzZXRUcmFuc2l0aW9uVmlld3BvcnQoZW5hYmxlKSB7XHJcblx0XHR0aGlzLl90cmFuc2l0aW9uVmlld3BvcnQgPSBlbmFibGU7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZW5lcmF0ZSBJRHMgZm9yIGVhY2ggc2VjdGlvbiBmcm9tIHRoZSBocmVmXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfZ2VuZXJhdGVJRHMoKSB7XHJcblx0XHR0aGlzLl9oZWFkaW5ncy5mb3JFYWNoKGxpbmsgPT4ge1xyXG5cdFx0XHRjb25zdCBpZCA9IGxpbmsuaHJlZi5zcGxpdCgnIycpWzFdO1xyXG5cclxuXHRcdFx0Ly8gU3RvcmUgSURzIGluIHByaXZhdGUgb2JqZWN0XHJcblx0XHRcdHRoaXMuX2lkcy5wdXNoKHtcclxuXHRcdFx0XHR0YWI6IGAke2lkfS10YWJgLFxyXG5cdFx0XHRcdHBhbmVsOiBpZCxcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpc2UgQVJJQSBhdHRyaWJ1dGVzXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge05vZGV9IGVsIC0gQ29udGFpbmluZyBBY2NvcmRpb24gZWxlbWVudFxyXG5cdCAqL1xyXG5cdF9pbml0QXJpYUF0dHJpYnV0ZXMoZWwpIHtcclxuXHRcdGVsLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0Jyk7XHJcblx0XHR0aGlzLl9oZWFkaW5ncy5mb3JFYWNoKChsaW5rLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRsaW5rLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKTtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XHJcblx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0XHRsaW5rLnNldEF0dHJpYnV0ZSgnaWQnLCB0aGlzLl9pZHNbaW5kZXhdLnRhYik7XHJcblx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy5faWRzW2luZGV4XS5wYW5lbCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuX2NvbnRlbnRTZWN0aW9ucy5mb3JFYWNoKChzZWN0aW9uLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJwYW5lbCcpO1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XHJcblx0XHRcdHNlY3Rpb24uc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuX2lkc1tpbmRleF0ucGFuZWwpO1xyXG5cdFx0XHRzZWN0aW9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgdGhpcy5faWRzW2luZGV4XS50YWIpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBdHRhY2gga2V5Ym9hcmQgZXZlbnRzXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfYXR0YWNoS2V5Ym9hcmRFdmVudHMoKSB7XHJcblx0XHR0aGlzLl9oZWFkaW5ncy5mb3JFYWNoKChsaW5rLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuXHRcdFx0XHRpZiAoLyg0MHwzOXwzOHwzN3wzNnwzNXwzMikvLnRlc3QoZS5rZXlDb2RlKSkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKC8oNDB8MzkpLy50ZXN0KGUua2V5Q29kZSkpIHsgLy8gRG93bi9SaWdodCBhcnJvd1xyXG5cdFx0XHRcdFx0aWYgKGluZGV4IDwgdGhpcy5faGVhZGluZ3MubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9oZWFkaW5nc1tpbmRleCArIDFdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9oZWFkaW5nc1swXS5mb2N1cygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoLygzOHwzNykvLnRlc3QoZS5rZXlDb2RlKSkgeyAvLyBVcC9MZWZ0IGFycm93XHJcblx0XHRcdFx0XHRpZiAoaW5kZXggPT09IDApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5faGVhZGluZ3NbdGhpcy5faGVhZGluZ3MubGVuZ3RoIC0gMV0uZm9jdXMoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuX2hlYWRpbmdzW2luZGV4IC0gMV0uZm9jdXMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzYpIHsgLy8gSG9tZSBrZXlcclxuXHRcdFx0XHRcdHRoaXMuX2hlYWRpbmdzWzBdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR0aGlzLl9vcGVuQ29udGVudFNlY3Rpb24oMCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM1KSB7IC8vIEVuZCBrZXlcclxuXHRcdFx0XHRcdHRoaXMuX2hlYWRpbmdzW3RoaXMuX2hlYWRpbmdzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR0aGlzLl9vcGVuQ29udGVudFNlY3Rpb24odGhpcy5faGVhZGluZ3MubGVuZ3RoIC0gMSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDMyKSB7IC8vIFNwYWNlIGtleVxyXG5cdFx0XHRcdFx0aWYgKGxpbmsuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9jbG9zZUNvbnRlbnRTZWN0aW9uKGluZGV4KTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuX29wZW5Db250ZW50U2VjdGlvbihpbmRleCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXR0YWNoIGNsaWNrIGV2ZW50cyB0byB0aGlzLl9oZWFkaW5nc1xyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X2F0dGFjaExpbmtFdmVudHMoKSB7XHJcblx0XHR0aGlzLl9oZWFkaW5nc1xyXG5cdFx0XHQuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcclxuXHRcdFx0XHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRpZiAobGluay5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuX2Nsb3NlQ29udGVudFNlY3Rpb24oaW5kZXgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5fb3BlbkNvbnRlbnRTZWN0aW9uKGluZGV4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTZXQgQ29udGVudCBzZWN0aW9uIGVsZW1lbnQgaGVpZ2h0IHRvIGNoaWxkIGhlaWdodFxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIEluZGV4IG9mIGNvbnRlbnQgc2VjdGlvblxyXG5cdCAqIEBwYXJhbSB7SW50ZWdlcn0gaGVpZ2h0IC0gT3B0aW9uYWwgaGVpZ2h0ICh3aWxsIG92ZXJyaWRlIHRoZSBjaGlsZCdzIGhlaWdodClcclxuXHQgKiBAcmV0dXJucyB7Qm9vbGVhbn0gc3VjY2Vzc1xyXG5cdCAqL1xyXG5cdF9zZXRDb250ZW50U2VjdGlvbkhlaWdodChpbmRleCkge1xyXG5cdFx0Y29uc3Qgc2VjdGlvbiA9IHRoaXMuX2NvbnRlbnRTZWN0aW9uc1tpbmRleF07XHJcblx0XHRpZiAoc2VjdGlvbikge1xyXG5cdFx0XHRjb25zdCBoZWlnaHQgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoYC4ke0NPTlRFTlRfQ0xBU1N9YCkuY2xpZW50SGVpZ2h0IHx8IDA7XHJcblx0XHRcdHNlY3Rpb24uc3R5bGUubWF4SGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcclxuXHRcdFx0cmV0dXJuIGhlaWdodCA+IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBPcGVuIHNwZWNpZmljIHNlY3Rpb24gaWYgYW5jaG9yIGlzIHByZXNlbnRcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEByZXR1cm5zIHtCb29sZWFufSBzdWNjZXNzXHJcblx0ICovXHJcblx0X29wZW5BbmNob3IoKSB7XHJcblx0XHQvLyBTdHJpcCBvdXQgaWxsZWdhbCBjaGFycyBmcm9tIGhhc2hcclxuXHRcdGNvbnN0IGlkID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZSgvW14wLTlhLXpfLV0vZ2ksICcnKTtcclxuXHRcdC8vIENoZWNrIGlmIGVsZW1lbnQgd2l0aCBjb3JyZXNwb25kaW5nIElEIGV4aXN0cyBpbiB0aGUgRE9NXHJcblx0XHRjb25zdCBlbCA9IGlkICYmIHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApO1xyXG5cdFx0aWYgKGVsKSB7XHJcblx0XHRcdC8vIE9wZW4gc3BlY2lmaWMgc2VjdGlvblxyXG5cdFx0XHR0aGlzLl9vcGVuQ29udGVudFNlY3Rpb24odGhpcy5fY29udGVudFNlY3Rpb25zLmluZGV4T2YoZWwpLCB0cnVlKTtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbG9zZSBhbGwgY29udGVudCBzZWN0aW9uc1xyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X2Nsb3NlQWxsQ29udGVudFNlY3Rpb25zKCkge1xyXG5cdFx0Ly8gVXBkYXRlIGFsbCBoZWFkaW5nc1xyXG5cdFx0dGhpcy5faGVhZGluZ3MuZm9yRWFjaChoZWFkaW5nID0+IHtcclxuXHRcdFx0aGVhZGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XHJcblx0XHRcdGhlYWRpbmcuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0XHRoZWFkaW5nLmNsYXNzTGlzdC5yZW1vdmUoSEVBRElOR19BQ1RJVkVfQ0xBU1MpO1xyXG5cdFx0fSk7XHJcblx0XHQvLyBDbG9zZSBhbGwgY29udGVudCBzZWN0aW9uc1xyXG5cdFx0dGhpcy5fY29udGVudFNlY3Rpb25zLmZvckVhY2goKHNlY3Rpb24sIGluZGV4KSA9PiB7XHJcblx0XHRcdHRoaXMuX2Nsb3NlQ29udGVudFNlY3Rpb24oaW5kZXgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0LyoqXHJcblx0ICogQ2xvc2UgY29udGVudCBzZWN0aW9uXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge0ludGVnZXJ9IGluZGV4IC0gSW5kZXggb2YgY29udGVudCBzZWN0aW9uIHRvIGNsb3NlXHJcblx0ICovXHJcblx0X2Nsb3NlQ29udGVudFNlY3Rpb24oaW5kZXgpIHtcclxuXHRcdGNvbnN0IGhlYWRpbmcgPSB0aGlzLl9oZWFkaW5nc1tpbmRleF07XHJcblx0XHRjb25zdCBzZWN0aW9uID0gdGhpcy5fY29udGVudFNlY3Rpb25zW2luZGV4XTtcclxuXHJcblx0XHQvLyBJZiBzZWN0aW9uIGlzbid0IGNsb3NlZFxyXG5cdFx0aWYgKGhlYWRpbmcgJiYgc2VjdGlvbiAmJiAhc2VjdGlvbi5jbGFzc0xpc3QuY29udGFpbnMoQ09OVEVOVF9DTE9TRURfQ0xBU1MpKSB7XHJcblx0XHRcdC8vIFVwZGF0ZSBoZWFkaW5nXHJcblx0XHRcdGhlYWRpbmcuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xyXG5cdFx0XHRoZWFkaW5nLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIGZhbHNlKTtcclxuXHRcdFx0aGVhZGluZy5jbGFzc0xpc3QucmVtb3ZlKEhFQURJTkdfQUNUSVZFX0NMQVNTKTtcclxuXHJcblx0XHRcdGlmICh0aGlzLl91c2VUcmFuc2l0aW9ucykge1xyXG5cdFx0XHRcdC8vIFRvIHRyYW5zaXRpb24gdGhlIGNvbnRlbnQgc2VjdGlvbiBjbG9zZWQsIHdlIG11c3QgZmlyc3QgbWFudWFsbHkgc2V0IHRoZSBoZWlnaHRcclxuXHRcdFx0XHR0aGlzLl9zZXRDb250ZW50U2VjdGlvbkhlaWdodChpbmRleCk7XHJcblx0XHRcdFx0c2VjdGlvbi5jbGFzc0xpc3QuYWRkKENPTlRFTlRfVFJBTlNJVElPTklOR19DTEFTUyk7XHJcblx0XHRcdFx0Ly8gUGF1c2UgYmVmb3JlIHJlbW92aW5nIHRoZSBoZWlnaHQgYXR0cmlidXRlXHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRzZWN0aW9uLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcblx0XHRcdFx0XHQvLyBXYWl0IGZvciB0cmFuc2l0aW9uIHRvIGZpbmlzaCBiZWZvcmUgdXBkYXRpbmcgdGhlIGNsYXNzXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdFx0c2VjdGlvbi5jbGFzc0xpc3QuYWRkKENPTlRFTlRfQ0xPU0VEX0NMQVNTKTtcclxuXHRcdFx0XHRcdFx0c2VjdGlvbi5jbGFzc0xpc3QucmVtb3ZlKENPTlRFTlRfVFJBTlNJVElPTklOR19DTEFTUyk7XHJcblx0XHRcdFx0XHR9LCB0aGlzLl90cmFuc2l0aW9uU3BlZWRzLm1lZGl1bSAtIDEpO1xyXG5cdFx0XHRcdH0sIDEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIE5vIHRyYW5zaXRpb24sIGp1c3QgYWRkIGNsb3NlZCBjbGFzc1xyXG5cdFx0XHRcdHNlY3Rpb24uY2xhc3NMaXN0LmFkZChDT05URU5UX0NMT1NFRF9DTEFTUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBPcGVuIGNvbnRlbnQgc2VjdGlvblxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleCAtIEluZGV4IG9mIGNvbnRlbnQgc2VjdGlvbiB0byBzaG93XHJcblx0ICogQHBhcmFtIHtCb29sZWFufSBub1RyYW5zaXRpb25zIC0gRm9yY2UgZGlzYWJsZSB0cmFuc2l0aW9uc1xyXG5cdCAqL1xyXG5cdF9vcGVuQ29udGVudFNlY3Rpb24oaW5kZXgsIG5vVHJhbnNpdGlvbnMpIHtcclxuXHRcdC8vIENsb3NlIGFsbCBpZiBtdWx0aXBsZSBhcmVuJ3QgYWxsb3dlZFxyXG5cdFx0aWYgKCF0aGlzLl9hbGxvd011bHRpcGxlKSB7XHJcblx0XHRcdHRoaXMuX2Nsb3NlQWxsQ29udGVudFNlY3Rpb25zKCk7XHJcblx0XHR9XHJcblx0XHRjb25zdCBoZWFkaW5nID0gdGhpcy5faGVhZGluZ3NbaW5kZXhdO1xyXG5cdFx0Y29uc3Qgc2VjdGlvbiA9IHRoaXMuX2NvbnRlbnRTZWN0aW9uc1tpbmRleF07XHJcblxyXG5cdFx0aWYgKGhlYWRpbmcgJiYgc2VjdGlvbikge1xyXG5cdFx0XHQvLyBVcGRhdGUgaGVhZGluZ3NcclxuXHRcdFx0aGVhZGluZy5jbGFzc0xpc3QuYWRkKEhFQURJTkdfQUNUSVZFX0NMQVNTKTtcclxuXHRcdFx0aGVhZGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcclxuXHRcdFx0aGVhZGluZy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHJcblx0XHRcdC8vIE9wZW4gY29udGVudCBzZWN0aW9uXHJcblx0XHRcdGlmICghbm9UcmFuc2l0aW9ucyAmJiB0aGlzLl91c2VUcmFuc2l0aW9ucykge1xyXG5cdFx0XHRcdC8vIFJlbW92ZSBjbG9zZWQvY2xvc2luZyBjbGFzcyBhbmQgYWRkIG9wZW5pbmcgY2xhc3MgYW5kIGhlaWdodFxyXG5cdFx0XHRcdHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShDT05URU5UX1RSQU5TSVRJT05JTkdfQ0xBU1MpO1xyXG5cdFx0XHRcdHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShDT05URU5UX0NMT1NFRF9DTEFTUyk7XHJcblx0XHRcdFx0c2VjdGlvbi5jbGFzc0xpc3QuYWRkKENPTlRFTlRfVFJBTlNJVElPTklOR19DTEFTUyk7XHJcblx0XHRcdFx0dGhpcy5fc2V0Q29udGVudFNlY3Rpb25IZWlnaHQoaW5kZXgpO1xyXG5cdFx0XHRcdC8vIFBhdXNlIGFuZCByZW1vdmUgb3BlbmluZyBjbGFzcyBhbmQgaGVpZ2h0XHJcblx0XHRcdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRzZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoQ09OVEVOVF9UUkFOU0lUSU9OSU5HX0NMQVNTKTtcclxuXHRcdFx0XHRcdHNlY3Rpb24uc3R5bGUubWF4SGVpZ2h0ID0gbnVsbDtcclxuXHRcdFx0XHR9LCB0aGlzLl90cmFuc2l0aW9uU3BlZWRzLm1lZGl1bSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gTm8gdHJhbnNpdGlvbiwganVzdCByZW1vdmUgY2xvc2luZy9jbG9zZWQgY2xhc3NlZFxyXG5cdFx0XHRcdHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShDT05URU5UX1RSQU5TSVRJT05JTkdfQ0xBU1MpO1xyXG5cdFx0XHRcdHNlY3Rpb24uY2xhc3NMaXN0LnJlbW92ZShDT05URU5UX0NMT1NFRF9DTEFTUyk7XHJcblx0XHRcdH1cclxuXHRcdFx0c2VjdGlvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG5cclxuXHRcdFx0Ly8gVHJhbnNpdGlvbiB2aWV3cG9ydCBpZiBlbmFibGVkXHJcblx0XHRcdGlmICghbm9UcmFuc2l0aW9ucyAmJiB0aGlzLl90cmFuc2l0aW9uVmlld3BvcnQpIHtcclxuXHRcdFx0XHR0aGlzLl90cmFuc2l0aW9uVmlld3BvcnRUb1NlY3Rpb24oaW5kZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUcmFuc2l0aW9uIHZpZXdwb3J0IHRvIHNlY3Rpb25cclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqIEBwYXJhbSB7SW50ZWdlcn0gaW5kZXggLSBJbmRleCBvZiBjb250ZW50IHNlY3Rpb24gdG8gdHJhbnNpdGlvbiB0b1xyXG5cdCAqL1xyXG5cdF90cmFuc2l0aW9uVmlld3BvcnRUb1NlY3Rpb24oaW5kZXgpIHtcclxuXHRcdC8vIFRlc3QgaWYgc2Nyb2xsIG1ldGhvZCBleGlzdHNcclxuXHRcdGlmICh3aW5kb3cuc2Nyb2xsQnkpIHtcclxuXHRcdFx0Ly8gU3RvcCBhbnkgZXhpc3RpbmcgdHJhbnNpdGlvbnNcclxuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLl90cmFuc2l0aW9uVmlld3BvcnRJbnRlcnZhbCk7XHJcblxyXG5cdFx0XHRjb25zdCBsaW5rID0gdGhpcy5faGVhZGluZ3NbaW5kZXhdO1xyXG5cdFx0XHRjb25zdCBoZWFkZXJIZWlnaHQgPSBVdGlsLmdldEhlYWRlckhlaWdodCgpICsgMTA7IC8vIHB4IGhlaWdodCBvZiBoZWFkZXJcclxuXHJcblx0XHRcdC8vIEdldCBkZXN0aW5hdGlvblxyXG5cdFx0XHRjb25zdCBhY2NvcmRpb25Qb3MgPSBVdGlsLmdldEVsZW1lbnRQb3NpdGlvbih0aGlzLl9lbCkudG9wIC0gaGVhZGVySGVpZ2h0O1xyXG5cdFx0XHRsZXQgY3VycmVudFBvcyA9IFV0aWwuZ2V0Vmlld3BvcnRQb3NpdGlvbigpLnRvcDtcclxuXHRcdFx0Y29uc3QgZGVzdGluYXRpb24gPSBhY2NvcmRpb25Qb3MgKyAobGluay5jbGllbnRIZWlnaHQgKiBpbmRleCk7XHJcblxyXG5cdFx0XHRjb25zdCBpbnRlcnZhbCA9IDEwMCAvIDY7IC8vIDYwZnBzXHJcblx0XHRcdGNvbnN0IGRpc3RhbmNlID0gTWF0aC5hYnMoZGVzdGluYXRpb24gLSBjdXJyZW50UG9zKTtcclxuXHRcdFx0Y29uc3Qgc2Nyb2xsU3RlcCA9IGRpc3RhbmNlIC8gKHRoaXMuX3RyYW5zaXRpb25TcGVlZHMuZmFzdCAvIGludGVydmFsKTtcclxuXHRcdFx0Y29uc3QgZG93biA9IGRlc3RpbmF0aW9uID4gY3VycmVudFBvczsgLy8gdHJ1ZSA9IGRvd24sIGZhbHNlID0gdXBcclxuXHRcdFx0Ly8gU3RhcnQgdHJhbnNpdGlvblxyXG5cdFx0XHR0aGlzLl90cmFuc2l0aW9uVmlld3BvcnRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuXHRcdFx0XHR3aW5kb3cuc2Nyb2xsQnkoMCwgZG93biA/IHNjcm9sbFN0ZXAgOiAtc2Nyb2xsU3RlcCk7XHJcblx0XHRcdFx0Ly8gdGVzdCBpZiB3ZSBzaG91bGQgc3RvcCBzY3JvbGxpbmdcclxuXHRcdFx0XHRjb25zdCBwb3MgPSBVdGlsLmdldFZpZXdwb3J0UG9zaXRpb24oKS50b3A7XHJcblx0XHRcdFx0aWYgKHBvcyA9PT0gY3VycmVudFBvcyB8fFxyXG5cdFx0XHRcdFx0KGRvd24gJiYgcG9zID4gZGVzdGluYXRpb24pIHx8XHJcblx0XHRcdFx0XHQoIWRvd24gJiYgcG9zIDwgZGVzdGluYXRpb24pKSB7XHJcblx0XHRcdFx0XHQvLyBTdG9wIHNjcm9sbFxyXG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLl90cmFuc2l0aW9uVmlld3BvcnRJbnRlcnZhbCk7XHJcblx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwgZGVzdGluYXRpb24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjdXJyZW50UG9zID0gcG9zO1xyXG5cdFx0XHR9LCBpbnRlcnZhbCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBJbml0aWFsaXNlIGFsbCBlbGVtZW50cyBvbiBET00gcmVhZHlcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuXHRBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1hY2NvcmRpb24nKSlcclxuXHRcdC5mb3JFYWNoKGVsID0+IG5ldyBBY2NvcmRpb24oZWwpKTtcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY2NvcmRpb247XHJcbiIsIi8qKlxyXG4gKiBDb29raWVwcm9tcHRcclxuICogQG1vZHVsZSBDb29raWVwcm9tcHRcclxuICogQHZlcnNpb24gMS4xMy4wXHJcbiAqL1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL3NlcnZpY2VzL2NvbXBvbmVudCc7XHJcblxyXG5jb25zdCBDTE9TSU5HX0NMQVNTID0gJ2Nvb2tpZXByb21wdC1jbG9zZSc7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IENvb2tpZXByb21wdCBjb21wb25lbnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5jbGFzcyBDb29raWVwcm9tcHQge1xyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpc2UgQ29va2llcHJvbXB0XHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7Tm9kZX0gZWwgLSBDb250YWluaW5nIENvb2tpZXByb21wdCBlbGVtZW50XHJcblx0ICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2sgLSBPcHRpb25hbCBjYWxsYmFjayB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkXHJcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGVsLCBjYWxsYmFjaykge1xyXG5cdFx0Ly8gUmVnaXN0ZXIgY29tcG9uZW50XHJcblx0XHR0aGlzLnN1Y2Nlc3MgPSBDb21wb25lbnQucmVnaXN0ZXJDb21wb25lbnQoZWwsIHRoaXMpO1xyXG5cdFx0aWYgKCF0aGlzLnN1Y2Nlc3MpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHQvLyBTdG9yZSBjb250YWluaW5nIGVsZW1lbnRcclxuXHRcdHRoaXMuX2VsID0gZWw7XHJcblx0XHQvLyBTdG9yZSBjYWxsYmFja1xyXG5cdFx0dGhpcy5zZXRDYWxsYmFjayhjYWxsYmFjayk7XHJcblxyXG5cdFx0ZWwucXVlcnlTZWxlY3RvcignLmJ0bicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdC8vIEFkZCBjbG9zaW5nIGNsYXNzXHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoQ0xPU0lOR19DTEFTUyk7XHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgbm9kZSBhZnRlciBkZWxheVxyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpLCA1MDApO1xyXG5cclxuXHRcdFx0Ly8gRXhlY3V0ZSBjYWxsYmFja1xyXG5cdFx0XHRpZiAodGhpcy5fY2FsbGJhY2spIHRoaXMuX2NhbGxiYWNrKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zdWNjZXNzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2V0IGNhbGxiYWNrXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xyXG5cdCAqL1xyXG5cdHNldENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcblx0XHRpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29va2llcHJvbXB0O1xyXG4iLCIvKipcclxuICogSGVhZGVyXHJcbiAqIEBtb2R1bGUgSGVhZGVyXHJcbiAqIEB2ZXJzaW9uIDEuMTMuMFxyXG4gKi9cclxuXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbmNvbnN0IEhlYWRlciA9IChmdW5jdGlvbigkKSB7XHJcblxyXG5cdC8vIEdsb2JhbCBzdGF0ZSB2YXJpYWJsZXNcclxuXHR2YXIgc3RhdGUgPSAnJztcclxuXHR2YXIgd2luZG93SGVpZ2h0LCB3aW5kb3dXaWR0aDtcclxuXHR2YXIgaGVhZGVySGVpZ2h0O1xyXG5cdHZhciBoZWlnaHRzID0ge1xyXG5cdFx0c2VnbWVudDoge1xyXG5cdFx0XHRtb2JpbGU6IDM2LFxyXG5cdFx0XHR0YWJsZXQ6IDM2LFxyXG5cdFx0XHRkZXNrdG9wOiAzNixcclxuXHRcdFx0bWluaW1pc2VkOiAwLFxyXG5cdFx0fSxcclxuXHRcdGhlYWRlcjoge1xyXG5cdFx0XHRtb2JpbGU6IDU0LFxyXG5cdFx0XHR0YWJsZXQ6IDY2LFxyXG5cdFx0XHRkZXNrdG9wOiAxMjYsXHJcblx0XHRcdG1pbmltaXNlZDogNTQsXHJcblx0XHR9LFxyXG5cdH07XHJcblx0dmFyIGJyZWFrcG9pbnRzID0ge1xyXG5cdFx0ZGVza3RvcDoge1xyXG5cdFx0XHRtaW46IDEwMjQsXHJcblx0XHRcdG1heDogOTk5OVxyXG5cdFx0fSxcclxuXHRcdHRhYmxldFBvcnRyYWl0OiB7XHJcblx0XHRcdG1pbjogNzY4LFxyXG5cdFx0XHRtYXg6IDEwMjNcclxuXHRcdH0sXHJcblx0XHRtb2JpbGU6IHtcclxuXHRcdFx0bWluOiAxLFxyXG5cdFx0XHRtYXg6IDc2N1xyXG5cdFx0fVxyXG5cdH07XHJcblx0dmFyIG9wdGlvbnMgPSB7XHJcblx0XHRiYXNlcGF0aDogJy9iZGwvJyxcclxuXHRcdGZvcm06IHtcclxuXHRcdFx0YWRkTW9kQ2xhc3NOYW1lOiB0cnVlXHJcblx0XHR9LFxyXG5cdFx0Z3JpZFR5cGU6IG51bGwsXHJcblx0XHRoYXNUb3VjaDogZmFsc2UsXHJcblx0XHRsb2c6IHtcclxuXHRcdFx0ZW5hYmxlZDogZmFsc2VcclxuXHRcdH0sXHJcblx0XHRtb2RzRm9ySW5pdDoge30sXHJcblx0XHRtb2RzSW5QYWdlOiB7fSxcclxuXHRcdG92ZXJsYXlBY3RpdmU6IGZhbHNlLFxyXG5cdFx0dGFwT3JDbGlja0V2ZW50OiAnY2xpY2snLFxyXG5cdFx0dGltaW5nczoge1xyXG5cdFx0XHRyZXNpemVEZWJvdW5jZTogNTAsXHJcblx0XHRcdHNjcm9sbERlYm91bmNlOiAxNSxcclxuXHRcdFx0ZGVib3VuY2U6IDI1MFxyXG5cdFx0fSxcclxuXHRcdHdpbmRvd0hlaWdodDogZ2V0Vmlld3BvcnRFbGVtZW50KCkuaGVpZ2h0KCksXHJcblx0XHR3aW5kb3dXaWR0aDogd2luZG93LmlubmVyV2lkdGggfHwgJCh3aW5kb3cpLndpZHRoKCksXHJcblx0XHRhcmlhRGVzY3JpYmVkYnkgOiB7XHJcblx0XHRcdGFyaWFPcGVuQ29uZmlybSA6ICdzdWIgaGVhZGluZyBsZXZlbCAyIG9mIGV4cGFuZGVkIG1lbnUgaXRlbSBsZXZlbCAxLicsXHJcblx0XHRcdGFyaWFMZWZ0UmlnaHRBcnJvd01vdmVCZXR3ZWVuSGVhZGluZyA6ICdVc2UgbGVmdCBhbmQgcmlnaHQgYXJyb3cgdG8gbW92ZSBhcm91bmQgc3ViIGhlYWRpbmcgb2YgbWVudS4nLFxyXG5cdFx0XHRhcmlhVXBEb3duQXJyb3cgOiAnVXNlIHVwIGFuZCBkb3duIGFycm93IG9yIHRhYiB0byBuYXZpZ2F0ZSBiZXR3ZWVuIGVhY2ggbGluayBhbmQgc2VjdGlvbi4nLFxyXG5cdFx0XHRhcmlhQ2xlYXJGaWVsZCA6ICdQcmVzcyBlbnRlciB0byBjbGVhciB0ZXh0IGZpZWxkLidcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvKlxyXG5cdCAqIFJldHVybiB3aW5kb3cgb3Igdmlld3BvcnQgaWYgcGFyYWxsYXggaXMgZW5hYmxlZFxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGdldFZpZXdwb3J0RWxlbWVudCgpIHtcclxuXHRcdHZhciBwYXJhbGxheCA9ICQoJy5wYXJhbGxheC12aWV3cG9ydCcpO1xyXG5cdFx0cmV0dXJuIHBhcmFsbGF4Lmxlbmd0aCA/IHBhcmFsbGF4IDogJCh3aW5kb3cpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gSGVhZGVyKCkge1xyXG5cclxuXHRcdC8vIENhbGwgc2l6ZSBmdW5jdGlvbi4gU2V0cyB1cCBpbml0aWFsIHN0YXRlIHZhcmlhYmxlXHJcblx0XHRzaXplKCk7XHJcblxyXG5cdFx0Ly8gVXBkYXRlIHN0YXRlIHZhcmlhYmxlXHJcblx0XHR1cGRhdGVTdGF0ZSgpO1xyXG5cclxuXHRcdC8vIFNldHVwIGluaXRpYWwgc3RhdGVcclxuXHRcdGNoYW5nZVN0YXRlKHN0YXRlKTtcclxuXHJcblx0XHQvLyBzdGF0ZSBjaGFuZ2Ugb24gc2Nyb2xsXHJcblx0XHRvblNjcm9sbENoYW5nZVN0YXRlKCk7XHJcblxyXG5cdFx0Ly8gdXBkYXRlIHNlZ21lbnQgd2hlbiBvbiBzY3JvbGxcclxuXHRcdG9uU2Nyb2xsU2VnbWVudEJhcigpO1xyXG5cclxuXHRcdC8vIFJlc2l6ZVxyXG5cdFx0cmVzaXplKCk7XHJcblxyXG5cdFx0Ly8gU2V0dXAgVXRpbGl0aWVzIGxpc3QgZm9yIERlc2t0b3Agc3RhdGVcclxuXHRcdGdldFV0aWxpdGllcygpO1xyXG5cclxuXHRcdC8vIHNob3cgc2VnbWVudCBiYXJcclxuXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnc2VnbWVudC12aXNpYmxlJyk7XHJcblx0XHQvLyB3YWl0IGFuZCBlbmFibGUgdHJhbnNpdGlvbnNcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWdtZW50JykuYWRkQ2xhc3MoJ3NlZ21lbnQtdHJhbnNpdGlvbicpO1xyXG5cdFx0fSwgMjUwKTtcclxuXHJcblx0XHRhcHBlbmRBcmlhRGVzY3JpcHRpb24oKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogQXBwZW5kcyBhbGwgdGhlIGRlc2NyaXB0aW9uIGZyb20gb2JqZWN0IG9wdGlvbnMuYXJpYURlc2NyaWJlZGJ5IHRvIGJvZHkuXHJcblx0Ki9cclxuXHRmdW5jdGlvbiBhcHBlbmRBcmlhRGVzY3JpcHRpb24oKXtcclxuXHRcdGZvcih2YXIga2V5IGluIG9wdGlvbnMuYXJpYURlc2NyaWJlZGJ5KXtcclxuXHRcdFx0dmFyIGRlc2NyaXB0aW9uSXRlbSA9ICQoJzxwPicpLmF0dHIoeydjbGFzcyc6J2FjY2VzcycsICdhcmlhLWhpZGRlbic6ICd0cnVlJywgJ2lkJzoga2V5fSkudGV4dChvcHRpb25zLmFyaWFEZXNjcmliZWRieVtrZXldKTtcclxuXHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5hcHBlbmQoZGVzY3JpcHRpb25JdGVtKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBSZXNldCBhbmQgaW5pdGlhbGlzZSBiaW5kaW5ncywgdXBkYXRlIGhlYWRlciBjbGFzc1xyXG5cdCpAcGFyYW0gKHN0cmluZykgOiBTdGF0ZSB0byBiZSBjaGFuZ2VkIHRvXHJcblx0Ki9cclxuXHJcblx0ZnVuY3Rpb24gY2hhbmdlU3RhdGUodG9TdGF0ZSkge1xyXG5cclxuXHRcdCQoJ2hlYWRlcicpXHJcblx0XHRcdC5yZW1vdmVDbGFzcygpXHJcblx0XHRcdC5hZGRDbGFzcygnZ2xvYmFsLWhlYWRlciBqcy1nbG9iYWxoZWFkZXIgJyArIHRvU3RhdGUpO1xyXG5cclxuXHRcdCQoJy5tYWluLW5hdicpLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0cmVzZXRTdGF0ZUV2ZW50cygpO1xyXG5cclxuXHRcdGluaXRpYWxpc2VTdGF0ZSh0b1N0YXRlKTtcclxuXHJcblx0XHR1cGRhdGVCb2R5Q2xhc3NlcygpO1xyXG5cclxuXHJcblxyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIFJlc2V0IGFuZCBpbml0aWFsaXNlIGJpbmRpbmdzXHJcblx0Ki9cclxuXHJcblx0ZnVuY3Rpb24gcmVzZXRTdGF0ZUV2ZW50cygpIHtcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyLCAuZ2xvYmFsLWhlYWRlciAqJykudW5iaW5kKCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogU3RhdGUgcm91dGVyXHJcblx0Ki9cclxuXHJcblx0ZnVuY3Rpb24gaW5pdGlhbGlzZVN0YXRlKHRvU3RhdGUpIHtcclxuXHJcblxyXG5cclxuXHRcdHN3aXRjaCAodG9TdGF0ZSkge1xyXG5cclxuXHRcdFx0Y2FzZSAnbWluaW1pc2VkJzpcclxuXHRcdFx0XHRtaW5pbWlzZWQoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICd0YWJsZXQtcG9ydHJhaXQnOlxyXG5cdFx0XHRcdHRhYmxldFBvcnRyYWl0KCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0Y2FzZSAndGFibGV0LXBvcnRyYWl0LW5hdic6XHJcblx0XHRcdFx0dGFibGV0UG9ydHJhaXROYXYoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICd0YWJsZXQtcG9ydHJhaXQtc3ViLW5hdic6XHJcblx0XHRcdFx0dGFibGV0UG9ydHJhaXRTdWJOYXYoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdtb2JpbGUnOlxyXG5cdFx0XHRcdG1vYmlsZSgpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ21vYmlsZS1uYXYnOlxyXG5cdFx0XHRcdG1vYmlsZU5hdigpO1xyXG5cdFx0XHRicmVhaztcclxuXHJcblx0XHRcdGNhc2UgJ21vYmlsZS1zdWItbmF2JzpcclxuXHRcdFx0XHRtb2JpbGVTdWJOYXYoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdtb2JpbGUtc3ViLW5hdi1sMyc6XHJcblx0XHRcdFx0bW9iaWxlU3ViTmF2TDMoKTtcclxuXHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRjYXNlICdkZXNrdG9wJzpcclxuXHRcdFx0XHRkZXNrdG9wKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRkZXNrdG9wKCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG92ZXJsYXkoZmxhZyxvdmVybGF5RG9tLGlkKXsgLy9vdmVybGF5RG9tLCBvdmVybGF5Q29udGVudFxyXG5cdFx0XHRpZihmbGFnID09PSAnaGlkZScgKXtcclxuXHRcdFx0XHQkKCcub3ZlcmxheS1saWdodC1ib3gnKS5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZihmbGFnID09PSAnc2hvdycgKXtcclxuXHRcdFx0XHRpZigkKCcjJytpZCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdHZhciBvdmVybGF5RWxlID0gJCgnPGRpdj4nKVxyXG5cdFx0XHRcdFx0XHRcdFx0LmF0dHIoeydpZCc6aWQsICdjbGFzcyc6ICdvdmVybGF5LWxpZ2h0LWJveCd9KVxyXG5cdFx0XHRcdFx0XHRcdFx0LmNzcygnaGVpZ2h0JywgJCgnYm9keScpLmhlaWdodCgpKTtcclxuXHRcdFx0XHRcdCQob3ZlcmxheURvbSkuYmVmb3JlKG92ZXJsYXlFbGUpO1xyXG5cdFx0XHRcdFx0JChvdmVybGF5RWxlKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0b3ZlcmxheSgnaGlkZScpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cclxuXHJcblx0Ly9cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cclxuXHJcblxyXG5cdC8qXHJcblx0KiBJbml0aWFsaXNlIERlc2t0b3BcclxuXHQqL1xyXG5cdGZ1bmN0aW9uIGRlc2t0b3AoKSB7XHJcblxyXG5cclxuXHJcblx0XHQvL1NldCB1cCBHbG9iYWwgc3RhdGUgdmFyaWFibGUgdG8gRGVza3RvcFxyXG5cdFx0c3RhdGUgPSAnZGVza3RvcCc7XHJcblx0XHQvLyBTaG93IHNlZ21lbnQgYmFyXHJcblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ3NlZ21lbnQtdmlzaWJsZScpO1xyXG5cdFx0aGVhZGVySGVpZ2h0ID0gaGVpZ2h0cy5oZWFkZXIuZGVza3RvcCArIGhlaWdodHMuc2VnbWVudC5kZXNrdG9wO1xyXG5cdFx0Ly8gaWYgbmF2LWwyIGlzIG9wZW4gc2V0IGhlaWdodCBvZiBoZWFkZXIgYWNjb3JkaW5nbHlcclxuXHRcdGlmICgkKCcuZ2xvYmFsLWhlYWRlcicpLm91dGVySGVpZ2h0KCkgPiAxMjYgKSB7XHJcblx0XHRcdHZhciBvcGVuSXRlbSA9ICQoJy5nbG9iYWwtaGVhZGVyJykuZmluZCgnLm5hdi1sMi5zZWxlY3RlZCcpO1xyXG5cdFx0XHR2YXIgb3Blbkl0ZW1IZWlnaHQgPSBvcGVuSXRlbS5vdXRlckhlaWdodCgpO1xyXG5cclxuXHRcdFx0aGVhZGVySGVpZ2h0ICs9IG9wZW5JdGVtSGVpZ2h0O1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNldCB1cCBoZWlnaHQgb2YgdGhlIEhlYWRlclxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5jc3MoJ2hlaWdodCcsIGhlYWRlckhlaWdodCArJ3B4Jyk7XHJcblxyXG5cdFx0Ly8gQ2xlYXIgYW55IGh1bmcgb3ZlciBkeW5hbWljL2lubGluZSBzdHlsZXNcclxuXHRcdHJlc2V0U3R5bGVzKCk7XHJcblxyXG5cdFx0Ly9BcmlhIG5hdi1sMiB0byBoZWFkaW5nc1xyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLm5hdi1sMiA+IHVsID4gbGkgPiBhJykuYXR0cigncm9sZScsJ2hlYWRpbmcnKTtcclxuXHJcblx0XHQvL3Jlc2V0c1xyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYnKS5yZW1vdmVBdHRyKCdzdHlsZScpO1xyXG5cclxuXHRcdCQoJy51dGlsaXRpZXMgYSBzcGFuJykucmVtb3ZlQ2xhc3MoJ2FjY2VzcycpO1xyXG5cclxuXHRcdC8vIENyZWF0ZSBtb3JlIGJlZm9yZSBOYXZpZ2F0aW9uIGV2ZW50cyBhcmUgYm91bmRcclxuXHRcdG1vcmUoKTtcclxuXHJcblx0XHQvLyBuYXZpZ2F0aW9uXHJcblx0XHRuYXZpZ2F0aW9uKCk7XHJcblxyXG5cdFx0Ly8gc2VhcmNoXHJcblx0XHRzZWFyY2hCYXIoKTtcclxuXHR9XHJcblxyXG5cdC8vXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHJcblxyXG5cdC8qXHJcblx0KiBJbml0aWFsaXNlIG1pbmltaXNlZFxyXG5cdCovXHJcblx0ZnVuY3Rpb24gbWluaW1pc2VkKCkge1xyXG5cclxuXHJcblxyXG5cdFx0c3RhdGUgPSAnbWluaW1pc2VkJztcclxuXHJcblx0XHQvLyBDbGVhciBhbnkgaHVuZyBvdmVyIGR5bmFtaWMvaW5saW5lIHN0eWxlc1xyXG5cdFx0cmVzZXRTdHlsZXMoKTtcclxuXHJcblx0XHRjYWxjV2lkdGhNaW5pbWlzZWQoKTtcclxuXHJcblx0XHRoZWFkZXJIZWlnaHQgPSA1NDtcclxuXHJcblx0XHQvLyBpZiBuYXYtbDIgaXMgb3BlbiBzZXQgaGVpZ2h0IG9mIGhlYWRlciBhY2NvcmRpbmdseVxyXG5cdFx0aWYgKCQoJy5nbG9iYWwtaGVhZGVyJykub3V0ZXJIZWlnaHQoKSA+IDU0ICkge1xyXG5cclxuXHRcdFx0dmFyIG9wZW5JdGVtID0gJCgnLmdsb2JhbC1oZWFkZXInKS5maW5kKCcubmF2LWwyLnNlbGVjdGVkJyk7XHJcblx0XHRcdHZhciBvcGVuSXRlbUhlaWdodCA9IG9wZW5JdGVtLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHRoZWFkZXJIZWlnaHQgKz0gb3Blbkl0ZW1IZWlnaHQ7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gZWxzZSBzZXQgdG8gaGVpZ2h0IG9mIGhlYWRlckhlaWdodFxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5jc3MoJ2hlaWdodCcsIGhlYWRlckhlaWdodCArJ3B4Jyk7XHJcblxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdicpLmhpZGUoKS5zaG93KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRtb3JlKCk7XHJcblx0XHRcdG5hdmlnYXRpb24oKTtcclxuXHRcdFx0c2VhcmNoQmFyKCk7XHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdicpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Ly9Gb2N1cyBvdXRzaWRlIHNlYXJjaCBiYXIgb24gc2hpZnQgKyB0YWJcclxuXHJcblx0XHR2YXIgc2hpZnRUYWIgPSBmYWxzZTtcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2gtYmFyIGlucHV0Jykub24oe1xyXG5cdFx0XHRrZXlkb3duOmZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRpZigvOS8udGVzdChldmVudC53aGljaCkgJiYgZXZlbnQuc2hpZnRLZXkpIHsgLy8gU2hpZnQrVGFiXHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0Y2xvc2VTZWFyY2goKTtcclxuXHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5icmFuY2gtZmluZGVyIGEnKS5mb2N1cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR2YXIgbGFzdFNjcm9sbFRvcCA9IDAsXHJcblx0XHRsYXN0U3RhdGVDaGFuZ2UgPSAwLFxyXG5cdFx0c3QgPSAwO1xyXG5cclxuXHRmdW5jdGlvbiBpc1Njcm9sbFBvc05lYXJTdGF0ZUNoYW5nZShzY3JvbGxQb3MpIHtcclxuXHRcdHZhciBidWZmZXIgPSAyNTsgLy9weFxyXG5cdFx0cmV0dXJuIHNjcm9sbFBvcyA+IGxhc3RTdGF0ZUNoYW5nZSAtIGJ1ZmZlciAmJiBzY3JvbGxQb3MgPCBsYXN0U3RhdGVDaGFuZ2UgKyBidWZmZXI7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvblNjcm9sbENoYW5nZVN0YXRlKCkge1xyXG5cdFx0Ly9TdG9yaW5nIGlmIHNwYWNlIGtleWNvZGUgd2FzIHRyaWdnZXIgdG8gcHJldmVudCB0aGUgc2Nyb2xsIG9uIGhlYWRlciBhcGFydCBmcm9tIHdoZXJlIGl0IGlzIHJlcXVpcmVkLlxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0b3B0aW9ucy5jdXJyZW50RXZlbnQgPSBldmVudC53aGljaDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmKG9wdGlvbnMuY3VycmVudEV2ZW50ICE9PSAzMikgeyAvLyBOb3Qgc3BhY2VcclxuXHJcblx0XHRcdG92ZXJsYXkoJ2hpZGUnKTtcclxuXHRcdFx0Z2V0Vmlld3BvcnRFbGVtZW50KCkuc2Nyb2xsKCQuZGVib3VuY2UoZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdHZhciBpc01vcmVPcGVuID0gJCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2IGxpLm1vcmUnKS5oYXNDbGFzcygnb3BlbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoIWlzTW9yZU9wZW4gJiYgKHN0YXRlID09PSAnZGVza3RvcCcgfHwgc3RhdGUgPT09ICdtaW5pbWlzZWQnKSkge1xyXG5cclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gJ2Rlc2t0b3AnKSB7XHJcblx0XHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdicpLnNob3coKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c3QgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xyXG5cdFx0XHRcdHZhciBib3R0b20gPSAkKCdib2R5JykuaGVpZ2h0KCkgLSAkKHdpbmRvdykuaGVpZ2h0KCk7XHJcblx0XHRcdFx0aWYgKHN0ID4gNTAgJiYgLy8gNTBweCBidWZmZXIgYXQgdGhlIHRvcFxyXG5cdFx0XHRcdCAgIFx0c3QgPiBsYXN0U2Nyb2xsVG9wICYmIC8vIHNjcm9sbCBwb3NpdGlvbiBpcyBncmVhdGVyIHRoYW4gdGhlIGxhc3QgcG9zaXRpb25cclxuXHRcdFx0XHRcdCFpc1Njcm9sbFBvc05lYXJTdGF0ZUNoYW5nZShzdCkpIHsgLy8gc21hbGwgYnVmZmVyIHRvIHByZXZlbnQgZnJlcXVlbnQgc3RhdGUgY2hhbmdlc1xyXG5cdFx0XHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdzZWdtZW50LXZpc2libGUnKTtcclxuXHRcdFx0XHRcdGlmIChzdGF0ZSA9PT0gJ2Rlc2t0b3AnKSB7IC8vIHN0YXRlIGlzIGN1cnJlbnRseSBkZXNrdG9wXHJcblx0XHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdicpLnJlbW92ZUNsYXNzKCdtYWluLW5hdi1oaWRlJyk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gJ21pbmltaXNlZCc7XHJcblx0XHRcdFx0XHRcdGNoYW5nZVN0YXRlKHN0YXRlKTtcclxuXHRcdFx0XHRcdFx0b3ZlcmxheSgnaGlkZScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIGggPSBoZWlnaHRzLmhlYWRlcltzdGF0ZS5zcGxpdCgnLScpWzBdXTtcclxuXHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyJykuY3NzKCdoZWlnaHQnLCBoICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHRsYXN0U3RhdGVDaGFuZ2UgPSBzdDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHN0IDwgYm90dG9tICYmIC8vIHNjcm9sbCBwb3NpdGlvbiBpcyBsZXNzIHRoYW4gZG9jdW1lbnQgaGVpZ2h0XHJcblx0XHRcdFx0ICAgXHRzdCA8IGxhc3RTY3JvbGxUb3AgJiYgLy8gc2Nyb2xsIHBvc2l0aW9uIGlzIGxlc3MgdGhhbiBsYXN0IHBvc2l0aW9uXHJcblx0XHRcdFx0XHQhaXNTY3JvbGxQb3NOZWFyU3RhdGVDaGFuZ2Uoc3QpKSB7IC8vIHNtYWxsIGJ1ZmZlciB0byBwcmV2ZW50IGZyZXF1ZW50IHN0YXRlIGNoYW5nZXNcclxuXHRcdFx0XHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnc2VnbWVudC12aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRpZiAoc3RhdGUgPT09ICdtaW5pbWlzZWQnKSB7IC8vIHN0YXRlIGlzIGN1cnJlbnRseSBtaW5pbWlzZWRcclxuXHRcdFx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2Jykuc2hvdygpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdHN0YXRlID0gJ2Rlc2t0b3AnO1xyXG5cdFx0XHRcdFx0XHRjaGFuZ2VTdGF0ZShzdGF0ZSk7XHJcblx0XHRcdFx0XHRcdG92ZXJsYXkoJ2hpZGUnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHZhciBoID0gaGVpZ2h0cy5oZWFkZXJbc3RhdGUuc3BsaXQoJy0nKVswXV07XHJcblx0XHRcdFx0XHR2YXIgcyA9IGhlaWdodHMuc2VnbWVudFtzdGF0ZS5zcGxpdCgnLScpWzBdXTtcclxuXHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyJykuY3NzKCdoZWlnaHQnLCAoaCArIHMpICsgJ3B4Jyk7XHJcblx0XHRcdFx0XHRsYXN0U3RhdGVDaGFuZ2UgPSBzdDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGFzdFNjcm9sbFRvcCA9IHN0O1xyXG5cclxuXHRcdFx0fSwgMTAwKSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gb25TY3JvbGxTZWdtZW50QmFyKCkge1xyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlZ21lbnQtYm9keScpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRpZiAoKGV2ZW50LnRhcmdldC5zY3JvbGxMZWZ0ICsgZXZlbnQudGFyZ2V0LmNsaWVudFdpZHRoKSA9PT0gZXZlbnQudGFyZ2V0LnNjcm9sbFdpZHRoKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnc2VnbWVudC1ib2R5LXNjcm9sbGVuZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ3NlZ21lbnQtYm9keS1zY3JvbGxlbmQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBvblNjcm9sbE5hdigpIHtcclxuXHRcdCQoJy5uYXYtbDInKS5vbignc2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0aWYgKChldmVudC50YXJnZXQuc2Nyb2xsVG9wICsgZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodCkgPT09IGV2ZW50LnRhcmdldC5zY3JvbGxIZWlnaHQpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCduYXYtbDItc2Nyb2xsZW5kJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnbmF2LWwyLXNjcm9sbGVuZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHJcblxyXG5cclxuXHJcblx0ZnVuY3Rpb24gbmF2aWdhdGlvbigpe1xyXG5cclxuXHJcblx0XHQvL25vdGVzOlxyXG5cdFx0Ly8xKSBhdHRyaWJ1dGUgJ2RhdGEtbWVudXN0YXRlJyBpcyBzZXQgdG8gdHJ1ZSBvciBmYWxzZSBiYXNlZCBvbiB0aGUgbWVudSBkcm9wZG93biBpcyBvcGVuZGluZyBvciBjbG9zZWRcclxuXHRcdC8vMikgYXR0cmlidXJlICdkYXRhLWludGVyYWN0aW9uJyBpcyBzZXQgdG8gdHJ1ZSBvZiBmYWxzZSB0byBpZGVudGlmeSBpZiB0aGUgdXNlciBpcyBtb3VzZSB1c2VyIG9yIGEgcHVyZSBrZXlib3JhZCB1c2VyLlxyXG5cdFx0dmFyICRoZWFkZXIgPSAkKCcuZ2xvYmFsLWhlYWRlcicpO1xyXG5cdFx0dmFyICRtYWluTmF2ID0gJGhlYWRlci5maW5kKCcubWFpbi1uYXYnKTtcclxuXHRcdHZhciAkcHJpbWFyeU5hdiA9ICRtYWluTmF2LmZpbmQoJyA+IHVsID4gbGknKTtcclxuXHRcdHZhciAkc2Vjb25kYXJ5TmF2ID0gJG1haW5OYXYuZmluZCgnLm5hdi1sMicpO1xyXG5cdFx0dmFyICR0ZXJpdGFyeU5hdiA9ICRzZWNvbmRhcnlOYXYuZmluZCgnLm5hdi1sMyBsaScpO1xyXG5cdFx0dmFyIGRvbTtcclxuXHJcblx0XHQkaGVhZGVyLmF0dHIoJ2RhdGEtaW50ZXJhY3Rpb24nLCAnbW91c2UnKTtcclxuXHJcblx0XHQkaGVhZGVyLm9uKHtcclxuXHRcdFx0bW91c2VlbnRlcjogZnVuY3Rpb24oKXtcclxuXHJcblxyXG5cdFx0XHRcdC8vIEZvciAnbW9yZScgdGhpcyBjYW4gYmUgdHJpZ2dlcmVkIGJ5IHNjcm9sbCB3aGVuIHVzaW5nIHRhYiBuYXYgLVxyXG5cdFx0XHRcdC8vIERvIG5vdCB1cGRhdGUgZGF0YSBpbnRlcmFjdGlvbiBpbiB0aGlzIGNhc2VcclxuXHRcdFx0XHR2YXIgbW9yZU9wZW4gPSAkKCcubW9yZScsIHRoaXMpLmhhc0NsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHRcdGlmICghbW9yZU9wZW4pIHtcclxuXHRcdFx0XHRcdCRoZWFkZXIuYXR0cignZGF0YS1pbnRlcmFjdGlvbicsJ21vdXNlJyk7XHJcblx0XHRcdFx0XHQkaGVhZGVyLnJlbW92ZUNsYXNzKCdrZXlib2FyZCcpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGtleWRvd246IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRpZigvKDM4fDQwKS8udGVzdChldmVudC53aGljaCkpIHsgLy8gVXAvRG93biBhcnJvd1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGtleXVwOiBmdW5jdGlvbigpe1xyXG5cdFx0XHRcdCRoZWFkZXIuYXR0cignZGF0YS1pbnRlcmFjdGlvbicsJ2tleWJvYXJkJyk7XHJcblx0XHRcdFx0JGhlYWRlci5hZGRDbGFzcygna2V5Ym9hcmQnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdCRoZWFkZXIuZmluZCgnLmhlYWRlci1tYWluIC5oZWFkZXItY29udGFpbmVyJykub24oe1xyXG5cdFx0XHRmb2N1c2luOmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0aGlkZU5hdigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkbWFpbk5hdi5hdHRyKCdkYXRhLW1lbnVzdGF0ZScsJ2Nsb3NlZCcpO1xyXG5cclxuXHRcdCRtYWluTmF2Lm9uKHtcclxuXHRcdFx0bW91c2VsZWF2ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHQkKHRoaXMpLmZpbmQoJy5uYXYtbDInKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pLmZpbmQoJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHJcblxyXG5cdFx0XHRpZigkKHRoaXMpLmF0dHIoJ2hyZWYnKSA9PT0gJyMnKXtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHByaW1hcnlOYXYubm90KCcubW9yZScpLm9uKHtcclxuXHJcblx0XHRcdG1vdXNlZW50ZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG5cdFx0XHRcdGlmKCRoZWFkZXIuYXR0cignZGF0YS1pbnRlcmFjdGlvbicpID09PSAnbW91c2UnKXtcclxuXHRcdFx0XHRcdGRpc3BsYXlOYXYoJCh0aGlzKSk7XHJcblx0XHRcdFx0XHRpZiAoIShvcHRpb25zLmhhc1RvdWNoKSkge1xyXG5cdFx0XHRcdFx0XHRtZW51T3ZlcmxheSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5yZW1vdmVDbGFzcygnc2VhcmNoLW9wZW4nKTtcclxuXHJcblx0XHRcdFx0Y2xvc2VTZWFyY2goKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bW91c2VsZWF2ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRoaWRlTmF2KCdrZWVwT3ZlcmxheScpO1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dChvdmVybGF5RGVsYXkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRcdGlmKCRoZWFkZXIuYXR0cignZGF0YS1pbnRlcmFjdGlvbicpID09PSAna2V5Ym9hcmQnKXtcclxuXHJcblx0XHRcdFx0XHRpZigkbWFpbk5hdi5hdHRyKCdkYXRhLW1lbnVzdGF0ZScpID09PSAnY2xvc2VkJyl7XHJcblx0XHRcdFx0XHRcdGRpc3BsYXlOYXYoJCh0aGlzKSk7XHJcblx0XHRcdFx0XHRcdG1lbnVPdmVybGF5KCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRoaWRlTmF2KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigkaGVhZGVyLmF0dHIoJ2RhdGEtaW50ZXJhY3Rpb24nKSA9PT0gJ21vdXNlJyl7XHJcblx0XHRcdFx0XHRoaWRlTmF2KCdrZWVwT3ZlcmxheScpO1xyXG5cdFx0XHRcdFx0ZGlzcGxheU5hdigkKHRoaXMpKTtcclxuXHRcdFx0XHRcdGlmICghJCgnLm92ZXJsYXktbGlnaHQtYm94JykuaGFzQ2xhc3MoJ3Zpc2libGUnKSl7XHJcblx0XHRcdFx0XHRcdG1lbnVPdmVybGF5KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigkKHRoaXMpLmNoaWxkcmVuKCkubGVuZ3RoID09PSAxKXtcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LnNpYmxpbmdzKClcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpLnNpYmxpbmdzKCkuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0a2V5dXA6IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRpZigkaGVhZGVyLmhhc0NsYXNzKCcuc2VhcmNoLW9wZW4nKSl7XHJcblx0XHRcdFx0XHQkaGVhZGVyLmZpbmQoJy5zZWFyY2gtY2xvc2UnKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly9BUklBXHJcblx0XHRcdFx0aWYoJG1haW5OYXYuYXR0cignZGF0YS1tZW51c3RhdGUnKSA9PT0gJ29wZW4nKXtcclxuXHRcdFx0XHRcdCRoZWFkZXIuZmluZCgnLm5hdi1sMiwubmF2LWwzJykuYXR0cignYXJpYS1oaWRkZW4nLCdmYWxzZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQkc2Vjb25kYXJ5TmF2LmZpbmQoJz51bD5saScpLmF0dHIoJ2FyaWEtaGFzcG9wdXAnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0aWYoLzMyLy50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBTcGFjZVxyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdCQodGhpcykudHJpZ2dlcignY2xpY2snKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKC8yNy8udGVzdChldmVudC53aGljaCkpIHsgLy8gRXNjXHJcblx0XHRcdFx0XHRoaWRlTmF2KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigvOS8udGVzdChldmVudC53aGljaCkpIHsgLy8gVGFiXHJcblx0XHRcdFx0XHRkb20gPSAkKHRoaXMpLmZpbmQoJz5hJyk7XHJcblx0XHRcdFx0XHRmb2N1c01lbnUoKTtcclxuXHRcdFx0XHRcdGhpZGVOYXYoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBNb3JlXHJcblx0XHRcdFx0XHR2YXIgaW5NYWluTmF2ID0gJCh0aGlzKS5jbG9zZXN0KCcuaGVhZGVyLW5hdicpO1xyXG5cdFx0XHRcdFx0dmFyIGlzTW9yZSA9ICQodGhpcykuaGFzQ2xhc3MoJ21vcmUnKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoaW5NYWluTmF2Lmxlbmd0aCAmJiAhaXNNb3JlKSB7XHJcblx0XHRcdFx0XHRcdGhpZGVNb3JlTmF2aWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKC80MC8udGVzdChldmVudC53aGljaCkpIHsgLy8gRG93biBhcnJvd1xyXG5cdFx0XHRcdFx0ZG9tID0gJCh0aGlzKS5maW5kKCcubmF2LWwyID4gdWwgPiBsaTpmaXJzdC1jaGlsZCA+YScpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBBcnJvdyBrZXkgcmlnaHQgZm9yIG1haW4gbWVudVxyXG5cdFx0XHRcdGlmKC8zOS8udGVzdChldmVudC53aGljaCkpIHsgLy8gUmlnaHQgYXJyb3dcclxuXHRcdFx0XHRcdGlmKCQodGhpcykubmV4dCgpLmxlbmd0aCA9PT0gMSApe1xyXG5cdFx0XHRcdFx0XHRkb20gPSAkKHRoaXMpLm5leHQoKS5maW5kKCc+YScpO1xyXG5cdFx0XHRcdFx0XHRmb2N1c01lbnUoKTtcclxuXHRcdFx0XHRcdFx0aGlkZU5hdigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gQXJyb3cga2V5IGxlZnQgZm9yIG1haW4gbWVudVxyXG5cdFx0XHRcdGlmKC8zNy8udGVzdChldmVudC53aGljaCkpIHsgLy8gTGVmdCBhcnJvd1xyXG5cdFx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRpZigkKHRoaXMpLnByZXYoKS5sZW5ndGggPT09IDEpe1xyXG5cdFx0XHRcdFx0XHRkb20gPSAkKHRoaXMpLnByZXYoKS5maW5kKCc+YScpO1xyXG5cdFx0XHRcdFx0XHRmb2N1c01lbnUoKTtcclxuXHRcdFx0XHRcdFx0aGlkZU5hdigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoLzM4Ly50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBVcCBhcnJvd1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKCQoJy5nbG9iYWwtaGVhZGVyJykuaGFzQ2xhc3MoJ3NlYXJjaC1vcGVuJykpe1xyXG5cdFx0XHRcdFx0Y2xvc2VTZWFyY2goKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRmb2N1c291dDogZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQob3ZlcmxheURlbGF5KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dmFyIG92ZXJsYXlEZWxheTtcclxuXHJcblx0XHRmdW5jdGlvbiBtZW51T3ZlcmxheSgpe1xyXG5cdFx0XHRpZiAoISQoJy5vdmVybGF5LWxpZ2h0LWJveCcpLmhhc0NsYXNzKCd2aXNpYmxlJykpIHtcclxuXHRcdFx0XHRvdmVybGF5RGVsYXkgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0b3ZlcmxheSgnc2hvdycsICcuZ2xvYmFsLWhlYWRlcicpO1xyXG5cdFx0XHRcdFx0JCgnLm92ZXJsYXktbGlnaHQtYm94Jykuc2hvdygpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdFx0fSwgMjUwKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5tYWluLW5hdiA+IHVsJykub24oe1xyXG5cdFx0XHRtb3VzZWxlYXZlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRcdG92ZXJsYXkoJ2hpZGUnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHNlY29uZGFyeU5hdi5maW5kKCdsaScpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0dmFyIGlzTmF2bDNQcmVzZW50ID0gJChldmVudC50YXJnZXQpLm5leHQoKS5oYXNDbGFzcygnbmF2LWwzJyk7XHJcblx0XHRcdHZhciBhY3RpdmVQcmltYXJ5TmF2ID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5uYXYtbDInKS5wYXJlbnQoKTtcclxuXHRcdFx0dmFyIGNsb3Nlc2V0TmF2TDMgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm5hdi1sMycpO1xyXG5cdFx0XHR2YXIgbmV4dE1lbnVJdGVtID0gJChldmVudC50YXJnZXQpLnBhcmVudCgpLm5leHQoKTtcclxuXHRcdFx0dmFyIGNsb3Nlc2V0TmF2TDIgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm5hdi1sMiA+IHVsID4gbGknKTtcclxuXHRcdFx0dmFyIHJlbGF0ZWRQcmltYXJ5TmF2ID0gJChldmVudC50YXJnZXQpLm9mZnNldFBhcmVudCgpLnBhcmVudCgpO1xyXG5cclxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHQvL29uIHByZXNzaW5nIGVzYyBrZXkgaW4gYmV0d2VlbiBuYXZpYXRpb25cclxuXHRcdFx0aWYoLzI3Ly50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBFc2NcclxuXHRcdFx0XHRoaWRlTmF2KCk7XHJcblx0XHRcdFx0YWN0aXZlUHJpbWFyeU5hdi5maW5kKCc+YScpLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vb24ga2V5Ym9yZCBkb3duIGFycm93XHJcblx0XHRcdGlmKC80MC8udGVzdChldmVudC53aGljaCkpIHsgLy8gRG93biBhcnJvd1xyXG5cdFx0XHRcdGlmKGlzTmF2bDNQcmVzZW50KXtcclxuXHRcdFx0XHRcdC8vIHNlY29uZGFyeSBtZW51XHJcblx0XHRcdFx0XHRkb20gPSAkKGV2ZW50LnRhcmdldCkubmV4dCgpLmZpbmQoJ2xpOmZpcnN0LWNoaWxkIGEnKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIHRlcml0YXJ5IG1lbnVcclxuXHRcdFx0XHRcdGlmKG5leHRNZW51SXRlbS5sZW5ndGggPT09IDEpe1xyXG5cdFx0XHRcdFx0XHRkb20gPSBuZXh0TWVudUl0ZW0uZmluZCgnYScpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZihuZXh0TWVudUl0ZW0ubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdFx0aWYoY2xvc2VzZXROYXZMMi5uZXh0KCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRkb20gPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm5hdi1sMicpLnBhcmVudCgpLm5leHQoKS5maW5kKCc+YScpO1xyXG5cdFx0XHRcdFx0XHRcdGhpZGVOYXYoKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRkb20gPSBjbG9zZXNldE5hdkwyLm5leHQoKS5maW5kKCc+YScpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL29uIGtleWJvcmQgdXAgYXJyb3dcclxuXHRcdFx0ZWxzZSBpZigvMzgvLnRlc3QoZXZlbnQud2hpY2gpKSB7IC8vIFVwIGFycm93XHJcblx0XHRcdFx0dmFyIHByZXZNZW51SXRlbSA9ICQoZXZlbnQudGFyZ2V0KS5wYXJlbnQoKS5wcmV2KCk7XHJcblx0XHRcdFx0aWYoaXNOYXZsM1ByZXNlbnQpe1xyXG5cdFx0XHRcdFx0Ly8gc2Vjb25kYXJ5IG1lbnVcclxuXHRcdFx0XHRcdGlmKCQoZXZlbnQudGFyZ2V0KS5wYXJlbnQoKS5wcmV2KCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdFx0ZG9tID0gcmVsYXRlZFByaW1hcnlOYXYuZmluZCgnPiBhJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRkb20gPSAkKGV2ZW50LnRhcmdldCkucGFyZW50KCkucHJldigpLmZpbmQoJyBsaTpsYXN0LWNoaWxkIGEnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQvLyB0ZXJpdGFyeSBtZW51XHJcblx0XHRcdFx0XHRpZihwcmV2TWVudUl0ZW0ubGVuZ3RoID09PSAxKXtcclxuXHRcdFx0XHRcdFx0ZG9tID0gcHJldk1lbnVJdGVtLmZpbmQoJ2EnKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZihwcmV2TWVudUl0ZW0ubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdFx0ZG9tID0gY2xvc2VzZXROYXZMMy5wcmV2KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdGRvbSA9ICQoZXZlbnQudGFyZ2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gc2Vjb25kYXJ5IG5hdiBob3Jpem9uYWwga2V5Ym9hcmQgbmF2aWdhdGlvblxyXG5cdFx0XHRpZigvMzkvLnRlc3QoZXZlbnQud2hpY2gpKSB7IC8vIFJpZ2h0IGFycm93XHJcblx0XHRcdFx0aWYoY2xvc2VzZXROYXZMMi5uZXh0KCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdGRvbSA9IHJlbGF0ZWRQcmltYXJ5TmF2LmZpbmQoJz4gYScpO1xyXG5cdFx0XHRcdH0gZWxzZXtcclxuXHRcdFx0XHRcdGRvbSA9IGNsb3Nlc2V0TmF2TDIubmV4dCgpLmZpbmQoJz5hJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZigvMzcvLnRlc3QoZXZlbnQud2hpY2gpKSB7IC8vIExlZnQgYXJyb3dcclxuXHRcdFx0XHRpZihjbG9zZXNldE5hdkwyLnByZXYoKS5sZW5ndGggPT09IDApe1xyXG5cdFx0XHRcdFx0ZG9tID0gcmVsYXRlZFByaW1hcnlOYXYuZmluZCgnPiBhJyk7XHJcblx0XHRcdFx0fSBlbHNle1xyXG5cdFx0XHRcdFx0ZG9tID0gY2xvc2VzZXROYXZMMi5wcmV2KCkuZmluZCgnPmEnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoZXZlbnQud2hpY2ggIT09IDI3KSB7IC8vIEVzY1xyXG5cdFx0XHRcdGRvbS5mb2N1cygpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQkc2Vjb25kYXJ5TmF2LmZpbmQoJz4gdWwgPiBsaSA+IGEnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkdGVyaXRhcnlOYXYub24oe1xyXG5cclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHR2YXIgYWN0aXZlUHJpbWFyeU5hdiA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcubmF2LWwyJykucGFyZW50KCk7XHJcblxyXG5cdFx0XHRcdC8vIENsZWFyIGFsbCBhY3RpdmUgc3RhdGVzIGZyb20gaXRlbXMgYnV0IE5PVCB0aG9zZSBpbiB0aGUgaGlkZGVuICdtb3JlJyBuYXZpZ2F0aW9uXHJcblx0XHRcdFx0JGhlYWRlci5maW5kKCcuaGVhZGVyLW5hdiAubWFpbi1uYXYgPiB1bCA+IGxpOm5vdCgubW9yZS1pdGVtKScpXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHQkaGVhZGVyLmZpbmQoJy5oZWFkZXItbmF2IC5tYWluLW5hdiA+IHVsID4gbGk6bm90KC5tb3JlLWl0ZW0pIC5uYXYtbDMgbGknKVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0LmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0JGhlYWRlci5maW5kKCcuaGVhZGVyLW1vcmUgLm1haW4tbmF2IGxpJylcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdC5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0XHRcdC8vIEFkZCBhY3RpdmUgc3RhdGVzXHJcblx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KCdsaScpXHJcblx0XHRcdFx0XHRcdC5hZGRDbGFzcygnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0LmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpO1xyXG5cclxuXHRcdFx0XHQvLyBsMiBoZWFkZXJzIG5lZWQgdG8gYmUgc2V0IHRvIGFjdGl2ZSBmb3IgbW9iaWxlIHN0YXRlXHJcblx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KCcubmF2LWwzJykuY2xvc2VzdCgnbGknKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdCQodGhpcykub2Zmc2V0UGFyZW50KCkucGFyZW50KClcclxuXHRcdFx0XHRcdFx0LmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAndHJ1ZScpXHJcblx0XHRcdFx0XHRcdC5zaWJsaW5ncygpLmF0dHIoJ2FyaWEtc2VsZWN0ZWQnLCAnZmFsc2UnKTtcclxuXHJcblx0XHRcdFx0JCh0aGlzKS5vZmZzZXRQYXJlbnQoKS5wYXJlbnQoKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHRoaWRlTmF2KCk7XHJcblxyXG5cdFx0XHRcdGFjdGl2ZVByaW1hcnlOYXYuZmluZCgnPmEnKS5mb2N1cygpO1xyXG5cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGtleWRvd246IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHR2YXIgYWN0aXZlUHJpbWFyeU5hdiA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCcubmF2LWwyJykucGFyZW50KCk7XHJcblx0XHRcdFx0dmFyIGNsb3Nlc2V0TmF2TDMgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCgnLm5hdi1sMycpO1xyXG5cdFx0XHRcdHZhciBuZXh0UHJpbWFyeU5hdiA9IGFjdGl2ZVByaW1hcnlOYXYubmV4dCgpO1xyXG5cdFx0XHRcdC8vdGFiYmluZ1xyXG5cdFx0XHRcdGlmKC85Ly50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBUYWJcclxuXHRcdFx0XHRcdGlmKG5leHRQcmltYXJ5TmF2Lmxlbmd0aCA9PT0gMCl7XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0U2V0b2ZtZW51ID0gY2xvc2VzZXROYXZMMy5wYXJlbnQoKTtcclxuXHRcdFx0XHRcdFx0aWYobmV4dFNldG9mbWVudS5sZW5ndGggPT09IDEgJiYgbmV4dFNldG9mbWVudS5uZXh0KCkubGVuZ3RoID09PSAwKXtcclxuXHRcdFx0XHRcdFx0XHRoaWRlTmF2KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGZvY3VzTWVudSgpe1xyXG5cdFx0XHRkb20uZm9jdXMoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBkaXNwbGF5TmF2KG5hdkl0ZW0pIHtcclxuXHJcblx0XHRcdHZhciBuYXZIZWlnaHQ7XHJcblxyXG5cdFx0XHRuYXZJdGVtLmZpbmQoJy5uYXYtbDInKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuXHJcblx0XHRcdG5hdkhlaWdodCA9IG5hdkl0ZW0uZmluZCgnLm5hdi1sMicpLm91dGVySGVpZ2h0KCk7XHJcblxyXG5cdFx0XHQvLyBDaGVjayBmb3IgJ01vcmUnIGJlaW5nIG9wZW5lZFxyXG5cdFx0XHR2YXIgbW9yZU9wZW4gPSAkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW1vcmUnKS5oYXNDbGFzcygnb3BlbicpO1xyXG5cdFx0XHR2YXIgbW9yZUhlaWdodCA9IDU0O1xyXG5cclxuXHRcdFx0aWYgKHN0YXRlID09PSAnbWluaW1pc2VkJykge1xyXG5cclxuXHRcdFx0XHRpZiAobW9yZU9wZW4pIHtcclxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCA9IDU0ICsgbW9yZUhlaWdodDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gNTQ7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Rlc2t0b3AnKSB7XHJcblxyXG5cdFx0XHRcdGlmIChtb3JlT3Blbikge1xyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMTI2ICsgbW9yZUhlaWdodDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMTI2O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5jc3MoJ2hlaWdodCcsIGhlYWRlckhlaWdodCtuYXZIZWlnaHQgKyAncHgnKTtcclxuXHJcblx0XHRcdG5hdkl0ZW0uZmluZCgnLm5hdi1sMicpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cclxuXHRcdFx0JG1haW5OYXYuYXR0cignZGF0YS1tZW51c3RhdGUnLCdvcGVuZWQnKTtcclxuXHRcdFx0Ly9hcmlhXHJcblx0XHRcdG5hdkl0ZW0uZmluZCgnLm5hdi1sMiwubmF2LWwzJykuYXR0cignYXJpYS1oaWRkZW4nLCdmYWxzZScpO1xyXG5cdFx0XHRuYXZJdGVtLmZpbmQoJz5hJykuYXR0cignYXJpYS1leHBhbmRlZCcsJ3RydWUnKVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGhpZGVOYXYob3ZlcmxheVN0YXRlKSB7XHJcblxyXG5cdFx0XHRpZigkbWFpbk5hdi5hdHRyKCdkYXRhLW1lbnVzdGF0ZScpID09PSAnb3BlbmVkJyl7XHJcblxyXG5cdFx0XHRcdGlmKG92ZXJsYXlTdGF0ZSAhPT0na2VlcE92ZXJsYXknKXtcclxuXHRcdFx0XHRcdG92ZXJsYXkoJ2hpZGUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCRzZWNvbmRhcnlOYXYuaGlkZSgpO1xyXG5cdFx0XHRcdCRtYWluTmF2LmZpbmQoJz51bD5saT5hJykuYXR0cignYXJpYS1leHBhbmRlZCcsJ2ZhbHNlJyk7XHJcblx0XHRcdFx0JGhlYWRlci5maW5kKCcubmF2LWwyLC5uYXYtbDMnKS5hdHRyKCdhcmlhLWhpZGRlbicsJ3RydWUnKTtcclxuXHRcdFx0XHQkaGVhZGVyLmZpbmQoJy5uYXYtbDInKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkbWFpbk5hdi5hdHRyKCdkYXRhLW1lbnVzdGF0ZScsICdjbG9zZWQnKTtcclxuXHJcblx0XHRcdFx0aWYgKHN0YXRlID09PSAnbWluaW1pc2VkJykge1xyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gNTQ7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChzdGF0ZSA9PT0gJ2Rlc2t0b3AnKSB7XHJcblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAxMjY7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkaGVhZGVyLmNzcygnaGVpZ2h0JywgaGVhZGVySGVpZ2h0ICsgJ3B4Jyk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cclxuXHQvLyAtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVxyXG5cclxuXHQvKlxyXG5cdCogSW5pdGlhbGlzZSBUYWJsZXQgUG9ydHJhaXRcclxuXHQqL1xyXG5cdGZ1bmN0aW9uIHRhYmxldFBvcnRyYWl0KCkge1xyXG5cclxuXHJcblxyXG5cdFx0c3RhdGUgPSAndGFibGV0LXBvcnRyYWl0JztcclxuXHJcblx0XHQvLyBTZXQgdXAgaGVpZ2h0IG9mIHRoZSBIZWFkZXJcclxuXHRcdGhlYWRlckhlaWdodCA9IGhlaWdodHMuaGVhZGVyLnRhYmxldCArIGhlaWdodHMuc2VnbWVudC50YWJsZXQ7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5jc3MoJ2hlaWdodCcsIGhlYWRlckhlaWdodCArJ3B4Jyk7XHJcblxyXG5cdFx0Ly8gQ2xlYXIvUmVzZXQgYW55IG9wZW4gc3RhdGVzXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAubWFpbi1uYXYgbGknKS5yZW1vdmVDbGFzcygnb3BlbicpO1xyXG5cdFx0JCgnLnV0aWxpdGllcyBhIHNwYW4nKS5yZW1vdmVDbGFzcygnYWNjZXNzJyk7XHJcblxyXG5cdFx0Ly8gQ2xlYXIgYW55IGh1bmcgb3ZlciBkeW5hbWljL2lubGluZSBzdHlsZXNcclxuXHRcdHJlc2V0U3R5bGVzKCk7XHJcblxyXG5cdFx0Ly8gSWYgY2xvc2UgaXMgcHJlc2VudCByZXNldCB0byBtZW51XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuY2xvc2Ugc3BhbicpLnRleHQoJ01lbnUnKTtcclxuXHJcblx0XHQvL2RvY3VtZW50Lm9udG91Y2htb3ZlID0gZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHQvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Ly99XHJcblxyXG5cdFx0c3dhcENsYXNzKCdjbG9zZScsICdoYW1idXJnZXInKTtcclxuXHJcblx0XHRhZGRNZW51QnV0dG9uRXZlbnQoKTtcclxuXHJcblx0XHRoYXNUb3VjaCgpO1xyXG5cclxuXHRcdHNlYXJjaEJhck1vYmlsZSgpO1xyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIEluaXRpYWxpc2UgVGFibGV0IFBvcnRyYWl0IE5hdlxyXG5cdCovXHJcblx0ZnVuY3Rpb24gdGFibGV0UG9ydHJhaXROYXYoKSB7XHJcblxyXG5cdFx0dmFyIHdpbmRvd0hlaWdodCA9IGdldFZpZXdwb3J0RWxlbWVudCgpLmhlaWdodCgpO1xyXG5cclxuXHRcdHN0YXRlID0gJ3RhYmxldC1wb3J0cmFpdC1uYXYnO1xyXG5cclxuXHRcdC8vRGlzYWJsZSBwYWdlIHNjcm9sbCBvbiBtZW51IG9wZW5cclxuXHRcdCQoJ2h0bWwnKS5jc3MoJ292ZXJmbG93JywnaGlkZGVuJyk7XHJcblxyXG5cdFx0Ly8gLy9EaXNhYmxlIHBhZ2Ugc2Nyb2xsIG9uIG1lbnUgb3BlbiBmb3IgdG91Y2ggZGV2aWNlc1xyXG5cdFx0Ly8gZG9jdW1lbnQub250b3VjaG1vdmUgPSBmdW5jdGlvbihldmVudCl7XHJcblx0XHQvLyBcdCBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHJcblx0XHQvLyBDbGVhci9SZXNldCBhbnkgb3BlbiBzdGF0ZXNcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5tYWluLW5hdiBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8vIFVwZGF0ZSB0aGUgTWVudSB0byBDbG9zZVxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oYW1idXJnZXIgc3BhbicpLnRleHQoJ0Nsb3NlJyk7XHJcblxyXG5cdFx0c3dhcENsYXNzKCdoYW1idXJnZXInLCAnY2xvc2UnKTtcclxuXHJcblx0XHRhZGRDbG9zZUJ1dHRvbkV2ZW50KCk7XHJcblxyXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdC8vSW5pdCBhY3RpdmUgTmF2SXRlbSB0byBvcGVuXHJcblx0XHR2YXIgZmlyc3ROYXZJdGVtID0gJCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2IGE6Zmlyc3QnKSxcclxuXHRcdFx0YWN0aXZlTmF2SXRlbSA9ICQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaS5hY3RpdmUnKSxcclxuXHRcdFx0aXNBY3RpdmUgPSAkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgYScpLmNsb3Nlc3QoJ2xpJykuaGFzQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2JykuY3NzKCdtaW4taGVpZ2h0Jywgd2luZG93SGVpZ2h0KTtcclxuXHJcblx0XHR2YXIgaW52U2VnbWVudEhlaWdodCA9ICQoJ2JvZHknKS5oYXNDbGFzcygnc2VnbWVudC12aXNpYmxlJykgPyAwIDogaGVpZ2h0cy5zZWdtZW50LnRhYmxldDtcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5uYXYtbDInKS5jc3MoJ2hlaWdodCcsIHdpbmRvd0hlaWdodCAtaGVhZGVySGVpZ2h0ICsgaW52U2VnbWVudEhlaWdodCArIDUwKTtcclxuXHRcdC8vYWxlcnQod2luZG93SGVpZ2h0KycgJytoZWFkZXJIZWlnaHQrJyAnK2ludlNlZ21lbnRIZWlnaHQpO1xyXG5cclxuXHRcdC8vIE5vIEwxIGl0ZW0gY3VycmVudGx5IGFjdGl2ZVxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2IGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZSBvcGVuJyk7XHJcblxyXG5cclxuXHRcdC8vIE5hdmlnYXRpb24gTDFcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiA+IHVsID4gbGkgPiBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcclxuXHJcblx0XHRcdGNoYW5nZU1haW5OYXZGb3JtYXQoJCh0aGlzKSk7XHJcblxyXG5cclxuXHRcdFx0Ly8gQ2xlYXIvUmVzZXQgYW55IG9wZW4gc3RhdGVzXHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0aGlzIGlzIGEgY2xpY2sgd2UgZXhwZWN0IHRvIGJlIGhhbmRsZWRcclxuXHRcdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRcdGlmIChocmVmID09PSAnIycgfHwgaHJlZiA9PT0gdW5kZWZpbmVkKSB7XHJcblxyXG5cdFx0XHRcdHNldEFjdGl2ZU9wZW4odGhpcywgJ2FjdGl2ZSBvcGVuJyk7XHJcblxyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8vIHVwZGF0ZSBuYXZpZ2F0aW9uIChMMikgd2hlbiBvbiBzY3JvbGxcclxuXHRcdG9uU2Nyb2xsTmF2KCk7XHJcblxyXG5cclxuXHRcdC8vIE5hdmlnYXRpb24gTDNcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiAubmF2LWwzIGxpJykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7XHJcblxyXG5cdFx0XHQkKCcuZ2xvYmFsLWhlYWRlcicpLmZpbmQoJy5uYXYtbDMgbGknKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdCQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpXHJcblx0XHRcdFx0XHQuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHQkKHRoaXMpLm9mZnNldFBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0Ly9jbG9zZSBtZW51XHJcblx0XHRcdGNoYW5nZVN0YXRlKCd0YWJsZXQtcG9ydHJhaXQnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1RvdWNoKCk7XHJcblxyXG5cdFx0c2VhcmNoQmFyTW9iaWxlKCk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogSW5pdGlhbGlzZSBUYWJsZXQgUG9ydHJhaXQgU3ViIE5hdlxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIHRhYmxldFBvcnRyYWl0U3ViTmF2KCkge1xyXG5cclxuXHJcblxyXG5cdFx0c3RhdGUgPSAndGFibGV0LXBvcnRyYWl0LXN1Yi1uYXYnO1xyXG5cclxuXHRcdGFkZENsb3NlQnV0dG9uRXZlbnQoKTtcclxuXHRcdGhhc1RvdWNoKCk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly9cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cclxuXHJcblx0LypcclxuXHQqIEluaXRpYWxpc2UgTW9iaWxlXHJcblx0Ki9cclxuXHJcblx0ZnVuY3Rpb24gbW9iaWxlKCkge1xyXG5cclxuXHJcblxyXG5cdFx0Ly9TZXQgdXAgR2xvYmFsIHN0YXRlIHZhcmlhYmxlIHRvIE1vYmlsZVxyXG5cdFx0c3RhdGUgPSAnbW9iaWxlJztcclxuXHJcblx0XHQvLyBTZXQgdXAgaGVpZ2h0IG9mIHRoZSBIZWFkZXJcclxuXHRcdGhlYWRlckhlaWdodCA9IGhlaWdodHMuaGVhZGVyLm1vYmlsZSArIGhlaWdodHMuc2VnbWVudC5tb2JpbGU7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlcicpLmNzcygnaGVpZ2h0JywgaGVhZGVySGVpZ2h0ICsncHgnKTtcclxuXHJcblx0XHQvLyBDbGVhci9SZXNldCBhbnkgb3BlbiBzdGF0ZXNcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0Ly9BcmVhXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgLm5hdi1sMicpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiAubmF2LWwzJykuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuXHRcdC8vIENsZWFyIGFueSBodW5nIG92ZXIgZHluYW1pYy9pbmxpbmUgc3R5bGVzXHJcblx0XHRyZXNldFN0eWxlcygpO1xyXG5cclxuXHRcdC8vIElmIGNsb3NlIGlzIHByZXNlbnQgcmVzZXQgdG8gaGFuYnVyZ2VyXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuY2xvc2Ugc3BhbicpLnRleHQoJ01lbnUnKTtcclxuXHRcdC8vICQoJy51dGlsaXRpZXMgYSBzcGFuJykuYWRkQ2xhc3MoJ2FjY2VzcycpOyBSZW1vdmUgY29tbWVudHMgaWYgeW91IHdhbnQgdG8gaGlkZSB0aGUgdGhlIGxhYmVsIHRleHQgZm9yIGljb25zIGluIHRoZSBtb2JpbGUgc3RhdGVcclxuXHJcblx0XHRzd2FwQ2xhc3MoJ2Nsb3NlJywgJ2hhbWJ1cmdlcicpO1xyXG5cclxuXHRcdGFkZE1lbnVCdXR0b25FdmVudCgpO1xyXG5cclxuXHRcdGhhc1RvdWNoKCk7XHJcblxyXG5cdFx0c2VhcmNoQmFyTW9iaWxlKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIEluaXRpYWxpc2UgTW9iaWxlIE5hdlxyXG5cdCovXHJcblx0ZnVuY3Rpb24gbW9iaWxlTmF2KCkge1xyXG5cclxuXHJcblxyXG5cdFx0c3RhdGUgPSAnbW9iaWxlLW5hdic7XHJcblxyXG5cdFx0Ly8gQWRkIGR5bmFubWljIGhlaWdodHNcclxuXHRcdHNldEhlaWdodCgnLmhlYWRlci1uYXYnLCA0OCk7XHJcblxyXG5cdFx0Ly9EaXNhYmxlIHBhZ2Ugc2Nyb2xsIG9uIG1lbnUgb3BlblxyXG5cdFx0JCgnaHRtbCcpLmNzcygnb3ZlcmZsb3cnLCdoaWRkZW4nKTtcclxuXHJcblx0XHQvLyBDbGVhci9SZXNldCBhbnkgb3BlbiBzdGF0ZXNcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0Ly8gQXJpYVxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2IC5uYXYtbDInKS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgLm5hdi1sMycpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcblx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0Ly8gVXBkYXRlIHRoZSBNZW51IHRvIENsb3NlXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhhbWJ1cmdlciBzcGFuJykudGV4dCgnQ2xvc2UnKTtcclxuXHJcblx0XHRzd2FwQ2xhc3MoJ2hhbWJ1cmdlcicsICdjbG9zZScpO1xyXG5cclxuXHRcdGFkZENsb3NlQnV0dG9uRXZlbnQoKTtcclxuXHJcblx0XHQvLyBOYXZpZ2F0aW9uXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCl7XHJcblx0XHRcdC8vIENoZWNrIHRoaXMgaXMgYSBjbGljayB3ZSBleHBlY3QgdG8gYmUgaGFuZGxlZFxyXG5cdFx0XHR2YXIgaHJlZiA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cclxuXHRcdFx0aWYgKGhyZWYgPT09ICcjJyB8fCBocmVmID09PSB1bmRlZmluZWQpIHtcclxuXHJcblx0XHRcdFx0Y2hhbmdlU3RhdGUoJ21vYmlsZS1zdWItbmF2Jyk7XHJcblxyXG5cdFx0XHRcdHNldEFjdGl2ZU9wZW4odGhpcywgJ2FjdGl2ZSBvcGVuJyk7XHJcblxyXG5cdFx0XHRcdC8vQXJpYVxyXG5cdFx0XHRcdHNldEFyaWFTdGF0ZXMoJCh0aGlzKSk7XHJcblxyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aGFzVG91Y2goKTtcclxuXHJcblx0XHRzZWFyY2hCYXJNb2JpbGUoKTtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBJbml0aWFsaXNlIE1vYmlsZSBTdWIgTmF2XHJcblx0Ki9cclxuXHRmdW5jdGlvbiBtb2JpbGVTdWJOYXYoKSB7XHJcblxyXG5cclxuXHJcblx0XHRzdGF0ZSA9ICdtb2JpbGUtc3ViLW5hdic7XHJcblxyXG5cdFx0YWRkQ2xvc2VCdXR0b25FdmVudCgpO1xyXG5cclxuXHRcdGFkZEJhY2tCdXR0b25FdmVudCgnbW9iaWxlLW5hdicpO1xyXG5cclxuXHJcblx0XHQvLyBDbGVhciBhbnkgb3BlbiBzdGF0ZXMgaW4gbDIgc3VibWVudSdzXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgLm5hdi1sMiBsaScpLnJlbW92ZUNsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0Ly8gSW5pdCBNZW51IE5hdlxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcclxuXHJcblx0XHRcdHZhciBpc0JhY2tMaW5rID0gJCh0aGlzKS5wYXJlbnQoKS5hdHRyKCdkYXRhLWNvbXBvbmVudC10eXBlJykgPT09ICdNZW51SXRlbUxldmVsMSc7XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0aGlzIGlzIGEgY2xpY2sgd2UgZXhwZWN0IHRvIGJlIGhhbmRsZWRcclxuXHRcdFx0dmFyIGhyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcclxuXHJcblx0XHRcdC8vIElzIHRoZSBhbmNob3IgdGhlIHJlcG9ycG9zZWQgdHlwZSBhcyBzdWIgbmF2IGhlYWRlcj9cclxuXHRcdFx0dmFyIGhlYWRlciA9ICQodGhpcykucGFyZW50KCdsaScpLmhhc0NsYXNzKCdvcGVuJyk7XHJcblxyXG5cdFx0XHRpZiAoaXNCYWNrTGluaykge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0Y2hhbmdlU3RhdGUoJ21vYmlsZS1uYXYnKTtcclxuXHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAubWFpbi1uYXYgLm5hdi1sMywgLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IC5uYXYtbDInKVxyXG5cdFx0XHRcdFx0LmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHRcdFx0fSBlbHNlIGlmIChoZWFkZXIpIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGhyZWYgPT09ICcjJyB8fCBocmVmID09PSB1bmRlZmluZWQpIHtcclxuXHJcblx0XHRcdFx0Y2hhbmdlU3RhdGUoJ21vYmlsZS1zdWItbmF2LWwzJyk7XHJcblxyXG5cdFx0XHRcdHNldEFjdGl2ZU9wZW4odGhpcywgJ2FjdGl2ZSBvcGVuJyk7XHJcblxyXG5cdFx0XHRcdC8vQXJpYVxyXG5cdFx0XHRcdHNldEFyaWFTdGF0ZXMoJCh0aGlzKSk7XHJcblxyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aGFzVG91Y2goKTtcclxuXHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogSW5pdGlhbGlzZSBNb2JpbGUgU3ViIE5hdiAtIGwzXHJcblx0Ki9cclxuXHRmdW5jdGlvbiBtb2JpbGVTdWJOYXZMMygpIHtcclxuXHJcblxyXG5cclxuXHRcdHN0YXRlID0gJ21vYmlsZS1zdWItbmF2LWwzJztcclxuXHJcblx0XHRhZGRDbG9zZUJ1dHRvbkV2ZW50KCk7XHJcblxyXG5cdFx0YWRkQmFja0J1dHRvbkV2ZW50KCdtb2JpbGUtc3ViLW5hdicpO1xyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KXtcclxuXHJcblx0XHRcdHZhciBpc0JhY2tMaW5rID0gJCh0aGlzKS5wYXJlbnQoKS5hdHRyKCdkYXRhLWNvbXBvbmVudC10eXBlJykgPT09ICdNZW51SXRlbUxldmVsMic7XHJcblxyXG5cdFx0XHQvLyBJcyB0aGUgYW5jaG9yIHRoZSByZXBvcnBvc2VkIHR5cGUgYXMgc3ViIG5hdiBoZWFkZXI/XHJcblx0XHRcdHZhciBoZWFkZXIgPSAkKHRoaXMpLnBhcmVudCgnbGknKS5oYXNDbGFzcygnb3BlbicpO1xyXG5cclxuXHRcdFx0aWYgKGlzQmFja0xpbmspIHtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGNoYW5nZVN0YXRlKCdtb2JpbGUtc3ViLW5hdicpO1xyXG5cdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5tYWluLW5hdiAubmF2LWwzLCAuZ2xvYmFsLWhlYWRlciAubWFpbi1uYXYgLm5hdi1sMicpXHJcblx0XHRcdFx0XHQuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGhlYWRlcikge1xyXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2V0QWN0aXZlT3Blbih0aGlzLCAnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdC8vQXJpYVxyXG5cdFx0XHRcdHNldEFyaWFTdGF0ZXMoJCh0aGlzKSk7XHJcblxyXG5cdFx0XHRcdC8vY2xvc2UgbWVudVxyXG5cdFx0XHRcdGNoYW5nZVN0YXRlKCdtb2JpbGUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHRcdGhhc1RvdWNoKCk7XHJcblxyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIE1vYmlsZSBTdXBwb3J0aW5nIGZ1bmN0aW9ucy91dGlsc1xyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIGFkZE1lbnVCdXR0b25FdmVudCgpIHtcclxuXHJcblxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oYW1idXJnZXIgYScpLm9uKCdjbGljaycsZnVuY3Rpb24oZXZlbnQpe1xyXG5cclxuXHJcblxyXG5cdFx0XHRpZiAoc3RhdGUgPT09ICd0YWJsZXQtcG9ydHJhaXQnKSB7XHJcblx0XHRcdFx0Y2hhbmdlU3RhdGUoJ3RhYmxldC1wb3J0cmFpdC1uYXYnKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjaGFuZ2VTdGF0ZSgnbW9iaWxlLW5hdicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBhZGRDbG9zZUJ1dHRvbkV2ZW50KCkge1xyXG5cclxuXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmNsb3NlIGEnKS5vbignY2xpY2snLGZ1bmN0aW9uKGV2ZW50KXtcclxuXHJcblxyXG5cclxuXHRcdFx0aWYgKChzdGF0ZSA9PT0gJ3RhYmxldC1wb3J0cmFpdC1uYXYnKSB8fCAoc3RhdGUgPT09ICd0YWJsZXQtcG9ydHJhaXQtc3ViLW5hdicpKSB7XHJcblx0XHRcdFx0Y2hhbmdlU3RhdGUoJ3RhYmxldC1wb3J0cmFpdCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNoYW5nZVN0YXRlKCdtb2JpbGUnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9SZXNldCBwYWdlIHNjcm9sbCBvbiBtZW51IGNsb3NlXHJcblx0XHRcdCQoJ2h0bWwnKS5jc3MoJ292ZXJmbG93JywnJyk7XHJcblxyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEJhY2tCdXR0b25FdmVudChiYWNrVG9TdGF0ZSkge1xyXG5cclxuXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgYS5iYWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7XHJcblxyXG5cclxuXHJcblx0XHRcdGNoYW5nZVN0YXRlKGJhY2tUb1N0YXRlKTtcclxuXHJcblx0XHRcdGlmKGJhY2tUb1N0YXRlID09PSAnbW9iaWxlLXN1Yi1uYXYnKXtcclxuXHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgLm5hdi1sMycpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGJhY2tUb1N0YXRlID09PSAnbW9iaWxlLW5hdicpe1xyXG5cdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiAubmF2LWwyJykuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBY3RpdmVPcGVuKGl0ZW0sIGFkZENsYXNzZXMpIHtcclxuXHJcblxyXG5cclxuXHRcdHZhciBwYXJlbnRMaXN0ID0gJChpdGVtKS5jbG9zZXN0KCd1bCcpO1xyXG5cclxuXHRcdHZhciBpc0FjdGl2ZSA9ICQoaXRlbSkuY2xvc2VzdCgnbGknKS5oYXNDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0Ly8gSWYgbmV3IHNlbGVjdGlvbiBjbGVhciBzdWIgYWN0aXZlIHN0YXRlc1xyXG5cdFx0aWYgKCFpc0FjdGl2ZSl7XHJcblx0XHRcdC8vIENsZWFyIGFueSBhY3RpdmUgc3RhdGVzXHJcblx0XHRcdCQoJ2xpJywgcGFyZW50TGlzdCkucmVtb3ZlQ2xhc3MoJ29wZW4nKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdCQoaXRlbSkuY2xvc2VzdCgnbGknKS5hZGRDbGFzcyhhZGRDbGFzc2VzKTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzZXRBcmlhU3RhdGVzKGVsKXtcclxuXHRcdC8vIEFyaWEgc2hvdyBoaWRlIG5hdiBzZWN0aW9uXHJcblx0XHRlbC5uZXh0KCkuYXR0cignYXJpYS1oaWRkZW4nLCAnZmFsc2UnKTtcclxuXHJcblx0XHQvLyBBcmlhIGNoZWNraW5nIHRoZSBzZWxlY3RlZCBhcmVhXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAubWFpbi1uYXYgbGknKS5hdHRyKCdhcmlhLXNlbGVjdGVkJywgJ2ZhbHNlJyk7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAubWFpbi1uYXYgbGkuYWN0aXZlJykuYXR0cignYXJpYS1zZWxlY3RlZCcsICd0cnVlJyk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBzd2FwQ2xhc3Mob2xkQ2xhc3MsIG5ld0NsYXNzKSB7XHJcblx0XHR2YXIgcHJldmlvdXNTdGF0ZSA9IG9sZENsYXNzID09PSAnaGFtYnVyZ2VyJyA/ICdtZW51JyA6ICdjbG9zZSc7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuJyArIG9sZENsYXNzICsgJyBhJykuYXR0cignZGF0YS1wcmV2aW91cy1zdGF0ZScsIHByZXZpb3VzU3RhdGUpO1xyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLicgKyBvbGRDbGFzcylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKG9sZENsYXNzKVxyXG5cdFx0XHQuYWRkQ2xhc3MobmV3Q2xhc3MpXHJcblx0XHRcdC5hdHRyKCdhcmlhRGVzY3JpYmVkYnknLCAnYXJpYVRhcGV4cGFuZCcpO1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNldEhlaWdodChjbGFzc1BhdGgsIG9mZnNldCkge1xyXG5cclxuXHJcblxyXG5cdFx0dmFyIG1lbnVIZWlnaHQgPSB3aW5kb3dIZWlnaHQtb2Zmc2V0O1xyXG5cclxuXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgJytjbGFzc1BhdGgpLmhlaWdodChtZW51SGVpZ2h0KTtcclxuXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiByZXNldFN0eWxlcygpIHtcclxuXHJcblxyXG5cclxuXHRcdCQoJ2h0bWwnKS5jc3MoJ292ZXJmbG93JywnJyk7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAqJykucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuXHJcblx0XHQvLyBBcmlhIHJlbW92aW5nIHJvbGUgaGVhZGluZyBiZWxvdyBkZXNrdG9wIHZpZXdcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5uYXYtbDIgPiB1bCA+IGxpID4gYScpLnJlbW92ZUF0dHIoJ3JvbGUnLCdoZWFkaW5nJyk7XHJcblxyXG5cdFx0cmVzZXRNYWluTmF2Rm9ybWF0KCk7XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGhhc1RvdWNoKCkge1xyXG5cclxuXHJcblxyXG5cdFx0aWYgKG9wdGlvbnMuaGFzVG91Y2gpIHtcclxuXHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ25vLXRvdWNoJyk7XHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyJykuYWRkQ2xhc3MoJ2hhcy10b3VjaCcpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHQkKCcuZ2xvYmFsLWhlYWRlcicpLnJlbW92ZUNsYXNzKCdoYXMtdG91Y2gnKTtcclxuXHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5hZGRDbGFzcygnbm8tdG91Y2gnKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIEluaXRpYWxpc2UgU2l6ZVxyXG5cdCovXHJcblx0ZnVuY3Rpb24gc2l6ZSgpIHtcclxuXHRcdHdpbmRvd0hlaWdodCA9IGdldFZpZXdwb3J0RWxlbWVudCgpLmhlaWdodCgpO1xyXG5cdFx0d2luZG93V2lkdGggPSAkKHdpbmRvdykud2lkdGgoKTtcclxuXHR9XHJcblxyXG5cclxuXHQvKlxyXG5cdCogVXBkYXRlIFN0YXRlIFZhcmlhYmxlXHJcblx0Ki9cclxuXHRmdW5jdGlvbiB1cGRhdGVTdGF0ZSgpIHtcclxuXHJcblx0XHRpZiAoKHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzLmRlc2t0b3AubWluKSAmJiAod2luZG93V2lkdGggPD0gYnJlYWtwb2ludHMuZGVza3RvcC5tYXgpKSB7XHJcblxyXG5cdFx0XHRzdGF0ZSA9ICdkZXNrdG9wJztcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gRm9yIHZpZXdwb3J0cyBncmVhdGVyIHRoYW4gb3VyIHN0YW5kYXJkIGRlc2t0b3AgLSBkZWZhdWx0IHRvIGRlc2t0b3BcclxuXHRcdGlmICh3aW5kb3dXaWR0aCA+PSBicmVha3BvaW50cy5kZXNrdG9wLm1heCkge1xyXG5cclxuXHJcblx0XHRcdHN0YXRlID0gJ2Rlc2t0b3AnO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKHdpbmRvd1dpZHRoID49IGJyZWFrcG9pbnRzLnRhYmxldFBvcnRyYWl0Lm1pbikgJiYgKHdpbmRvd1dpZHRoIDw9IGJyZWFrcG9pbnRzLnRhYmxldFBvcnRyYWl0Lm1heCkpIHtcclxuXHJcblx0XHRcdHN0YXRlID0gJ3RhYmxldC1wb3J0cmFpdCc7XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgod2luZG93V2lkdGggPj0gYnJlYWtwb2ludHMubW9iaWxlLm1pbikgJiYgKHdpbmRvd1dpZHRoIDw9IGJyZWFrcG9pbnRzLm1vYmlsZS5tYXgpKSB7XHJcblxyXG5cdFx0XHRzdGF0ZSA9ICdtb2JpbGUnO1xyXG5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBVcGRhdGUgYm9keSBjbGFzc2VzLiBBZGRzIHRoZSBjdXJyZW50IHN0YXRlIGNsYXNzIHRvIHRoZSBib2R5LiBPbiBzdGF0ZSBjaGFuZ2UsIHJlbW92ZSB0aGUgcHJldmlvdXMgc3RhdGUgY2xhc3NcclxuXHQqL1xyXG5cclxuXHRmdW5jdGlvbiB1cGRhdGVCb2R5Q2xhc3NlcygpIHtcclxuXHJcblx0XHR2YXIgc3VwZXJTdGF0ZXMgPSBbJ2Rlc2t0b3AnLCAnbWluaW1pc2VkJywgJ3RhYmxldC1wb3J0cmFpdCcsICd0YWJsZXQtcG9ydHJhaXQtbmF2JywgJ3RhYmxldC1wb3J0cmFpdC1zdWItbmF2JywgJ21vYmlsZScsICdtb2JpbGUtbmF2JywgJ21vYmlsZS1zdWItbmF2JywgJ21vYmlsZS1zdWItbmF2LWwzJ107XHJcblx0XHR2YXIgdG9DbGFzc2VzID0gJyc7XHJcblxyXG5cdFx0aWYoJCgnYm9keScpLmF0dHIoJ2NsYXNzJykpIHtcclxuXHJcblx0XHRcdHZhciBmcm9tQ2xhc3NlcyA9ICQoJ2JvZHknKS5hdHRyKCdjbGFzcycpLnNwbGl0KCcgJyk7XHJcblxyXG5cdFx0XHRmb3IgKHZhciBpPTA7IGk8ZnJvbUNsYXNzZXMubGVuZ3RoOyBpKyspXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoKCQuaW5BcnJheShmcm9tQ2xhc3Nlc1tpXSwgc3VwZXJTdGF0ZXMpKSA9PT0gLTEpIHtcclxuXHRcdFx0XHRcdHRvQ2xhc3NlcyA9IHRvQ2xhc3NlcyArICcgJyArIGZyb21DbGFzc2VzW2ldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRvQ2xhc3NlcyA9IHRvQ2xhc3NlcyArICcgJyArIHN0YXRlO1xyXG5cclxuXHRcdCQoJ2JvZHknKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoKVxyXG5cdFx0XHQuYWRkQ2xhc3ModG9DbGFzc2VzKTtcclxuXHJcblxyXG5cdFx0Ly9pZiAoJCgnYm9keScpLmhhc0NsYXNzKCd0YWJsZXQtcG9ydHJhaXQtbmF2JykpIHtcclxuXHRcdFx0Ly9kb2N1bWVudC5vbnRvdWNobW92ZSA9IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0ICAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0Ly99XHJcblx0XHQvL31cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBSZXNpemVcclxuXHQqL1xyXG5cdGZ1bmN0aW9uIHJlc2l6ZSgpIHtcclxuXHRcdCQod2luZG93KS5yZXNpemUoJC5kZWJvdW5jZShmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHNpemUoKTtcclxuXHJcblx0XHRcdC8vIEhvdyBhYm91dCB3ZSBkb24ndCBhY3R1YWxseSBkbyBhbGwgdGhpcyBpZiB0aGUgc3RhdGUgZG9lc24ndCBuZWVkIGNoYW5naW5nP1xyXG5cdFx0XHR2YXIgY3VycmVudFN0YXRlID0gc3RhdGU7XHJcblxyXG5cdFx0XHR1cGRhdGVTdGF0ZSgpO1xyXG5cdFx0XHRpZiAoY3VycmVudFN0YXRlICE9PSBzdGF0ZSkge1xyXG5cdFx0XHRcdGNoYW5nZVN0YXRlKHN0YXRlKTtcclxuXHRcdFx0XHQvLyBTZXR1cCBVdGlsaXRpZXMgbGlzdCBmb3IgRGVza3RvcCBzdGF0ZVxyXG5cdFx0XHRcdGdldFV0aWxpdGllcygpOyAvLyBTaG91bGQgdGhpcyBiZSBpbiB0aGUgc3RhdGVzPyBEb2Vzbid0IHNlZW0gcmlnaHQgaGVyZVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxvcHRpb25zLnRpbWluZ3MucmVzaXplRGVib3VuY2UpKTtcclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBTZXR1cCBVdGlsaXRpZXMgbGlzdCBmb3IgRGVza3RvcCBzdGF0ZVxyXG5cdCovXHJcblx0ZnVuY3Rpb24gZ2V0VXRpbGl0aWVzKCkge1xyXG5cclxuXHRcdHZhciBoZWFkZXIgPSAkKCcuZ2xvYmFsLWhlYWRlci5kZXNrdG9wJyksXHJcblx0XHRcdHV0aWxpdGllc0JhciA9IGhlYWRlci5maW5kKCcudXRpbGl0aWVzJykud2lkdGgoKSxcclxuXHRcdFx0dXRpbGl0aWVzQmFyTGlzdCA9IGhlYWRlci5maW5kKCcudXRpbGl0aWVzIHVsJykud2lkdGgoKSxcclxuXHRcdFx0cHJpbWFyeWxpbmtzV2lkdGggPSB1dGlsaXRpZXNCYXIgLSB1dGlsaXRpZXNCYXJMaXN0LFxyXG5cdFx0XHR2aWV3cG9ydFdpZHRoID0gKCQod2luZG93KS53aWR0aCgpIC8gMikgLSBwcmltYXJ5bGlua3NXaWR0aCArIDIwMCxcclxuXHRcdFx0dXRpbGl0aWVzSXRlbXMgPSBoZWFkZXIuZmluZCgnLnV0aWxpdGllcyBsaScpLmxlbmd0aCAtIDEsXHJcblx0XHRcdGksXHJcblx0XHRcdHV0aWxpdHlXaWR0aCA9IDA7XHJcblxyXG5cdFx0aGVhZGVyLmZpbmQoJy51dGlsaXRpZXMgbGk6bHQoJysgdXRpbGl0aWVzSXRlbXMgKycpJykuc2hvdygpO1xyXG5cclxuXHRcdGZvciAoaSA9IHV0aWxpdGllc0l0ZW1zOyBpID49IDA7IC0taSkge1xyXG5cdFx0XHR2YXIgdXRpbGl0aWVzSXRlbSA9IGhlYWRlci5maW5kKCcudXRpbGl0aWVzIGxpOmVxKCcrIGkgKycpJyk7XHJcblxyXG5cdFx0XHR1dGlsaXR5V2lkdGggKz0gdXRpbGl0aWVzSXRlbS5vdXRlcldpZHRoKHRydWUpO1xyXG5cdFx0XHRpZiAodXRpbGl0eVdpZHRoID4gdmlld3BvcnRXaWR0aCkge1xyXG5cdFx0XHRcdHV0aWxpdGllc0l0ZW0uaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogRGVza3RvcCBzZWFyY2ggYmFyIHV0aWxpdHlcclxuXHQqL1xyXG5cclxuXHRmdW5jdGlvbiBzZWFyY2hCYXIoKSB7XHJcblxyXG5cclxuXHJcblx0XHQvLyBTZWFyY2ggYmFyIGNsb3NlZCBieSBkZWZhdWx0IGZvciBjaGFuZ2Ugb2Ygc3RhdGVcclxuXHJcblx0XHRjbG9zZVNlYXJjaCgpO1xyXG5cclxuXHRcdC8vIE9uIGNsaWNrIHNlYXJjaCBpY29uXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaCBhJykub24oe1xyXG5cdFx0XHRjbGljazogZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcblx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnV0aWxpdGllcycpLmhpZGUoKTtcclxuXHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuc2VhcmNoLWJhcicpLnNob3coKTtcclxuXHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuc2VhcmNoLWJhciBpbnB1dCcpLmZvY3VzKCk7XHJcblx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5hZGRDbGFzcygnc2VhcmNoLW9wZW4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaC1iYXIgLnNlYXJjaC1jbG9zZScpLm9uKHtcclxuXHRcdFx0Y2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRjbG9zZVNlYXJjaCgpO1xyXG5cdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2ggYScpLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIENsb3NlIHNlYXJjaCBiYXIgb24gcHJlc3Mgb2YgRVNDIGtleVxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2gtYmFyJykub24oe1xyXG5cdFx0XHRrZXlkb3duOiBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRcdGlmICgvMjcvLnRlc3QoZXZlbnQud2hpY2gpKSB7IC8vIEVTQyBwcmVzc2VkXHJcblx0XHRcdFx0XHRjbG9zZVNlYXJjaCgpO1xyXG5cdFx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaC1iYXIgLnNlYXJjaC1jbGVhcicpLmhpZGUoKTtcclxuXHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2ggYScpLmZvY3VzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBTaG93L2hpZGUgY2xlYXIgaWNvblxyXG5cclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2gtYmFyIGlucHV0Jykub24oe1xyXG5cdFx0XHRrZXlkb3duOmZ1bmN0aW9uKGV2ZW50KXtcclxuXHRcdFx0XHRpZigvOS8udGVzdChldmVudC53aGljaCkpIHsgLy8gVGFiXHJcblx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2gtYmFyIC5zZWFyY2gtY2xlYXInKS5mb2N1cygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0a2V5dXA6IGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHRleHRWYWx1ZT0kKHRoaXMpLnZhbCgpO1xyXG5cdFx0XHRcdGlmKHRleHRWYWx1ZSE9PScnKSB7XHJcblx0XHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuc2VhcmNoLWJhciAuc2VhcmNoLWNsZWFyJykuc2hvdygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5zZWFyY2gtYmFyIC5zZWFyY2gtY2xlYXInKS5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Ly8gQ2xlYXIgaW5wdXQgZmllbGQgb24gY2xpY2sgb2YgeCBpY29uXHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaC1iYXIgLnNlYXJjaC1jbGVhcicpLm9uKCdjbGljaycsZnVuY3Rpb24oZXZlbnQpe1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHQkKCcuc2VhcmNoLWJhciBpbnB1dCcpLnZhbCgnJykuZm9jdXMoKTtcclxuXHRcdFx0JCh0aGlzKS5oaWRlKCk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogTW9iaWxlIC0gVGFibGV0IHNlYXJjaCBiYXIgdXRpbGl0eVxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIHNlYXJjaEJhck1vYmlsZSgpIHtcclxuXHJcblxyXG5cdFx0c2VhcmNoQmFyKCk7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaCBhJykub24oJ2NsaWNrJyxmdW5jdGlvbihldmVudCl7XHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyLm1vYmlsZSAubG9nby1zZWN0aW9uJykuaGlkZSgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gRml4IGZvciBtb2JpbGUgYnJvd3NlciBvbiBmb2N1cyBpc3N1ZVxyXG5cdFx0aWYgKG9wdGlvbnMuaGFzVG91Y2gpIHtcclxuXHRcdFx0JChkb2N1bWVudCkub24oJ2ZvY3VzJywgJy5zZWFyY2gtYmFyIGlucHV0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5hZGRDbGFzcygncG9zaXRpb24tZml4Jyk7XHJcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgMCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JCgnLnNlYXJjaC1iYXIgaW5wdXQnKS5vbignaW5wdXQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlcicpLmFkZENsYXNzKCdwb3NpdGlvbi1maXgnKTtcclxuXHRcdFx0XHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogMCB9LCAwKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBSZW1vdmUgZml4IHdoZW4gb3V0IG9mIGZvY3VzXHJcblx0XHRcdCQoZG9jdW1lbnQpLm9uKCdibHVyJywgJy5zZWFyY2gtYmFyIGlucHV0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCgnLmdsb2JhbC1oZWFkZXInKS5yZW1vdmVDbGFzcygncG9zaXRpb24tZml4Jyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LypcclxuXHQqIENsb3NlIHNlYXJjaCBiYXIgdXRpbGl0eVxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIGNsb3NlU2VhcmNoKCkge1xyXG5cclxuXHRcdCQoJyNzZWFyY2gtaW5wdXQnKS52YWwoJycpO1xyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLnNlYXJjaC1iYXInKS5oaWRlKCk7XHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAudXRpbGl0aWVzLCAuZ2xvYmFsLWhlYWRlci5tb2JpbGUgLmxvZ28tc2VjdGlvbicpLnNob3coKTtcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyJykucmVtb3ZlQ2xhc3MoJ3NlYXJjaC1vcGVuJyk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly9cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cdC0tLS0tLS0tLS0tXHQtLS0tLS0tLS0tLVx0LS0tLS0tLS0tLS1cclxuXHJcblxyXG5cdC8qXHJcblx0KiBTZXR1cCBNb3JlIGxpc3QgZm9yIGRlc2t0b3AsIG1pbmltaXNlZCBzdGF0ZXNcclxuXHQqL1xyXG5cclxuXHRmdW5jdGlvbiBtb3JlKCkge1xyXG5cclxuXHJcblxyXG5cdFx0aWYgKHN0YXRlID09PSAnZGVza3RvcCcgfHwgc3RhdGUgPT09ICdtaW5pbWlzZWQnKSB7XHJcblxyXG5cdFx0XHR2YXIgbW9yZVByZXNlbnQgPSBmYWxzZTtcclxuXHJcblx0XHRcdHZhciBtb3JlT2Zmc2V0V2lkdGggPSAxNDA7XHJcblx0XHRcdHZhciBtb3JlT2Zmc2V0VXNlZCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Ly8gR2V0IE5hdiB3aWR0aFxyXG5cdFx0XHR2YXIgbmF2ID0gJCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2Jyk7XHJcblxyXG5cdFx0XHRuYXYuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xyXG5cclxuXHRcdFx0dmFyIG5hdldpZHRoID0gbmF2LndpZHRoKCk7XHJcblxyXG5cdFx0XHR2YXIgbmF2VWxXaWR0aCA9IDUwOyAvLyBHaXZlIGEgZGVmYXVsdCBvZmZzZXQgZm9yIGEgbGl0dGxlIGJyZWF0aGluZyByb29tXHJcblxyXG5cdFx0XHR2YXIgbmF2TGlJdGVtcyA9ICQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdj51bD5saScpO1xyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIGFueSBwcmV2aW91c2x5IHNldCBtb3JlIGNsYXNzZXNcclxuXHRcdFx0JChuYXZMaUl0ZW1zKS5yZW1vdmVDbGFzcygnbW9yZS1pdGVtJyk7Ly8uc2hvdygpOy8vIHJlbW92ZSBzaG93P1xyXG5cclxuXHRcdFx0Ly8gUmVtb3ZlIGFueSBwcmV2aW91cyBtb3JlIGxpIHN0cnVjdHVyZXNcclxuXHRcdFx0JCgnPnVsIGxpLm1vcmUnLCBuYXYpLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1tb3JlJykucmVtb3ZlKCk7XHJcblxyXG5cclxuXHRcdFx0JChuYXZMaUl0ZW1zKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0dmFyIGl0ZW1XaWR0aCA9ICQodGhpcykub3V0ZXJXaWR0aCgpO1xyXG5cclxuXHRcdFx0XHRuYXZVbFdpZHRoICs9IGl0ZW1XaWR0aDtcclxuXHJcblxyXG5cclxuXHRcdFx0XHQvLyBDaGVjayB0byBzZWUgaWYgd2l0aCBleGNlZWRzIG5hdlxyXG5cclxuXHJcblxyXG5cdFx0XHRcdGlmIChuYXZVbFdpZHRoID4gbmF2V2lkdGgpIHtcclxuXHJcblx0XHRcdFx0XHQvLyBBZGQgbW9yZSBsaXN0IGl0ZW1cclxuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ21vcmUtaXRlbScpLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0XHQvLyBJcyB0aGUgdWwgbmF2IHN0aWxsIGdyZWF0ZXIgdGhhbiBuYXYgd2l0aCBtb3JlIGFkZGVkP1xyXG5cdFx0XHRcdFx0dmFyIGFkanVzdGVkVWxXaWR0aCA9IChuYXZVbFdpZHRoIC0gaXRlbVdpZHRoKSArIG1vcmVPZmZzZXRXaWR0aDtcclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdGlmIChhZGp1c3RlZFVsV2lkdGggPiBuYXZXaWR0aCAmJiBtb3JlT2Zmc2V0VXNlZCA9PT0gZmFsc2UpIHtcclxuXHJcblx0XHRcdFx0XHRcdC8vIFRoZW4gaGlkZSBwcmV2aW91cyBpdGVtIHRvb1xyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLnByZXYoKS5hZGRDbGFzcygnbW9yZS1pdGVtJykuaGlkZSgpO1xyXG5cclxuXHRcdFx0XHRcdFx0bW9yZU9mZnNldFVzZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRtb3JlUHJlc2VudCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHJcblx0XHRcdGlmIChtb3JlUHJlc2VudCl7XHJcblxyXG5cdFx0XHRcdC8vIERvIG1vcmVcclxuXHJcblxyXG5cdFx0XHRcdC8vIFRlc3QgdG8gbWFrZSBzdXJlIHdlIGhhdmUgYXQgbGVhc3QgMiBpdGVtcyBpbiBtb3JlXHJcblx0XHRcdFx0dmFyIG1vcmVDb3VudCA9ICQoJz51bCBsaS5tb3JlLWl0ZW0nLCBuYXYpLmxlbmd0aDtcclxuXHJcblx0XHRcdFx0aWYgKG1vcmVDb3VudCA9PT0gMSl7XHJcblxyXG5cdFx0XHRcdFx0JCgnPnVsIGxpLm1vcmUtaXRlbScsIG5hdilcclxuXHRcdFx0XHRcdFx0LnByZXYoKVxyXG5cdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ21vcmUtaXRlbScpXHJcblx0XHRcdFx0XHRcdC5oaWRlKClcclxuXHRcdFx0XHRcdDtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyAqIENvbnN0cnVjdCB0aGUgbW9yZSBsaW5rICYgbmF2ICpcclxuXHJcblx0XHRcdFx0Ly8gTW9yZSBsaW5rXHJcblx0XHRcdFx0dmFyIG1vcmVMaSA9ICQoJzxsaSBjbGFzcz1cXFwibW9yZVxcXCIgYXJpYS1oYXNwb3B1cD1cXFwidHJ1ZVxcXCIgLz4nKTtcclxuXHRcdFx0XHR2YXIgbW9yZUxpbmsgPSAkKCc8YSBocmVmPVxcXCIjXFxcIiBhcmlhLWV4cGFuZGVkPVxcXCJmYWxzZVxcXCI+PHNwYW4+TW9yZTwvc3Bhbj48L2E+Jyk7XHJcblxyXG5cdFx0XHRcdC8vIEFkZCB0aGUgbW9yZSBsaW5rXHJcblx0XHRcdFx0JCgnPnVsIGxpLm1vcmUtaXRlbScsIG5hdilcclxuXHRcdFx0XHRcdC5maXJzdCgpXHJcblx0XHRcdFx0XHQuYmVmb3JlKG1vcmVMaSlcclxuXHRcdFx0XHQ7XHJcblx0XHRcdFx0Ly8gQXBwZW5kIGl0ZW1zXHJcblx0XHRcdFx0JChtb3JlTGluaykuYXBwZW5kVG8obW9yZUxpKTtcclxuXHJcblx0XHRcdFx0Ly8gTW9yZSBuYXZcclxuXHRcdFx0XHR2YXIgaGVhZGVyTW9yZSA9ICQoJzxkaXYgY2xhc3M9XFxcImhlYWRlci1tb3JlXFxcIj4nKTtcclxuXHRcdFx0XHR2YXIgbW9yZUNvbnRhaW5lciA9ICQoJzxkaXYgY2xhc3M9XFxcImhlYWRlci1jb250YWluZXJcXFwiPicpO1xyXG5cdFx0XHRcdHZhciBtb3JlTmF2ID0gJCgnPG5hdiBjbGFzcz1cXFwibWFpbi1uYXZcXFwiPicpO1xyXG5cdFx0XHRcdHZhciBtb3JlTGlzdCA9ICQoJzx1bCBjbGFzcz1cXFwibW9yZS1saXN0XFxcIj4nKTtcclxuXHJcblx0XHRcdFx0JChoZWFkZXJNb3JlKS5hcHBlbmRUbygnLmdsb2JhbC1oZWFkZXInKTtcclxuXHRcdFx0XHQkKG1vcmVDb250YWluZXIpLmFwcGVuZFRvKGhlYWRlck1vcmUpO1xyXG5cdFx0XHRcdCQobW9yZU5hdikuYXBwZW5kVG8obW9yZUNvbnRhaW5lcik7XHJcblx0XHRcdFx0JChtb3JlTGlzdCkuYXBwZW5kVG8obW9yZU5hdik7XHJcblxyXG5cdFx0XHRcdC8vIENsb25lIHRoZSBlbGVtZW50cyB0byBiZSB1c2VkIGluIHRoZSBtb3JlIG5hdmlnYXRpb25cclxuXHRcdFx0XHQkKCc+dWwgbGkubW9yZS1pdGVtJywgbmF2KVxyXG5cdFx0XHRcdFx0LmNsb25lKClcclxuXHRcdFx0XHRcdC5hcHBlbmRUbyhtb3JlTGlzdClcclxuXHRcdFx0XHRcdC5zaG93KClcclxuXHRcdFx0XHQ7XHJcblxyXG5cdFx0XHRcdC8vIENoZWNrIGZvciBhY3RpdmUgY29udGVudHMgb2YgdGhlIG1vcmUtbmF2XHJcblx0XHRcdFx0dmFyIGlzQWN0aXZlID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1vcmUtbmF2IC5tYWluLW5hdiAubW9yZS1pdGVtJykuaGFzQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgTW9yZSBsaW5rIHRvIGFjdGl2ZSBpZiBwcmVzZW50XHJcblx0XHRcdFx0aWYgKGlzQWN0aXZlKSB7XHJcblx0XHRcdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgbGkubW9yZScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEJpbmQgYWN0aW9ucyB0byB0aGUgbW9yZSBidXR0b25cclxuXHRcdFx0XHRhZGRNb3JlRXZlbnRzKCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIENsZWFuIHVwIGFueSBtb3JlIGl0ZW1zXHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiA+IHVsIGxpJykucmVtb3ZlQ2xhc3MoJ21vcmUtaXRlbScpO1xyXG5cclxuXHRcdFx0Ly8gTWFrZSBzdXJlIG1vcmUgaXMgbm90IHByZXNlbnQgaW4gYW55IG90aGVyIG1lbnUgc3RydWN0dXJlc1xyXG5cdFx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgPiB1bCBsaS5tb3JlJykucmVtb3ZlKCk7XHJcblx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbW9yZScpLnJlbW92ZSgpO1xyXG5cclxuXHRcdH1cclxuXHJcblx0XHRuYXYuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBzaG93TW9yZU5hdmlnYXRpb24oKSB7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2IGxpLm1vcmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ29wZW4nKVxyXG5cdFx0XHQuZmluZCgnPmEnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcclxuXHJcblx0XHQkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW1vcmUnKVxyXG5cdFx0XHQuYWRkQ2xhc3MoJ29wZW4nKVxyXG5cdFx0XHQuc2hvdygpO1xyXG5cclxuXHJcblx0XHQvLyBDb3B5IGFjdGl2ZSBzdGF0ZXMgdG8gaGlkZGVuIG1lbnUgaXRlbXNcclxuXHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbW9yZSAubWFpbi1uYXYgLm1vcmUtbGlzdCAubmF2LWwzIGEnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpe1xyXG5cclxuXHJcblxyXG5cdFx0XHQvLyBDb3B5IGFjdGl2ZSBzdGF0ZXMgdG8gaGlkZGVuIG1lbnUgaXRlbXNcclxuXHRcdFx0Y29weUFjdGl2ZVN0YXRlKHRoaXMpO1xyXG5cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBoaWRlTW9yZU5hdmlnYXRpb24oKSB7XHJcblxyXG5cclxuXHJcblx0XHQvL1Jlc2V0IHBhZ2Ugc2Nyb2xsIG9uIG1lbnUgY2xvc2VcclxuXHRcdCQoJ2h0bWwnKS5jc3MoJ292ZXJmbG93JywnJyk7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IGxpLm1vcmUnKVxyXG5cdFx0XHQucmVtb3ZlQ2xhc3MoJ29wZW4nKVxyXG5cdFx0XHQuZmluZCgnPmEnKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XHJcblxyXG5cdFx0JCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1tb3JlJylcclxuXHRcdFx0LnJlbW92ZUNsYXNzKCdvcGVuJylcclxuXHRcdFx0LmhpZGUoKTtcclxuXHJcblx0fVxyXG5cclxuXHJcblx0ZnVuY3Rpb24gYWRkTW9yZUV2ZW50cygpIHtcclxuXHJcblxyXG5cclxuXHRcdC8qIEJ1dHRvbiAqL1xyXG5cclxuXHRcdHZhciBtb3JlQnV0dG9uID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IGxpLm1vcmU+YScpO1xyXG5cdFx0dmFyIGhlYWRlck1vcmUgPSAkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW1vcmUnKTtcclxuXHJcblx0XHQkKG1vcmVCdXR0b24pLm9uKHtcclxuXHJcblx0XHRcdG1vdXNlZW50ZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdFx0b3ZlcmxheSgnaGlkZScpO1xyXG5cclxuXHRcdFx0XHRjbG9zZVNlYXJjaCgpO1xyXG5cclxuXHRcdFx0XHRzaG93TW9yZU5hdmlnYXRpb24oKTtcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdG1vdXNlbGVhdmU6IGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG5cclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0dmFyIGhlYWRlck1vcmVJbnRlcmFjdGl2ZSA9ICQoaGVhZGVyTW9yZSkuaGFzQ2xhc3MoJ2ludGVyYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFoZWFkZXJNb3JlSW50ZXJhY3RpdmUpIHtcclxuXHJcblx0XHRcdFx0XHRcdGhpZGVNb3JlTmF2aWdhdGlvbigpO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSwgMjUwKTtcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGNsaWNrOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcblxyXG5cclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHR2YXIgaXNPcGVuID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IGxpLm1vcmUnKS5oYXNDbGFzcygnb3BlbicpO1xyXG5cclxuXHRcdFx0XHRpZiAoaXNPcGVuKSB7XHJcblx0XHRcdFx0XHRoaWRlTW9yZU5hdmlnYXRpb24oKTtcclxuXHRcdFx0XHRcdGhpZGVOYXZGb3JNb3JlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNob3dNb3JlTmF2aWdhdGlvbigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0Ly8gQWNjZXNzaWJpbGl0eSAtICBtb3JlIGludGVyYWN0aW9uc1xyXG5cclxuXHRcdCQobW9yZUJ1dHRvbikub24oe1xyXG5cclxuXHRcdFx0a2V5dXA6IGZ1bmN0aW9uKGV2ZW50KXtcclxuXHJcblxyXG5cclxuXHRcdFx0XHRpZiAoLzI3Ly50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBFc2NcclxuXHJcblx0XHRcdFx0XHRoaWRlTW9yZU5hdmlnYXRpb24oKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigvMzcvLnRlc3QoZXZlbnQud2hpY2gpKSB7IC8vIExlZnQgYXJyb3dcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucHJldigpLmZpbmQoJz5hJykuZm9jdXMoKTtcclxuXHJcblx0XHRcdFx0XHRoaWRlTW9yZU5hdmlnYXRpb24oKTtcclxuXHRcdFx0XHRcdGhpZGVOYXZGb3JNb3JlKCk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoLzQwLy50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBEb3duIGFycm93XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHR2YXIgaXNPcGVuID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IGxpLm1vcmUnKS5oYXNDbGFzcygnb3BlbicpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChpc09wZW4pIHtcclxuXHJcblx0XHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbW9yZSAubWFpbi1uYXYgLm1vcmUtaXRlbSA+YScpLmZpcnN0KCkuZm9jdXMoKTtcclxuXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoLzMyLy50ZXN0KGV2ZW50LndoaWNoKSkgeyAvLyBTcGFjZVxyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0JCh0aGlzKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8qIE1vcmUgQXJlYSAqL1xyXG5cclxuXHRcdCQoaGVhZGVyTW9yZSkub24oe1xyXG5cclxuXHRcdFx0bW91c2VlbnRlcjogZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2ludGVyYWN0aXZlJyk7XHJcblxyXG5cdFx0XHR9LFxyXG5cdFx0XHRtb3VzZWxlYXZlOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaW50ZXJhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0aGlkZU1vcmVOYXZpZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblxyXG5cclxuXHRcdC8qIFVwIG9uIGZpcnN0IGl0ZW0gb2YgdGhlIG5hdiAqL1xyXG5cclxuXHRcdCQoJy5tb3JlLWxpc3QgPiBsaScsIGhlYWRlck1vcmUpLm9uKHtcclxuXHJcblx0XHRcdGtleXVwOiBmdW5jdGlvbihldmVudCl7XHJcblxyXG5cdFx0XHRcdGlmKC8zOC8udGVzdChldmVudC53aGljaCkpIHsgLy8gVXAgYXJyb3dcclxuXHJcblxyXG5cclxuXHRcdFx0XHRcdCQobW9yZUJ1dHRvbikuZm9jdXMoKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHJcblx0XHRmdW5jdGlvbiBoaWRlTmF2Rm9yTW9yZSgpIHtcclxuXHJcblx0XHRcdC8vIEEgVmFyaWF0aW9uIG9uICdoaWRlTmF2JyBmb3IgbW9yZSAvIG5vdCBpZGVhbFxyXG5cdFx0XHR2YXIgaGVhZGVyID0gJCgnLmdsb2JhbC1oZWFkZXInKTtcclxuXHRcdFx0dmFyIG1haW5OYXZzID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2Jyk7XHJcblx0XHRcdHZhciBzZWNvbmRhcnlOYXZzID0gJCgnLmdsb2JhbC1oZWFkZXIgLm1haW4tbmF2IC5uYXYtbDInKTtcclxuXHJcblx0XHRcdGlmKG1haW5OYXZzLmF0dHIoJ2RhdGEtbWVudXN0YXRlJykgPT09ICdvcGVuZWQnKXtcclxuXHJcblx0XHRcdFx0b3ZlcmxheSgnaGlkZScpO1xyXG5cclxuXHRcdFx0XHRzZWNvbmRhcnlOYXZzLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0bWFpbk5hdnMuYXR0cignZGF0YS1tZW51c3RhdGUnLCAnY2xvc2VkJyk7XHJcblxyXG5cdFx0XHRcdGlmIChzdGF0ZSA9PT0gJ21pbmltaXNlZCcpIHtcclxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCA9IDU0O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09ICdkZXNrdG9wJykge1xyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMTI2O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aGVhZGVyLmNzcygnaGVpZ2h0JywgaGVhZGVySGVpZ2h0ICsgJ3B4Jyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGNvcHlBY3RpdmVTdGF0ZShhY3RpdmVJdGVtKXtcclxuXHJcblxyXG5cclxuXHRcdC8vIEdldCBhY3RpdmUgaXRlbSByb290IG1lbnVcclxuXHRcdHZhciBhY3RpdmVJdGVtUm9vdCA9ICQoYWN0aXZlSXRlbSkuY2xvc2VzdCgnLm1vcmUtaXRlbScpO1xyXG5cdFx0dmFyIGFjdGl2ZUl0ZW1Sb290TGluayA9ICQoJz4gYScsIGFjdGl2ZUl0ZW1Sb290KTtcclxuXHRcdC8vIEdldCByb290IG1lbnUgaXRlbSB0ZXh0XHJcblx0XHR2YXIgYWN0aXZlSXRlbVJvb3RLZXkgPSBhY3RpdmVJdGVtUm9vdExpbmtbMF0uaW5uZXJUZXh0O1xyXG5cdFx0YWN0aXZlSXRlbVJvb3RLZXkgPSBhY3RpdmVJdGVtUm9vdEtleS5yZXBsYWNlKC9cXHMrL2csICcnKTtcclxuXHJcblxyXG5cclxuXHRcdC8vIEdldCBpdGVtIHRleHRcclxuXHRcdHZhciBhY3RpdmVJdGVtS2V5ID0gYWN0aXZlSXRlbS5pbm5lclRleHQ7XHJcblx0XHRhY3RpdmVJdGVtS2V5ID0gYWN0aXZlSXRlbUtleS5yZXBsYWNlKC9cXHMrL2csICcnKTtcclxuXHJcblxyXG5cclxuXHRcdC8vIFNlYXJjaCBmb3IgbWF0Y2ggaW4gbW9yZS1pdGVtJ3Mgbm90IGluICcubW9yZSdcclxuXHRcdHZhciBoaWRkZW5Nb3JlSXRlbXMgPSAkKCcuZ2xvYmFsLWhlYWRlciAuaGVhZGVyLW5hdiAubWFpbi1uYXYgPiB1bCA+IGxpLm1vcmUtaXRlbScpO1xyXG5cclxuXHRcdHZhciBtYXRjaGVzID0gJCgnYScsIGhpZGRlbk1vcmVJdGVtcyk7XHJcblxyXG5cdFx0dmFyIGZpbHRlcmVkTWF0Y2hlcyA9ICQobWF0Y2hlcykuZmlsdGVyKGZ1bmN0aW9uKGluZGV4KSB7XHJcblxyXG5cdFx0XHR2YXIgZmlsdGVySXRlbUtleSA9IHRoaXMuaW5uZXJUZXh0O1xyXG5cdFx0XHRmaWx0ZXJJdGVtS2V5ID0gZmlsdGVySXRlbUtleS5yZXBsYWNlKC9cXHMrL2csICcnKTtcclxuXHJcblx0XHRcdC8vXHJcblx0XHRcdC8vXHJcblxyXG5cdFx0XHRpZiAoZmlsdGVySXRlbUtleSA9PT0gYWN0aXZlSXRlbUtleSl7XHJcblxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmlsdGVySXRlbUtleSA9PT0gYWN0aXZlSXRlbUtleTtcclxuXHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0JChmaWx0ZXJlZE1hdGNoZXMpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcclxuXHJcblxyXG5cclxuXHJcblx0XHRcdHZhciBtYXRjaEl0ZW1Sb290ID0gJCh0aGlzKS5jbG9zZXN0KCcubW9yZS1pdGVtJyk7XHJcblx0XHRcdHZhciBtYXRjaEl0ZW1Sb290TGluayA9ICQoJz4gYScsIG1hdGNoSXRlbVJvb3QpO1xyXG5cclxuXHRcdFx0Ly8gR2V0IG1hdGNoIGl0ZW0gcm9vdCBtZW51IGl0ZW0gdGV4dFxyXG5cdFx0XHR2YXIgbWF0Y2hJdGVtUm9vdEtleSA9IG1hdGNoSXRlbVJvb3RMaW5rWzBdLmlubmVyVGV4dDtcclxuXHRcdFx0bWF0Y2hJdGVtUm9vdEtleSA9IG1hdGNoSXRlbVJvb3RLZXkucmVwbGFjZSgvXFxzKy9nLCAnJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdGlmIChtYXRjaEl0ZW1Sb290S2V5ID09PSBhY3RpdmVJdGVtUm9vdEtleSkge1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdHZhciBtYXRjaEl0ZW1LZXkgPSB0aGlzLmlubmVyVGV4dDtcclxuXHRcdFx0XHRtYXRjaEl0ZW1LZXkgPSBtYXRjaEl0ZW1LZXkucmVwbGFjZSgvXFxzKy9nLCAnJyk7XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0aWYgKG1hdGNoSXRlbUtleSA9PT0gYWN0aXZlSXRlbUtleSAmJiBhY3RpdmVJdGVtS2V5ICE9PSBhY3RpdmVJdGVtUm9vdEtleSkge1xyXG5cclxuXHJcblxyXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgdGhlIGwyIG5hdiBoZWFkZXIva2V5XHJcblxyXG5cdFx0XHRcdFx0Ly8gR2V0L0NoZWNrIGFjdGl2ZSBsMiBpdGVtIG1lbnVcclxuXHRcdFx0XHRcdHZhciBhY3RpdmVMMkl0ZW1Sb290ID0gJChhY3RpdmVJdGVtKS5jbG9zZXN0KCcubmF2LWwyID4gdWwgPiBsaScpO1xyXG5cdFx0XHRcdFx0dmFyIGFjdGl2ZUwySXRlbVJvb3RMaW5rID0gJCgnPiBhJywgYWN0aXZlTDJJdGVtUm9vdCk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGFjdGl2ZUwySXRlbVJvb3RLZXkgPSBhY3RpdmVMMkl0ZW1Sb290TGlua1swXS5pbm5lclRleHQ7XHJcblx0XHRcdFx0XHRhY3RpdmVMMkl0ZW1Sb290S2V5ID0gYWN0aXZlTDJJdGVtUm9vdEtleS5yZXBsYWNlKC9cXHMrL2csICcnKTtcclxuXHJcblx0XHRcdFx0XHQvLyBHZXQvQ2hlY2sgbWF0Y2hlZCBsMiBpdGVtIG1lbnVcclxuXHRcdFx0XHRcdHZhciBtYXRjaEwySXRlbVJvb3QgPSAkKHRoaXMpLmNsb3Nlc3QoJy5uYXYtbDIgPiB1bCA+IGxpJyk7XHJcblx0XHRcdFx0XHR2YXIgbWF0Y2hMMkl0ZW1Sb290TGluayA9ICQoJz4gYScsIG1hdGNoTDJJdGVtUm9vdCk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIG1hdGNoTDJJdGVtUm9vdEtleSA9IG1hdGNoTDJJdGVtUm9vdExpbmtbMF0uaW5uZXJUZXh0O1xyXG5cdFx0XHRcdFx0bWF0Y2hMMkl0ZW1Sb290S2V5ID0gbWF0Y2hMMkl0ZW1Sb290S2V5LnJlcGxhY2UoL1xccysvZywgJycpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRpZiAobWF0Y2hMMkl0ZW1Sb290S2V5ID09PSBhY3RpdmVMMkl0ZW1Sb290S2V5KSB7XHJcblxyXG5cclxuXHJcblx0XHRcdFx0XHRcdC8vIENsZWFyIGFueSBhY3RpdmUgc3RhdGVzIGluIGhpZGRlbiBtb3JlIGl0ZW1zXHJcblx0XHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaS5tb3JlLWl0ZW0nKVxyXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0XHRcdCQoJy5nbG9iYWwtaGVhZGVyIC5oZWFkZXItbmF2IC5tYWluLW5hdiBsaS5tb3JlLWl0ZW0gbGknKVxyXG5cdFx0XHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0XHQvLyBBZGQgdGhlIG5ldyBhY3RpdmUgY2xhc3Nlc1xyXG5cdFx0XHRcdFx0XHQkKG1hdGNoSXRlbVJvb3QpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KCdsaScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0XHRcdC8vIEFkZCBhY3RpdmUgdG8gbmF2LWwyXHJcblx0XHRcdFx0XHRcdCQobWF0Y2hMMkl0ZW1Sb290KS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG5cclxuXHQvKlxyXG5cdCogQ2FsY3VsYXRlIHdpZHRoIG9mIG5hdmJhciBvbiBtaW5pbWlzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiBsZW5ndGggb2YgdXRpbGl0aWVzIGJhclxyXG5cdCovXHJcblx0ZnVuY3Rpb24gY2FsY1dpZHRoTWluaW1pc2VkKCkge1xyXG5cclxuXHRcdHZhciBoZWFkZXIgPSAkKCcuZ2xvYmFsLWhlYWRlci5taW5pbWlzZWQnKSxcclxuXHRcdFx0aGVhZGVyV2lkdGggPSBoZWFkZXIuZmluZCgnLmhlYWRlci1tYWluIC5oZWFkZXItY29udGFpbmVyJykud2lkdGgoKSxcclxuXHRcdFx0aWNvbldpZHRoID0gNjAsIC8vV2lkdGggb2Ygc2luZ2xlIGljb24gaW5jbHVkaW5nIG1hcmdpbnNcclxuXHRcdFx0dXRpbGl0aWVzQmFyID0gaGVhZGVyLmZpbmQoJy51dGlsaXRpZXMnKS53aWR0aCgpLFxyXG5cdFx0XHR1dGlsaXRpZXNCYXJMaXN0ID0gaGVhZGVyLmZpbmQoJy51dGlsaXRpZXMgdWwnKS53aWR0aCgpLFxyXG5cdFx0XHRwcmltYXJ5bGlua3NXaWR0aCA9IHV0aWxpdGllc0JhciAtIHV0aWxpdGllc0Jhckxpc3QsXHJcblx0XHRcdGljb25zV2lkdGggPSBpY29uV2lkdGggKiAoaGVhZGVyLmZpbmQoJy51dGlsaXRpZXMgbGknKS5sZW5ndGgpLFxyXG5cdFx0XHR1dGlsaXRpZXNCYXJNaW4gPSBwcmltYXJ5bGlua3NXaWR0aCArIGljb25zV2lkdGg7IC8vIFdpZHRoIG9mIG1pbmltaXNlZCB1dGlsaXRpZXMgYmFyXHJcblxyXG5cdFx0Ly8gQ2FsY3VsYXRlIGFuZCBhc3NpZ24gbmV3IHdpZHRoIHRvIG5hdmlnYXRpb24gYmFyXHJcblx0XHR2YXIgbmV3TmF2V2lkdGggPSBoZWFkZXJXaWR0aCAtIHV0aWxpdGllc0Jhck1pbjtcclxuXHJcblx0XHRoZWFkZXIuZmluZCgnLmhlYWRlci1uYXYgLm1haW4tbmF2Jykud2lkdGgobmV3TmF2V2lkdGgpO1xyXG5cclxuXHR9XHJcblxyXG5cdC8qXHJcblx0KiBBY3Rpb25zIG9uIGluaXRpYWwgY2xpY2sgb2YgbWFpbiBuYXZpZ2F0aW9uIGl0ZW0gKHRhYmxldClcclxuXHQqL1xyXG5cclxuXHRmdW5jdGlvbiBjaGFuZ2VNYWluTmF2Rm9ybWF0KGVsKSB7XHJcblxyXG5cdFx0ZWwucGFyZW50cygnLmhlYWRlci1uYXYnKS5hZGRDbGFzcygnbWFpbi1uYXYtc2VsZWN0ZWQnKTtcclxuXHRcdGVsLnBhcmVudHMoJ3VsJykuYWRkQ2xhc3MoJ25vcmlnaHRib3JkZXInKTtcclxuXHRcdGVsLmFkZENsYXNzKCdtYWluLW5hdi1saW5rLWZvY3VzIG5vLWxpbmstaGlnaGxpZ2h0Jyk7XHJcblxyXG5cdFx0ZWwucGFyZW50KCkuc2libGluZ3MoKVxyXG5cdFx0XHQgICAgICAgLmZpbmQoJ2EnKVxyXG5cdFx0XHQgICAgICAgLnJlbW92ZUNsYXNzKCdtYWluLW5hdi1saW5rLWZvY3VzJylcclxuXHRcdFx0ICAgICAgIC5hZGRDbGFzcygnbm8tbGluay1oaWdobGlnaHQnKTtcclxuXHJcblx0XHRlbC5jbG9zZXN0KCd1bCcpLmZpbmQoJ2xpJykuYWRkQ2xhc3MoJ2xpc3QtYWN0aXZhdGVkJyk7XHJcblx0fVxyXG5cclxuXHQvKlxyXG5cdCogUmVzZXQgbmF2aWdhdGlvbiBpdGVtIHN0eWxpbmcgdG8gaW5pdGlhbCAodGFibGV0KVxyXG5cdCovXHJcblxyXG5cdGZ1bmN0aW9uIHJlc2V0TWFpbk5hdkZvcm1hdCgpIHtcclxuXHJcblx0XHR2YXIgJGVsID0gJCgnLmdsb2JhbC1oZWFkZXIgLmhlYWRlci1uYXYgLm1haW4tbmF2ID4gdWwgPiBsaSA+IGEnKTtcclxuXHJcblx0XHRcdCRlbC5wYXJlbnRzKCcuaGVhZGVyLW5hdicpLnJlbW92ZUNsYXNzKCdtYWluLW5hdi1zZWxlY3RlZCcpO1xyXG5cdFx0XHQkZWwucGFyZW50cygndWwnKS5yZW1vdmVDbGFzcygnbm9yaWdodGJvcmRlcicpO1xyXG5cdFx0XHQkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2V4dHJhLWhlaWdodCcpO1xyXG5cdFx0XHQkZWwucmVtb3ZlQ2xhc3MoJ21haW4tbmF2LWxpbmstZm9jdXMgbm8tbGluay1oaWdobGlnaHQnKTtcclxuXHRcdFx0JGVsLmNsb3Nlc3QoJ3VsJykuZmluZCgnbGknKS5yZW1vdmVDbGFzcygnbGlzdC1hY3RpdmF0ZWQnKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBIZWFkZXI7XHJcblxyXG59KGpRdWVyeSkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSGVhZGVyO1xyXG4iLCIvKipcclxuICogSWNvblxyXG4gKiBAbW9kdWxlIEljb25cclxuICogQHZlcnNpb24gMS4xMy4wXHJcbiAqL1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL3NlcnZpY2VzL2NvbXBvbmVudCc7XHJcbmltcG9ydCBJY29ucyBmcm9tICcuLi9zZXJ2aWNlcy9pY29ucyc7XHJcblxyXG5jb25zdCBQUkVGSVggPSAnaWNvbic7XHJcbmNvbnN0IEVNQkVEX0FUVFIgPSAnZGF0YS1pY29uLWVtYmVkJztcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgSWNvbiBjb21wb25lbnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5jbGFzcyBJY29uIHtcclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXNlIEljb25cclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOb2RlfSBlbCAtIGVsZW1lbnQgdG8gZW1iZWQgU1ZHIGluIHRvXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNzc05hbWUgLSBPcHRpb25hbDogbmFtZSBvZiBjc3MgZmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBpY29uc1xyXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59IHN1Y2Nlc3NcclxuXHQgKi9cclxuXHRjb25zdHJ1Y3RvcihlbCkge1xyXG5cdFx0Ly8gUmVnaXN0ZXIgY29tcG9uZW50XHJcblx0XHR0aGlzLnN1Y2Nlc3MgPSBDb21wb25lbnQucmVnaXN0ZXJDb21wb25lbnQoZWwsIHRoaXMpO1xyXG5cdFx0aWYgKCF0aGlzLnN1Y2Nlc3MpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHQvLyBTdG9yZSBjb250YWluaW5nIGVsZW1lbnRcclxuXHRcdHRoaXMuX2VsID0gZWw7XHJcblxyXG5cdFx0Y29uc3QgbmFtZSA9IHRoaXMuX2dldEljb25OYW1lKCk7XHJcblx0XHRpZiAoIW5hbWUpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRjb25zdCBpY29uID0gSWNvbnMuZ2V0SWNvbihuYW1lKTtcclxuXHRcdGlmICghaWNvbikgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuc3VjY2VzcyA9IHRoaXMuX2VtYmVkU1ZHKGljb24uc3ZnKTtcclxuXHRcdHJldHVybiB0aGlzLnN1Y2Nlc3M7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgaWNvbiBuYW1lXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcmV0dXJuIHtTdHJpbmd9IEljb24gbmFtZVxyXG5cdCAqL1xyXG5cdF9nZXRJY29uTmFtZSgpIHtcclxuXHRcdGZvciAoY29uc3QgYyBvZiBBcnJheS5mcm9tKHRoaXMuX2VsLmNsYXNzTGlzdCkpIHtcclxuXHRcdFx0aWYgKGMuaW5kZXhPZihgJHtQUkVGSVh9LWApID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuIGMucmVwbGFjZShgJHtQUkVGSVh9LWAsICcnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogRW1iZWQgU1ZHXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3ZnIC0gU1ZHIGFzIGEgc3RyaW5nXHJcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xyXG5cdCAqL1xyXG5cdF9lbWJlZFNWRyhzdmcpIHtcclxuXHRcdHRoaXMuX2VsLmlubmVySFRNTCA9IHN2ZztcclxuXHRcdHRoaXMuX2VsLnJlbW92ZUF0dHJpYnV0ZShFTUJFRF9BVFRSKTtcclxuXHRcdHRoaXMuX2VsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9ICdub25lJztcclxuXHRcdHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLnN0eWxlLndpZHRoID0gdGhpcy5fZWwuY2xpZW50V2lkdGg7XHJcblx0XHR0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKCdzdmcnKS5zdHlsZS5oZWlnaHQgPSB0aGlzLl9lbC5jbGllbnRIZWlnaHQ7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEljb247XHJcbiIsIi8qKlxyXG4gKiBNb2RhbFxyXG4gKiBAbW9kdWxlIE1vZGFsXHJcbiAqIEB2ZXJzaW9uIDEuMTMuMFxyXG4gKi9cclxuXHJcbmltcG9ydCBDb21wb25lbnQgZnJvbSAnLi4vc2VydmljZXMvY29tcG9uZW50JztcclxuaW1wb3J0IFV0aWwgZnJvbSAnLi4vc2VydmljZXMvdXRpbCc7XHJcblxyXG4vLyBNb2RhbCBBcmlhIEF0dHJpYnV0ZVxyXG5jb25zdCBBUklBX0hJRERFTiA9ICdhcmlhLWhpZGRlbic7XHJcblxyXG4vLyBNb2RhbCBEYXRhIERpc21pc3MgQXR0cmlidXRlc1xyXG5jb25zdCBEQVRBX0RJU01JU1MgPSAnW2RhdGEtbW9kYWwtZGlzbWlzc10nO1xyXG5cclxuLy8gTW9kYWwgQ2xhc3Nlc1xyXG5jb25zdCBDTEFTU05BTUUgPSB7XHJcblx0T1BFTjogJ21vZGFsLW9wZW4nLFxyXG5cdFNIT1c6ICdtb2RhbC1zaG93JyxcclxuXHRBTklNQVRFOiAnbW9kYWwtY29udGVudC1hbmltYXRpb24nLFxyXG5cdEJBQ0tEUk9QOiAnbW9kYWwnLFxyXG5cdERJQUxPRzogJ21vZGFsLWRpYWxvZycsXHJcblx0Q09OVEVOVDogJ21vZGFsLWNvbnRlbnQnLFxyXG59O1xyXG4vLyBFdmVudCBLZXlzXHJcbmNvbnN0IEtFWSA9IHtcclxuXHRUQUI6IDksXHJcblx0RVNDOiAyNyxcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBuZXcgTW9kYWwgY29tcG9uZW50XHJcbiAqIEBjbGFzc1xyXG4gKi9cclxuXHJcbmNsYXNzIE1vZGFsIHtcclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXNlIE1vZGFsXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7Tm9kZX0gZWwgLSBDb250YWluaW5nIE1vZGFsIGVsZW1lbnRcclxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSBzdWNjZXNzXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoZWwpIHtcclxuXHRcdC8vIFJlZ2lzdGVyIGNvbXBvbmVudFxyXG5cdFx0dGhpcy5zdWNjZXNzID0gQ29tcG9uZW50LnJlZ2lzdGVyQ29tcG9uZW50KGVsLCB0aGlzKTtcclxuXHRcdGlmICghdGhpcy5zdWNjZXNzKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0Ly8gQ2FsbGJhY2tzIG9iamVjdFxyXG5cdFx0dGhpcy5fY2FsbGJhY2tzID0ge307XHJcblxyXG5cdFx0Ly8gU3RvcmUgY29udGFpbmluZyBlbGVtZW50XHJcblx0XHR0aGlzLl9lbCA9IGVsO1xyXG5cclxuXHRcdC8vIFN0b3JlIG1vZGFsIHRyYW5zaXRpb24gc3BlZWRcclxuXHRcdHRoaXMuX3RyYW5zaXRpb25TcGVlZCA9IFV0aWwuZ2V0VHJhbnNpdGlvblNwZWVkKCdtZWRpdW0nKTtcclxuXHJcblx0XHQvLyBTdG9yZSBodG1sIGVsZW1lbnQgdGFnXHJcblx0XHR0aGlzLl9odG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xyXG5cclxuXHRcdC8vIFN0b3JlIG1vZGFsIElkXHJcblx0XHR0aGlzLl9JZCA9IHRoaXMuX2VsLmlkO1xyXG5cclxuXHRcdC8vIEdldCBhcnJheSBvZiBhbGwgZWxlbWVudHMgd2l0aCBbZGF0YS10YXJnZXQ9XCJ0aGlzLl9JZFwiXVxyXG5cdFx0dGhpcy5fdHJpZ2dlckVsZW1lbnQgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXHJcblx0XHRcdGBbZGF0YS1tb2RhbC10YXJnZXQ9XCIke3RoaXMuX0lkfVwiXWBcclxuXHRcdCkpO1xyXG5cclxuXHRcdC8vIEdldCBhcnJheSBvZiBhbGwgZWxlbWVudCB3aXRoIGRhdGFzZXQgZGlzbWlzc1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnRzID0gQXJyYXkuZnJvbSh0aGlzLl9lbC5xdWVyeVNlbGVjdG9yQWxsKGAke0RBVEFfRElTTUlTU31gKSk7XHJcblxyXG5cdFx0Ly8gR2V0IG1vZGFsIGNvbnRlbnQgc2VjdGlvblxyXG5cdFx0dGhpcy5fY29udGVudFNlY3Rpb24gPSB0aGlzLl9lbC5xdWVyeVNlbGVjdG9yKGAuJHtDTEFTU05BTUUuQ09OVEVOVH1gKTtcclxuXHJcblx0XHQvLyBHZXQgYXJyYXkgb2YgYWxsIHRhYmFibGUgZWxlbWVudHMgd2l0aGluIHRoZSBtb2RhbCBjb250ZW50IHNlY3Rpb25cclxuXHRcdHRoaXMuX3RhYmFibGVFbGVtZW50cyA9IEFycmF5LmZyb20odGhpcy5fZWwucXVlcnlTZWxlY3RvckFsbChgXHJcblx0XHRcdGFbaHJlZl0sXHJcblx0XHRcdGFyZWFbaHJlZl0sXHJcblx0XHRcdGlucHV0Om5vdChbZGlzYWJsZWRdKSxcclxuXHRcdFx0c2VsZWN0Om5vdChbZGlzYWJsZWRdKSxcclxuXHRcdFx0dGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLFxyXG5cdFx0XHRidXR0b246bm90KFtkaXNhYmxlZF0pLFxyXG5cdFx0XHRbdGFiaW5kZXg9XCIwXCJdXHJcblx0XHRgKSk7XHJcblxyXG5cdFx0Ly8gU3RvcmUgZmlyc3QgdGFiYWJsZSBlbGVtZW50XHJcblx0XHR0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbSA9IHRoaXMuX3RhYmFibGVFbGVtZW50c1swXTtcclxuXHJcblx0XHQvLyBTdG9yZSBsYXN0IHRhYmFibGUgZWxlbWVudFxyXG5cdFx0dGhpcy5sYXN0Rm9jdXNhYmxlRWxlbSA9IHRoaXMuX3RhYmFibGVFbGVtZW50c1t0aGlzLl90YWJhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV07XHJcblxyXG5cdFx0Ly8gSW5pdCBkZWZhdWx0IG1vZGFsIHN0YXRlXHJcblx0XHR0aGlzLl9pbml0RGVmYXVsdFN0YXRlKCk7IC8vIGF0dGFjaCBldmVudHNcclxuXHRcdHRoaXMuX2V2ZW50cygpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzLnN1Y2Nlc3M7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBJbml0aWFsaXNlIEFSSUEgYXR0cmlidXRlXHJcblx0ICogQWRkICdtb2RhbC1jbG9zZScgY2xhc3MgdG8gbW9kYWxcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdF9pbml0RGVmYXVsdFN0YXRlKCkge1xyXG5cdFx0dGhpcy5fY29udGVudFNlY3Rpb24uc2V0QXR0cmlidXRlKGAke0FSSUFfSElEREVOfWAsICd0cnVlJyk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBdHRhY2ggY2xpY2sgZXZlbnRzXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfZXZlbnRzKCkge1xyXG5cdFx0LyoqXHJcblx0XHQgKiBBdHRhY2ggY2xpY2sgZXZlbnQgdG8gdGhpcy5fdHJpZ2dlckVsZW1lbnRcclxuXHRcdCAqIEBwYXJhbSB7RXZlbnR9IGUgLSBDbGljayBldmVudFxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl90cmlnZ2VyRWxlbWVudC5mb3JFYWNoKGUgPT4gZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHRoaXMuc2hvd01vZGFsKCk7XHJcblx0XHR9KSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBdHRhY2ggY2xpY2sgZXZlbnQgdG8gdGhpcy5fZGlzbWlzc0VsZW1lbnRzIGFycmF5XHJcblx0XHQgKiBAcGFyYW0ge0V2ZW50fSBlIC0gQ2xpY2sgZXZlbnRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fZGlzbWlzc0VsZW1lbnRzLmZvckVhY2goZSA9PiBlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZSA9PiB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dGhpcy5oaWRlTW9kYWwoZSk7XHJcblx0XHR9KSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBdHRhY2ggY2xpY2sgZXZlbnQgdG8gbW9kYWwgYmFja2Ryb3BcclxuXHRcdCAqIEBwYXJhbSB7RXZlbnR9IGUgLSBDbGljayBldmVudFxyXG5cdFx0ICovXHJcblx0XHR0aGlzLl9lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdFx0XHRpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKENMQVNTTkFNRS5CQUNLRFJPUCkgfHxcclxuXHRcdFx0XHRlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoQ0xBU1NOQU1FLkRJQUxPRykpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGVNb2RhbCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIEF0dGFjaCBrZXlib2FyZCBldmVudHMgdG8gbW9kYWwgY29udGVudCBzZWN0aW9uXHJcblx0XHQgKiBAcGFyYW0ge0V2ZW50fSBlIC0gQ2xpY2sgZXZlbnRcclxuXHRcdCAqL1xyXG5cdFx0dGhpcy5fY29udGVudFNlY3Rpb24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdFx0XHRzd2l0Y2ggKGUua2V5Q29kZSkge1xyXG5cdFx0XHRjYXNlIEtFWS5UQUI6XHJcblx0XHRcdFx0aWYgKHRoaXMuX3RhYmFibGVFbGVtZW50cy5sZW5ndGggPT09IDEpIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKGUuc2hpZnRLZXkpIHtcclxuXHRcdFx0XHRcdHRoaXMuX2hhbmRsZUJhY2t3YXJkVGFiKGUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLl9oYW5kbGVGb3J3YXJkVGFiKGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBLRVkuRVNDOlxyXG5cdFx0XHRcdHRoaXMuaGlkZU1vZGFsKGUpO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZCBjYWxsYmFjayBmb3IgcHVibGljIG1vZGFsIG1ldGhvZHNcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XHJcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuXHQgKi9cclxuXHRhZGRDYWxsYmFjayhldmVudCwgY2FsbGJhY2spIHtcclxuXHRcdGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRpZiAoIXRoaXMuX2NhbGxiYWNrc1tldmVudF0pIHtcclxuXHRcdFx0XHR0aGlzLl9jYWxsYmFja3NbZXZlbnRdID0gW107XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5fY2FsbGJhY2tzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFB1YmxpYyBtZXRob2QgdG8gc2hvdyBtb2RhbFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRzaG93TW9kYWwoKSB7XHJcblx0XHQvLyBVcGRhdGUgbW9kYWxcclxuXHRcdHRoaXMuX2NvbnRlbnRTZWN0aW9uLnNldEF0dHJpYnV0ZShgJHtBUklBX0hJRERFTn1gLCAnZmFsc2UnKTtcclxuXHRcdHRoaXMuX2VsLmNsYXNzTGlzdC5hZGQoYCR7Q0xBU1NOQU1FLlNIT1d9YCk7XHJcblxyXG5cdFx0Ly8gQWRkIG1vZGFsLW9wZW4gY2xhc3MgdG8gaHRtbCBlbGVtZW50IHRhZyB0byBkaXNhYmxlIHBhZ2Ugc2Nyb2xsXHJcblx0XHR0aGlzLl9odG1sLmNsYXNzTGlzdC5hZGQoYCR7Q0xBU1NOQU1FLk9QRU59YCk7XHJcblxyXG5cdFx0Ly8gQWRkIHRyYW5zaXRpb24gY2xhc3NcclxuXHRcdHRoaXMuX2NvbnRlbnRTZWN0aW9uLmNsYXNzTGlzdC5hZGQoYCR7Q0xBU1NOQU1FLkFOSU1BVEV9YCk7XHJcblxyXG5cdFx0LyogU2V0VGltZW91dCB0byBhbGxvdyB0cmFuc2l0aW9uIHRvIGNvbXBsZXRlXHJcblx0XHQgKiBTZXQgZm9jdXMgdG8gZmlyc3QgdGFiYWJsZSBlbGVtZW50XHJcblx0XHQqL1xyXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbSkge1xyXG5cdFx0XHRcdHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtLmZvY3VzKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIHRoaXMuX3RyYW5zaXRpb25TcGVlZCk7XHJcblxyXG5cdFx0Ly8gU3RvcmUgb3JpZ2luYWwgZm9jdXMgZWxlbWVudFxyXG5cdFx0dGhpcy5mb2N1c2VkRWxlbUJlZm9yZU9wZW4gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuXHRcdC8vIENhbGwgY2FsbGJhY2tcclxuXHRcdGlmICh0aGlzLl9jYWxsYmFja3Muc2hvdykgdGhpcy5fY2FsbGJhY2tzLnNob3cuZm9yRWFjaChmbiA9PiBmbigpKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFB1YmxpYyBtZXRob2QgdG8gaGlkZSBtb2RhbFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRoaWRlTW9kYWwoKSB7XHJcblx0XHQvLyBVcGRhdGUgbW9kYWxcclxuXHRcdHRoaXMuX2NvbnRlbnRTZWN0aW9uLnNldEF0dHJpYnV0ZShgJHtBUklBX0hJRERFTn1gLCAndHJ1ZScpO1xyXG5cdFx0dGhpcy5fZWwuY2xhc3NMaXN0LnJlbW92ZShgJHtDTEFTU05BTUUuU0hPV31gKTtcclxuXHJcblx0XHQvLyBSZW1vdmUgbW9kYWwtb3BlbiBjbGFzcyBmcm9tIGh0bWwgZWxlbWVudCB0YWcgdG8gZW5hYmxlIHBhZ2Ugc2Nyb2xsXHJcblx0XHR0aGlzLl9odG1sLmNsYXNzTGlzdC5yZW1vdmUoYCR7Q0xBU1NOQU1FLk9QRU59YCk7XHJcblxyXG5cdFx0Ly8gUmVtb3ZlIHRyYW5zaXRpb24gY2xhc3NcclxuXHRcdHRoaXMuX2NvbnRlbnRTZWN0aW9uLmNsYXNzTGlzdC5yZW1vdmUoYCR7Q0xBU1NOQU1FLkFOSU1BVEV9YCk7XHJcblxyXG5cdFx0Ly8gU2V0IGZvY3VzIHRvIHRoZSBvcmlnaW5hbCBmb2N1cyBlbGVtZW50XHJcblx0XHRpZiAodGhpcy5mb2N1c2VkRWxlbUJlZm9yZU9wZW4pIHtcclxuXHRcdFx0dGhpcy5mb2N1c2VkRWxlbUJlZm9yZU9wZW4uZm9jdXMoKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDYWxsIGNhbGxiYWNrXHJcblx0XHRpZiAodGhpcy5fY2FsbGJhY2tzLmhpZGUpIHRoaXMuX2NhbGxiYWNrcy5oaWRlLmZvckVhY2goZm4gPT4gZm4oKSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBQcml2YXRlIG1ldGhvZCB0byBoYW5kbGUgYmFja3dhcmQgdGFiXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBlIC0gQ2xpY2sgZXZlbnRcclxuXHQgKi9cclxuXHRfaGFuZGxlQmFja3dhcmRUYWIoZSkge1xyXG5cdFx0aWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0dGhpcy5sYXN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogUHJpdmF0ZSBtZXRob2QgdG8gaGFuZGxlIGZvcndhcmQgdGFiXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge0V2ZW50fSBlIC0gQ2xpY2sgZXZlbnRcclxuXHQgKi9cclxuXHRfaGFuZGxlRm9yd2FyZFRhYihlKSB7XHJcblx0XHRpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtLmZvY3VzKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBNb2RhbDtcclxuIiwiLyoqXHJcbiAqIFNraXBsaW5rXHJcbiAqIEBtb2R1bGUgU2tpcGxpbmtcclxuICogQHZlcnNpb24gMS4xMS4wXHJcbiAqL1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL3NlcnZpY2VzL2NvbXBvbmVudCc7XHJcblxyXG5jb25zdCBGT0NVU19TVEFURSA9ICdza2lwbGluay1mb2N1cyc7XHJcbmNvbnN0IEhJRERFTl9TVEFURSA9ICdza2lwbGluay1oaWRkZW4nO1xyXG5cclxuLyoqXHJcbiAqIENyZWF0ZSBhIG5ldyBTa2lwbGluayBjb21wb25lbnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5jbGFzcyBTa2lwbGluayB7XHJcblx0LyoqXHJcblx0ICogSW5pdGlhbGlzZSBTa2lwbGlua1xyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge05vZGV9IGVsIC0gQ29udGFpbmluZyBTa2lwbGluayBlbGVtZW50XHJcblx0ICogQHBhcmFtIHtOb2RlfSBzdGF0ZUVsIC0gRWxlbWVudCB0byBhZGQgc3RhdGUgY2xhc3MgdG9cclxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSBzdWNjZXNzXHJcblx0ICovXHJcblx0Y29uc3RydWN0b3IoZWwsIHN0YXRlRWwpIHtcclxuXHRcdC8vIFJlZ2lzdGVyIGNvbXBvbmVudFxyXG5cdFx0dGhpcy5zdWNjZXNzID0gQ29tcG9uZW50LnJlZ2lzdGVyQ29tcG9uZW50KGVsLCB0aGlzKTtcclxuXHRcdGlmICghdGhpcy5zdWNjZXNzKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0Ly8gU3RvcmUgY29udGFpbmluZyBlbGVtZW50XHJcblx0XHR0aGlzLl9lbCA9IGVsO1xyXG5cdFx0Ly8gU3RvcmUgZWxlbWVudCB0byBhZGQgc3RhdGUgY2xhc3MgdG8gKG9yIGVsIGlmIG5vdCBkZWZpbmVkKVxyXG5cdFx0dGhpcy5fc3RhdGVFbCA9IHN0YXRlRWwgfHwgZWw7XHJcblxyXG5cdFx0dGhpcy5fc3RhdGVFbC5jbGFzc0xpc3QuYWRkKEhJRERFTl9TVEFURSk7XHJcblx0XHR0aGlzLl9hdHRhY2hMaW5rRXZlbnRzKCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXMuc3VjY2VzcztcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEF0dGFjaCBmb2N1cyBhbmQgYmx1ciBldmVudHMgdG8gbGlua3NcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdF9hdHRhY2hMaW5rRXZlbnRzKCkge1xyXG5cdFx0Y29uc3QgbGlua3MgPSBBcnJheS5mcm9tKHRoaXMuX2VsLnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKSk7XHJcblxyXG5cdFx0bGlua3MuZm9yRWFjaCgobGluaykgPT4ge1xyXG5cdFx0XHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4gdGhpcy5fc2hvd1NraXBsaW5rKCkpO1xyXG5cdFx0XHRsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCAoKSA9PiB0aGlzLl9oaWRlU2tpcGxpbmsoKSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIFNob3cgc2tpcGxpbmsgY29udGFpbmVyXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfc2hvd1NraXBsaW5rKCkge1xyXG5cdFx0dGhpcy5fc3RhdGVFbC5jbGFzc0xpc3QuYWRkKEZPQ1VTX1NUQVRFKTtcclxuXHRcdHRoaXMuX3N0YXRlRWwuY2xhc3NMaXN0LnJlbW92ZShISURERU5fU1RBVEUpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSGlkZSBza2lwa2lua3MgY29udGFpbmVyXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfaGlkZVNraXBsaW5rKCkge1xyXG5cdFx0dGhpcy5fc3RhdGVFbC5jbGFzc0xpc3QucmVtb3ZlKEZPQ1VTX1NUQVRFKTtcclxuXHRcdHRoaXMuX3N0YXRlRWwuY2xhc3NMaXN0LmFkZChISURERU5fU1RBVEUpO1xyXG5cdH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2tpcGxpbms7XHJcbiIsIi8qKlxyXG4gKiBUYWJcclxuICogQG1vZHVsZSBUYWJcclxuICogQHZlcnNpb24gMS4xMy4wXHJcbiAqL1xyXG5pbXBvcnQgVXRpbCBmcm9tICcuLi9zZXJ2aWNlcy91dGlsJztcclxuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuLi9zZXJ2aWNlcy9jb21wb25lbnQnO1xyXG5cclxuY29uc3QgTElTVF9DTEFTUyA9ICd0YWItbGlzdCc7XHJcbmNvbnN0IExJU1RfRFJPUERPV05fQ0xBU1MgPSAndGFiLWxpc3QtZHJvcGRvd24nO1xyXG5jb25zdCBQQU5FTF9DTEFTUyA9ICd0YWItcGFuZWwnO1xyXG5jb25zdCBDT05URU5UX0NMQVNTID0gJ3RhYi1jb250ZW50JztcclxuY29uc3QgQ09OVEVOVF9DTE9TSU5HX0NMQVNTID0gJ3RhYi1jb250ZW50LWNsb3NpbmcnO1xyXG5jb25zdCBDT05URU5UX09QRU5JTkdfQ0xBU1MgPSAndGFiLWNvbnRlbnQtb3BlbmluZyc7XHJcbmNvbnN0IEhFQURJTkdfQ0xBU1MgPSAndGFiLWhlYWRpbmcnO1xyXG5jb25zdCBIRUFESU5HX0FDVElWRV9DTEFTUyA9ICd0YWItaGVhZGluZy1hY3RpdmUnO1xyXG5jb25zdCBEQVRBID0ge1xyXG5cdEFDVElWRTogJ2RhdGEtdGFiLWFjdGl2ZScsXHJcbn07XHJcblxyXG4vLyBFbmFibGUgZHJvcGRvd24gb24gbW9iaWxlXHJcbmNvbnN0IE1PQklMRV9EUk9QRE9XTiA9IHRydWU7XHJcblxyXG4vKipcclxuICogQ3JlYXRlIGEgbmV3IFRhYiBjb21wb25lbnRcclxuICogQGNsYXNzXHJcbiAqL1xyXG5jbGFzcyBUYWIge1xyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpc2UgVGFiXHJcblx0ICogQHB1YmxpY1xyXG5cdCAqIEBwYXJhbSB7Tm9kZX0gZWwgLSBDb250YWluaW5nIFRhYiBlbGVtZW50XHJcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gc3VjY2Vzc1xyXG5cdCAqL1xyXG5cdGNvbnN0cnVjdG9yKGVsKSB7XHJcblx0XHQvLyBSZWdpc3RlciBjb21wb25lbnRcclxuXHRcdHRoaXMuc3VjY2VzcyA9IENvbXBvbmVudC5yZWdpc3RlckNvbXBvbmVudChlbCwgdGhpcyk7XHJcblx0XHRpZiAoIXRoaXMuc3VjY2VzcykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdC8vIFN0b3JlIGNvbnRhaW5pbmcgZWxlbWVudFxyXG5cdFx0dGhpcy5fZWwgPSBlbDtcclxuXHRcdC8vIFN0b3JlIGFycmF5IG9mIGVsZW1lbnQgSURzXHJcblx0XHR0aGlzLl9pZHMgPSBbXTtcclxuXHRcdC8vIFN0b3JlIGludGVyYWN0aXZlIGVsZW1lbnRzXHJcblx0XHR0aGlzLl9saXN0Q29udGFpbmVyID0gZWwucXVlcnlTZWxlY3RvcihgLiR7TElTVF9DTEFTU31gKTtcclxuXHRcdHRoaXMuX3BhbmVsQ29udGFpbmVyID0gZWwucXVlcnlTZWxlY3RvcihgLiR7UEFORUxfQ0xBU1N9YCk7XHJcblx0XHR0aGlzLl9saXN0SXRlbXMgPSBBcnJheS5mcm9tKGVsLnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke0xJU1RfQ0xBU1N9IGFgKSk7XHJcblx0XHR0aGlzLl9wYW5lbEl0ZW1zID0gQXJyYXkuZnJvbShlbC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtDT05URU5UX0NMQVNTfWApKTtcclxuXHRcdC8vIFN0b3JlIGFjdGl2ZSBwYW5lbFxyXG5cdFx0dGhpcy5fYWN0aXZlUGFuZWwgPSAtMTtcclxuXHRcdC8vIElzIGNvbXBvbmVudCB0cmFuc2l0aW9uaW5nXHJcblx0XHR0aGlzLl90cmFuc2l0aW9uaW5nID0gZmFsc2U7XHJcblx0XHQvLyBJcyBkcm9wZG93biBlbmFibGVkXHJcblx0XHR0aGlzLl9kcm9wZG93bkVuYWJsZWQgPSBmYWxzZTtcclxuXHRcdC8vIEVuYWJsZSB0cmFuc2l0aW9uc1xyXG5cdFx0Ly8gRm9yY2UgZGlzYWJsZSB0cmFuc2l0aW9ucyBmb3Igbm93XHJcblx0XHQvLyB0aGlzLl91c2VUcmFuc2l0aW9ucyA9IFV0aWwuZ2V0RW5hYmxlVHJhbnNpdGlvbnMoKTtcclxuXHRcdHRoaXMuX3VzZVRyYW5zaXRpb25zID0gZmFsc2U7XHJcblx0XHR0aGlzLl90cmFuc2l0aW9uU3BlZWQgPSB0aGlzLl91c2VUcmFuc2l0aW9ucyA/IFV0aWwuZ2V0VHJhbnNpdGlvblNwZWVkKCdtZWRpdW0nKSA6IDA7XHJcblxyXG5cdFx0Ly8gR2VuZXJhdGUgSURzXHJcblx0XHR0aGlzLl9nZW5lcmF0ZUlEcygpO1xyXG5cclxuXHRcdC8vIEluaXRpYWxpc2UgQVJJQSBhdHRyaWJ1dGVzXHJcblx0XHR0aGlzLl9pbml0QXJpYUF0dHJpYnV0ZXMoKTtcclxuXHJcblx0XHQvLyBTaG93IHRhYiBsaXN0XHJcblx0XHR0aGlzLl9saXN0Q29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0Ly8gUmVtb3ZlIG5vbi1qcyBIZWFkaW5nc1xyXG5cdFx0QXJyYXkuZnJvbSh0aGlzLl9wYW5lbENvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKGAuJHtIRUFESU5HX0NMQVNTfWApKVxyXG5cdFx0XHQuZm9yRWFjaChlbCA9PiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKSk7XHJcblxyXG5cdFx0Ly8gQXR0YWNoIGV2ZW50c1xyXG5cdFx0dGhpcy5fYXR0YWNoQ2xpY2tFdmVudHMoKTtcclxuXHRcdHRoaXMuX2F0dGFjaEtleWJvYXJkRXZlbnRzKCk7XHJcblxyXG5cdFx0Ly8gV2F0Y2ggZm9yIHdpbmRvdyByZXNpemUgYW5kIGNvbmZpZ3VyZSBkcm9wZG93biAoaWYgZW5hYmxlZClcclxuXHRcdGlmIChNT0JJTEVfRFJPUERPV04pIHtcclxuXHRcdFx0dGhpcy5faW5pdERyb3Bkb3duKGVsKTtcclxuXHRcdFx0bGV0IHJlc2l6ZVRpbWVvdXQ7XHJcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHJlc2l6ZVRpbWVvdXQpO1xyXG5cdFx0XHRcdHJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdHRoaXMuX3RvZ2dsZURyb3Bkb3duKGVsKTtcclxuXHRcdFx0XHR9LCAyNTApO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTZXQgYW5kIG9wZW4gYWN0aXZlIHRhYlxyXG5cdFx0Y29uc3Qgb3BlblBhbmVsID0gcGFyc2VJbnQoZWwuZ2V0QXR0cmlidXRlKERBVEEuQUNUSVZFKSwgMTApIHx8IDA7XHJcblx0XHR0aGlzLl9vcGVuUGFuZWwob3BlblBhbmVsKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcy5zdWNjZXNzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogR2VuZXJhdGUgSURzIGZvciBlYWNoIHNlY3Rpb24gZnJvbSB0aGUgaHJlZlxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X2dlbmVyYXRlSURzKCkge1xyXG5cdFx0dGhpcy5fbGlzdEl0ZW1zLmZvckVhY2gobGluayA9PiB7XHJcblx0XHRcdGNvbnN0IGlkID0gbGluay5ocmVmLnNwbGl0KCcjJylbMV07XHJcblxyXG5cdFx0XHQvLyBTdG9yZSBJRHMgaW4gcHJpdmF0ZSBvYmplY3RcclxuXHRcdFx0dGhpcy5faWRzLnB1c2goe1xyXG5cdFx0XHRcdHRhYjogYCR7aWR9LXRhYmAsXHJcblx0XHRcdFx0cGFuZWw6IGlkLFxyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogSW5pdGlhbGlzZSBBUklBIGF0dHJpYnV0ZXNcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdF9pbml0QXJpYUF0dHJpYnV0ZXMoKSB7XHJcblx0XHR0aGlzLl9saXN0Q29udGFpbmVyLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWJsaXN0Jyk7XHJcblx0XHR0aGlzLl9saXN0SXRlbXMuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFiJyk7XHJcblx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuX2lkc1tpbmRleF0udGFiKTtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aGlzLl9pZHNbaW5kZXhdLnBhbmVsKTtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCBmYWxzZSk7XHJcblx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLl9wYW5lbEl0ZW1zLmZvckVhY2goKHBhbmVsLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRwYW5lbC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKTtcclxuXHRcdFx0cGFuZWwuc2V0QXR0cmlidXRlKCdpZCcsIHRoaXMuX2lkc1tpbmRleF0ucGFuZWwpO1xyXG5cdFx0XHRwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsIHRoaXMuX2lkc1tpbmRleF0udGFiKTtcclxuXHRcdFx0cGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBBdHRhY2ggY2xpY2sgZXZlbnRzXHJcblx0ICogQHByaXZhdGVcclxuXHQgKi9cclxuXHRfYXR0YWNoQ2xpY2tFdmVudHMoKSB7XHJcblx0XHR0aGlzLl9saXN0SXRlbXMuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcclxuXHRcdFx0bGluay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR0aGlzLl9vcGVuUGFuZWwoaW5kZXgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXR0YWNoIGtleWJvYXJkIGV2ZW50c1xyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X2F0dGFjaEtleWJvYXJkRXZlbnRzKCkge1xyXG5cdFx0dGhpcy5fbGlzdEl0ZW1zLmZvckVhY2goKGxpbmssIGluZGV4KSA9PiB7XHJcblx0XHRcdGxpbmsuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG5cdFx0XHRcdGlmICgvKDQwfDM5fDM4fDM3fDM2fDM1fDMyKS8udGVzdChlLmtleUNvZGUpKSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoLyg0MHwzOSkvLnRlc3QoZS5rZXlDb2RlKSkgeyAvLyBEb3duL1JpZ2h0IGFycm93XHJcblx0XHRcdFx0XHRpZiAoaW5kZXggPCB0aGlzLl9saXN0SXRlbXMubGVuZ3RoIC0gMSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9saXN0SXRlbXNbaW5kZXggKyAxXS5mb2N1cygpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5fbGlzdEl0ZW1zWzBdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmICgvKDM4fDM3KS8udGVzdChlLmtleUNvZGUpKSB7IC8vIFVwL0xlZnQgYXJyb3dcclxuXHRcdFx0XHRcdGlmIChpbmRleCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9saXN0SXRlbXNbdGhpcy5fbGlzdEl0ZW1zLmxlbmd0aCAtIDFdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLl9saXN0SXRlbXNbaW5kZXggLSAxXS5mb2N1cygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzNikgeyAvLyBIb21lIGtleVxyXG5cdFx0XHRcdFx0dGhpcy5fbGlzdEl0ZW1zWzBdLmZvY3VzKCk7XHJcblx0XHRcdFx0XHR0aGlzLl9vcGVuUGFuZWwoMCk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDM1KSB7IC8vIEVuZCBrZXlcclxuXHRcdFx0XHRcdHRoaXMuX2xpc3RJdGVtc1t0aGlzLl9saXN0SXRlbXMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcclxuXHRcdFx0XHRcdHRoaXMuX29wZW5QYW5lbCh0aGlzLl9saXN0SXRlbXMubGVuZ3RoIC0gMSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChlLmtleUNvZGUgPT09IDMyKSB7IC8vIFNwYWNlIGtleVxyXG5cdFx0XHRcdFx0dGhpcy5fb3BlblBhbmVsKGluZGV4KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbG9zZSBwYW5lbHNcclxuXHQgKiBAcHJpdmF0ZVxyXG5cdCAqL1xyXG5cdF9jbG9zZVBhbmVscygpIHtcclxuXHRcdHRoaXMuX3BhbmVsSXRlbXMuZm9yRWFjaChwYW5lbCA9PiB7XHJcblx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoQ09OVEVOVF9DTE9TSU5HX0NMQVNTKTtcclxuXHRcdFx0cGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLl9saXN0SXRlbXMuZm9yRWFjaChsaW5rID0+IHtcclxuXHRcdFx0bGluay5jbGFzc0xpc3QucmVtb3ZlKEhFQURJTkdfQUNUSVZFX0NMQVNTKTtcclxuXHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XHJcblx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBPcGVuIHBhbmVsXHJcblx0ICogQHByaXZhdGVcclxuXHQgKiBAcGFyYW0ge0ludGVnZXJ9IGluZGV4IC0gSW5kZXggb2YgdGhlIHBhbmVsIHRvIG9wZW5cclxuXHQgKi9cclxuXHRfb3BlblBhbmVsKGluZGV4KSB7XHJcblx0XHQvLyBPdmVycmlkZSBpbmRleCBpZiBhbiBpbnZhbGlkIHZhbHVlIGlzIHByb3ZpZGVkXHJcblx0XHRjb25zdCBpID0gdGhpcy5fcGFuZWxJdGVtc1tpbmRleF0gPyBpbmRleCA6IDA7XHJcblx0XHRpZiAoaSAhPT0gdGhpcy5fYWN0aXZlUGFuZWwpIHtcclxuXHRcdFx0Ly8gU3RvcCB0aGUgcHJldmlvdXMgdHJhbnNpdGlvbiBmcm9tIHJlbW92aW5nIHRoZSBjbG9zaW5nIGNsYXNzXHJcblx0XHRcdC8vIGlmIG11bHRwbGUgY2xpY2sgZXZlbnRzIG9jY3VyIGluIGEgc2hvcnQgaW50ZXJ2YWxcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KHRoaXMuX3RyYW5zaXRpb25pbmcpO1xyXG5cclxuXHRcdFx0dGhpcy5fY2xvc2VQYW5lbHMoKTtcclxuXHJcblx0XHRcdGNvbnN0IHBhbmVsID0gdGhpcy5fcGFuZWxJdGVtc1tpXTtcclxuXHRcdFx0Y29uc3QgbGluayA9IHRoaXMuX2xpc3RJdGVtc1tpXTtcclxuXHRcdFx0dGhpcy5fYWN0aXZlUGFuZWwgPSBpO1xyXG5cclxuXHRcdFx0Ly8gQWN0aXZhdGUgbmV3IGxpbmtcclxuXHRcdFx0bGluay5jbGFzc0xpc3QuYWRkKEhFQURJTkdfQUNUSVZFX0NMQVNTKTtcclxuXHJcblx0XHRcdC8vIEtlZXAgZHJvcGRvd24gaW4gc3luYyAoaWYgZW5hYmxlZClcclxuXHRcdFx0aWYgKE1PQklMRV9EUk9QRE9XTikge1xyXG5cdFx0XHRcdHRoaXMuX2Ryb3Bkb3duQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ3NlbGVjdCcpXHJcblx0XHRcdFx0XHQuc2VsZWN0ZWRJbmRleCA9IGk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFdhaXQgYW5kIG9wZW4gdGhlIG5ldyBwYW5lbFxyXG5cdFx0XHR0aGlzLl90cmFuc2l0aW9uaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0cGFuZWwuY2xhc3NMaXN0LnJlbW92ZShDT05URU5UX0NMT1NJTkdfQ0xBU1MpO1xyXG5cdFx0XHRcdHBhbmVsLmNsYXNzTGlzdC5hZGQoQ09OVEVOVF9PUEVOSU5HX0NMQVNTKTtcclxuXHRcdFx0XHR0aGlzLl90cmFuc2l0aW9uaW5nID0gc2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0XHRwYW5lbC5jbGFzc0xpc3QucmVtb3ZlKENPTlRFTlRfT1BFTklOR19DTEFTUyk7XHJcblx0XHRcdFx0XHRwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xyXG5cdFx0XHRcdFx0bGluay5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcclxuXHRcdFx0XHRcdGxpbmsuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XHJcblx0XHRcdFx0fSwgdGhpcy5fdHJhbnNpdGlvblNwZWVkKTtcclxuXHRcdFx0fSwgdGhpcy5fdHJhbnNpdGlvblNwZWVkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpc2UgZHJvcGRvd24gZWxlbWVudFxyXG5cdCAqIEBwYXJhbSB7Tm9kZX0gZWwgLSBDb250YWluaW5nIHRhYiBlbGVtZW50XHJcblx0ICovXHJcblx0X2luaXREcm9wZG93bihlbCkge1xyXG5cdFx0Ly8gQ3JlYXRlIGRyb3Bkb3duIGVsZW1lbnRcclxuXHRcdHRoaXMuX2Ryb3Bkb3duQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcblx0XHR0aGlzLl9kcm9wZG93bkNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKExJU1RfRFJPUERPV05fQ0xBU1MpO1xyXG5cdFx0dGhpcy5fZHJvcGRvd25Db250YWluZXIuaW5uZXJIVE1MID0gYFxyXG5cdFx0XHQ8c2VsZWN0IGNsYXNzPVwic2VsZWN0IHRhYi1zZWxlY3RcIj5cclxuXHRcdFx0XHQke3RoaXMuX2xpc3RJdGVtcy5tYXAoaXRlbSA9PlxyXG5cdFx0XHRcdFx0XHRgPG9wdGlvbj4ke2l0ZW0uaW5uZXJUZXh0fTwvb3B0aW9uPmApfVxyXG5cdFx0XHQ8L3NlbGVjdD5cclxuXHRcdGA7XHJcblx0XHQvLyBDaGVjayBjdXJyZW50IHdpbmRvdyB3aWR0aCBhbmQgc2hvdyBhcHByb3ByaWF0ZSBlbGVtZW50XHJcblx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPCBVdGlsLmdldEJyZWFrcG9pbnQoJ3NtJykpIHtcclxuXHRcdFx0dGhpcy5fZHJvcGRvd25FbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0dGhpcy5fbGlzdENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5fZHJvcGRvd25FbmFibGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuX2Ryb3Bkb3duQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHR9XHJcblx0XHQvLyBBdHRhY2ggZWxlbWVudCB0byBET01cclxuXHRcdGVsLmluc2VydEJlZm9yZSh0aGlzLl9kcm9wZG93bkNvbnRhaW5lciwgZWwuZmlyc3RDaGlsZCk7XHJcblx0XHQvLyBBdHRhY2ggZHJvcGRvd24gZXZlbnRzXHJcblx0XHR0aGlzLl9hdHRhY2hEcm9wZG93bkV2ZW50cygpO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogQXR0YWNoIGRyb3Bkb3duIGV2ZW50c1xyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X2F0dGFjaERyb3Bkb3duRXZlbnRzKCkge1xyXG5cdFx0Y29uc3Qgc2VsZWN0ID0gdGhpcy5fZHJvcGRvd25Db250YWluZXIucXVlcnlTZWxlY3Rvcignc2VsZWN0Jyk7XHJcblx0XHRzZWxlY3QuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLl9vcGVuUGFuZWwoc2VsZWN0LnNlbGVjdGVkSW5kZXgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBUb2dnbGUgZHJvcGRvd24gZWxlbWVudFxyXG5cdCAqIEBwcml2YXRlXHJcblx0ICovXHJcblx0X3RvZ2dsZURyb3Bkb3duKCkge1xyXG5cdFx0Y29uc3QgY3VycmVudFZpZXcgPSB0aGlzLl9kcm9wZG93bkVuYWJsZWQ7XHJcblx0XHR0aGlzLl9kcm9wZG93bkVuYWJsZWQgPSB3aW5kb3cuaW5uZXJXaWR0aCA8IFV0aWwuZ2V0QnJlYWtwb2ludCgnc20nKTtcclxuXHRcdC8vIFRyYW5zaXRpb25pbmcgdG8gRHJvcGRvd25cclxuXHRcdGlmICghY3VycmVudFZpZXcgJiYgdGhpcy5fZHJvcGRvd25FbmFibGVkKSB7XHJcblx0XHRcdHRoaXMuX2xpc3RDb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0dGhpcy5fZHJvcGRvd25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHR9XHJcblx0XHQvLyBUcmFuc2l0aW9uaW5nIHRvIFRhYlxyXG5cdFx0aWYgKGN1cnJlbnRWaWV3ICYmICF0aGlzLl9kcm9wZG93bkVuYWJsZWQpIHtcclxuXHRcdFx0dGhpcy5fZHJvcGRvd25Db250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0dGhpcy5fbGlzdENvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRhYjtcclxuIiwiLyoqXHJcbiAqIFRhYmxlXHJcbiAqIEBtb2R1bGUgVGFibGVcclxuICogQHZlcnNpb24gMS4xMy4wXHJcbiAqL1xyXG5pbXBvcnQgQ29tcG9uZW50IGZyb20gJy4uL3NlcnZpY2VzL2NvbXBvbmVudCc7XHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG52YXIgVGFibGUgPSAoZnVuY3Rpb24oJCkge1xyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBUYWJsZSBmdW5jdGlvbnNcclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0LyoqXHJcblx0ICogSW5pdGlhbGlzZSB0YWJsZVxyXG5cdCAqIEBmdW5jdGlvbiBUYWJsZVxyXG5cdCAqIEBwYXJhbSB7Tm9kZX0gQ29udGFpbmluZyB0YWJsZSBlbGVtZW50XHJcblx0ICovXHJcblx0ZnVuY3Rpb24gVGFibGUoZWwpIHtcclxuXHRcdC8vIFJlZ2lzdGVyIGNvbXBvbmVudFxyXG5cdFx0dGhpcy5zdWNjZXNzID0gQ29tcG9uZW50LnJlZ2lzdGVyQ29tcG9uZW50KGVsLCB0aGlzKTtcclxuXHRcdGlmICghdGhpcy5zdWNjZXNzKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0c2V0UmVzcG9uc2l2ZW5lc3MoJChlbCkpO1xyXG5cdFx0c2V0U29ydGluZygkKGVsKSk7XHJcblx0XHRyZXR1cm4gdGhpcy5zdWNjZXNzO1xyXG5cdH1cclxuXHJcblx0LyoqXHJcblx0ICogU2V0cyB0aCBtZXRhZGF0YSBmb3IgcmVzcG9uc2l2ZSB0YWJsZXMgb24gcGFnZSAoaGFzIHRhYmxlLXJlc3BvbnNpdmUgY2xhc3MpXHJcblx0ICogQGZ1bmN0aW9uIHNldFJlc3BvbnNpdmVuZXNzXHJcblx0ICpcclxuXHQgKi9cclxuXHRmdW5jdGlvbiBzZXRSZXNwb25zaXZlbmVzcyh0YWJsZXMpIHtcclxuXHRcdHRhYmxlcy5maWx0ZXIoJy50YWJsZS1yZXNwb25zaXZlJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIHRhYmxlKSB7XHJcblx0XHRcdHZhciBoZWFkZXJ0ZXh0ID0gW10sXHJcblx0XHRcdFx0aGVhZGVycyA9ICQodGFibGUpLmZpbmQoJ3RoJyksXHJcblx0XHRcdFx0dGFibGVib2R5ID0gJCh0YWJsZSkuZmluZCgndGJvZHknKVswXTtcclxuXHJcblx0XHRcdGZvciAodmFyIGggPSAwOyBoIDwgaGVhZGVycy5sZW5ndGg7IGgrKykge1xyXG5cdFx0XHRcdHZhciBjdXJyZW50ID0gaGVhZGVyc1toXTtcclxuXHRcdFx0XHRoZWFkZXJ0ZXh0LnB1c2goY3VycmVudC50ZXh0Q29udGVudC5yZXBsYWNlKC9cXHI/XFxufFxcci8sICcnKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yICh2YXIgciA9IDAsIHJvdzsgcm93ID0gdGFibGVib2R5LnJvd3Nbcl07IHIrKykge1xyXG5cdFx0XHRcdGZvciAodmFyIGMgPSAwLCBjb2w7IGNvbCA9IHJvdy5jZWxsc1tjXTsgYysrKSB7XHJcblx0XHRcdFx0XHR2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwidGFibGUtcmVzcG9uc2l2ZS1oZWFkXCI+JyArIGhlYWRlcnRleHRbY10gKyAnPC9kaXY+JztcclxuXHRcdFx0XHRcdGh0bWwgKz0gJzxkaXYgY2xhc3M9XCJ0YWJsZS1yZXNwb25zaXZlLWNvbnRlbnRcIj4nICsgY29sLmlubmVySFRNTCArICc8L2Rpdj4nO1xyXG5cdFx0XHRcdFx0Y29sLmlubmVySFRNTCA9IGh0bWw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEluaXRpYWxpc2Ugc29ydGluZyBvbiBzb3J0YWJsZSB0YWJsZXMgb24gcGFnZSAoaGFzIHRhYmxlLXNvcnRhYmxlIGNsYXNzKVxyXG5cdCAqIEBmdW5jdGlvbiBzZXRSZXNwb25zaXZlbmVzc1xyXG5cdCAqXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gc2V0U29ydGluZyh0YWJsZXMpIHtcclxuXHRcdHZhciBzb3J0YWJsZVRhYmxlcyA9IHRhYmxlcy5maWx0ZXIoJy50YWJsZS1zb3J0YWJsZScpO1xyXG5cdFx0Ly9DbGVhbiB1cCBpY29uc1xyXG5cdFx0c29ydGFibGVUYWJsZXMuZmluZCgndGggLnRhYmxlLWFycm93cycpLnJlbW92ZSgpO1xyXG5cclxuXHRcdC8vQXBwZW5kIHNvcnQgaWNvbnMgdG8gZXZlcnkgc29ydGFibGUgY29sdW1uICh0aCB3aGVyZSBkYXRhLXNvcnQgYXR0cmlidXRlIGlzIHByZXNlbnQpXHJcblx0XHRzb3J0YWJsZVRhYmxlcy5maW5kKCd0aFtkYXRhLXNvcnRdJykuYXBwZW5kKFxyXG5cdFx0XHQnPGRpdiBjbGFzcz1cInRhYmxlLWFycm93c1wiPicgK1xyXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJ0YWJsZS1zb3J0LWFycm93LXVwXCI+PC9zcGFuPicgK1xyXG5cdFx0XHQnPHNwYW4gY2xhc3M9XCJ0YWJsZS1zb3J0LWFycm93LWRvd25cIj48L3NwYW4+JyArXHJcblx0XHRcdCc8L2Rpdj4nKTtcclxuXHJcblx0XHQvL2luaXRpYWxpc2Ugc29ydGFibGUgdGFibGVzXHJcblx0XHRzb3J0YWJsZVRhYmxlcy5lYWNoKGZ1bmN0aW9uIChpbmRleCwgdGFibGUpIHtcclxuXHRcdFx0Ly9pZiBpdGVyYXRpbmcgdGFibGUgaGFzIHNvcnRhYmxlIGNvbHVtbnNcclxuXHRcdFx0aWYgKCQodGFibGUpLmZpbmQoJ3RoW2RhdGEtc29ydF0nKS5sZW5ndGgpIHtcclxuXHRcdFx0XHQkKHRhYmxlKS50YWJsZXNvcnRlcigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdC8vIGpRdWVyeSBmdW5jdGlvbiBleHRlbnNpb25zIGZvciB0YWJsZSBzb3J0aW5nXHJcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0JC5mbi50YWJsZXNvcnRlciA9IGZ1bmN0aW9uIChzb3J0Rm5zKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyICR0YWJsZSA9ICQodGhpcyk7XHJcblx0XHRcdHNvcnRGbnMgPSBzb3J0Rm5zIHx8IHt9O1xyXG5cdFx0XHRzb3J0Rm5zID0gJC5leHRlbmQoe30sICQuZm4udGFibGVzb3J0ZXIuZGVmYXVsdFNvcnRGbnMsIHNvcnRGbnMpO1xyXG5cdFx0XHQkdGFibGUuZGF0YSgnc29ydEZucycsIHNvcnRGbnMpO1xyXG5cclxuXHRcdFx0JHRhYmxlLm9uKCdjbGljay50YWJsZXNvcnRlcicsICd0aGVhZCB0aCcsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQkKHRoaXMpLnRhYmxlc29ydCgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCR0YWJsZS5vbignY2xpY2sudGFibGVzb3J0ZXInLCAndGhlYWQgdGggZGl2JywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdCQodGhpcykudGFibGVzb3J0KCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxuXHJcblx0Ly8gRXhwZWN0cyAkKCcjbXl0YWJsZScpLnRhYmxlc29ydGVyKCkgdG8gaGF2ZSBhbHJlYWR5IGJlZW4gY2FsbGVkLlxyXG5cdC8vIENhbGwgb24gYSB0YWJsZSBoZWFkZXIuXHJcblx0JC5mbi50YWJsZXNvcnQgPSBmdW5jdGlvbiAoZm9yY2VEaXJlY3Rpb24pIHtcclxuXHRcdHZhciAkdGhpc1RoID0gJCh0aGlzKTtcclxuXHRcdHZhciB0aEluZGV4ID0gMDsgLy8gd2UnbGwgaW5jcmVtZW50IHRoaXMgc29vblxyXG5cdFx0dmFyIGRpciA9ICQuZm4udGFibGVzb3J0ZXIuZGlyO1xyXG5cdFx0dmFyICR0YWJsZSA9ICR0aGlzVGguY2xvc2VzdCgndGFibGUnKTtcclxuXHRcdHZhciBkYXRhdHlwZSA9ICR0aGlzVGguZGF0YSgnc29ydCcpIHx8IG51bGw7XHJcblxyXG5cdFx0Ly8gTm8gZGF0YXR5cGU/IE5vdGhpbmcgdG8gZG8uXHJcblx0XHRpZiAoZGF0YXR5cGUgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIEFjY291bnQgZm9yIGNvbHNwYW5zXHJcblx0XHQkdGhpc1RoLnBhcmVudHMoJ3RyJykuZmluZCgndGgnKS5zbGljZSgwLCAkKHRoaXMpLmluZGV4KCkpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgY29scyA9ICQodGhpcykuYXR0cignY29sc3BhbicpIHx8IDE7XHJcblx0XHRcdHRoSW5kZXggKz0gcGFyc2VJbnQoY29scywgMTApO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHRoaXNUaC5wYXJlbnRzKCd0cicpLmZpbmQoJ3RoIGRpdicpLnNsaWNlKDAsICQodGhpcykucGFyZW50KCkuaW5kZXgoKSkuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBjb2xzID0gJCh0aGlzKS5hdHRyKCdjb2xzcGFuJykgfHwgMTtcclxuXHRcdFx0dGhJbmRleCArPSBwYXJzZUludChjb2xzLCAxMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgc29ydERpcjtcclxuXHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdHNvcnREaXIgPSBmb3JjZURpcmVjdGlvbjtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRzb3J0RGlyID0gZm9yY2VEaXJlY3Rpb24gfHwgJHRoaXNUaC5kYXRhKCdzb3J0LWRlZmF1bHQnKSB8fCBkaXIuQVNDO1xyXG5cdFx0XHRpZiAoJHRoaXNUaC5kYXRhKCdzb3J0LWRpcicpKSB7XHJcblx0XHRcdFx0c29ydERpciA9ICR0aGlzVGguZGF0YSgnc29ydC1kaXInKSA9PT0gZGlyLkFTQyA/IGRpci5ERVNDIDogZGlyLkFTQztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHQkdGFibGUudHJpZ2dlcignYmVmb3JldGFibGVzb3J0Jywge2NvbHVtbjogdGhJbmRleCwgZGlyZWN0aW9uOiBzb3J0RGlyfSk7XHJcblxyXG5cdFx0Ly8gTW9yZSByZWxpYWJsZSBtZXRob2Qgb2YgZm9yY2luZyBhIHJlZHJhd1xyXG5cdFx0JHRhYmxlLmNzcygnZGlzcGxheScpO1xyXG5cclxuXHRcdC8vIFJ1biBzb3J0aW5nIGFzeW5jaHJvbm91c2x5IG9uIGEgdGltb3V0IHRvIGZvcmNlIGJyb3dzZXIgcmVkcmF3IGFmdGVyXHJcblx0XHQvLyBgYmVmb3JldGFibGVzb3J0YCBjYWxsYmFjay4gQWxzbyBhdm9pZHMgbG9ja2luZyB1cCB0aGUgYnJvd3NlciB0b28gbXVjaC5cclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQvLyBHYXRoZXIgdGhlIGVsZW1lbnRzIGZvciB0aGlzIGNvbHVtblxyXG5cdFx0XHR2YXIgY29sdW1uID0gW107XHJcblx0XHRcdHZhciBzb3J0Rm5zID0gJHRhYmxlLmRhdGEoJ3NvcnRGbnMnKTtcclxuXHRcdFx0dmFyIHNvcnRNZXRob2QgPSBzb3J0Rm5zW2RhdGF0eXBlXTtcclxuXHRcdFx0dmFyIHRycyA9ICR0YWJsZS5jaGlsZHJlbigndGJvZHknKS5jaGlsZHJlbigndHInKTtcclxuXHJcblx0XHRcdC8vIEV4dHJhY3QgdGhlIGRhdGEgZm9yIHRoZSBjb2x1bW4gdGhhdCBuZWVkcyB0byBiZSBzb3J0ZWQgYW5kIHBhaXIgaXQgdXBcclxuXHRcdFx0Ly8gd2l0aCB0aGUgVFIgaXRzZWxmIGludG8gYSB0dXBsZS4gVGhpcyB3YXkgc29ydGluZyB0aGUgdmFsdWVzIHdpbGxcclxuXHRcdFx0Ly8gaW5jaWRlbnRhbGx5IHNvcnQgdGhlIHRycy5cclxuXHRcdFx0dHJzLmVhY2goZnVuY3Rpb24gKGluZGV4LCB0cikge1xyXG5cdFx0XHRcdHZhciAkZSA9ICQodHIpLmNoaWxkcmVuKCkuZXEodGhJbmRleCk7XHJcblx0XHRcdFx0dmFyIHNvcnRWYWwgPSAkZS5kYXRhKCdzb3J0LXZhbHVlJyk7XHJcblxyXG5cdFx0XHRcdC8vIFN0b3JlIGFuZCByZWFkIGZyb20gdGhlIC5kYXRhIGNhY2hlIGZvciBkaXNwbGF5IHRleHQgb25seSBzb3J0c1xyXG5cdFx0XHRcdC8vIGluc3RlYWQgb2YgbG9va2luZyB0aHJvdWdoIHRoZSBET00gZXZlcnkgdGltZVxyXG5cdFx0XHRcdGlmICh0eXBlb2Yoc29ydFZhbCkgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHR2YXIgdHh0ID0gJGUudGV4dCgpO1xyXG5cdFx0XHRcdFx0JGUuZGF0YSgnc29ydC12YWx1ZScsIHR4dCk7XHJcblx0XHRcdFx0XHRzb3J0VmFsID0gdHh0O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjb2x1bW4ucHVzaChbc29ydFZhbCwgdHJdKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQvLyBTb3J0IGJ5IHRoZSBkYXRhLW9yZGVyLWJ5IHZhbHVlXHJcblx0XHRcdGNvbHVtbi5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNvcnRNZXRob2QoYVswXSwgYlswXSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpZiAoc29ydERpciAhPT0gZGlyLkFTQykge1xyXG5cdFx0XHRcdGNvbHVtbi5yZXZlcnNlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFJlcGxhY2UgdGhlIGNvbnRlbnQgb2YgdGJvZHkgd2l0aCB0aGUgc29ydGVkIHJvd3MuIFN0cmFuZ2VseVxyXG5cdFx0XHQvLyBlbm91Z2gsIC5hcHBlbmQgYWNjb21wbGlzaGVzIHRoaXMgZm9yIHVzLlxyXG5cdFx0XHR0cnMgPSAkLm1hcChjb2x1bW4sIGZ1bmN0aW9uIChrdikge1xyXG5cdFx0XHRcdHJldHVybiBrdlsxXTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCR0YWJsZS5jaGlsZHJlbigndGJvZHknKS5hcHBlbmQodHJzKTtcclxuXHJcblx0XHRcdC8vIFJlc2V0IHNpYmxpbmdzXHJcblx0XHRcdCR0YWJsZS5maW5kKCd0aCcpLmRhdGEoJ3NvcnQtZGlyJywgbnVsbCkucmVtb3ZlQ2xhc3MoJ3NvcnRpbmctZGVzYyBzb3J0aW5nLWFzYycpO1xyXG5cdFx0XHQkdGFibGUuZmluZCgndGgnKS5hdHRyKCdhcmlhLXNvcnQnLCAnbm9uZScpO1xyXG5cdFx0XHQkdGFibGUuZmluZCgndGggZGl2JykuZGF0YSgnc29ydC1kaXInLCBudWxsKS5yZW1vdmVDbGFzcygnc29ydGluZy1kZXNjIHNvcnRpbmctYXNjJyk7XHJcblx0XHRcdCR0aGlzVGguZGF0YSgnc29ydC1kaXInLCBzb3J0RGlyKS5hZGRDbGFzcygnc29ydGluZy0nICsgc29ydERpcik7XHJcblx0XHRcdCR0aGlzVGguYXR0cignYXJpYS1zb3J0Jywgc29ydERpciA9PT0gJ2FzYycgP1xyXG5cdFx0XHRcdFx0J2FzY2VuZGluZycgOlxyXG5cdFx0XHRcdFx0J2Rlc2NlbmRpbmcnKTtcclxuXHJcblx0XHRcdCR0YWJsZS50cmlnZ2VyKCdhZnRlcnRhYmxlc29ydCcsIHtjb2x1bW46IHRoSW5kZXgsIGRpcmVjdGlvbjogc29ydERpcn0pO1xyXG5cclxuXHRcdFx0JHRhYmxlLmNzcygnZGlzcGxheScpO1xyXG5cclxuXHRcdH0sIDEwKTtcclxuXHJcblx0XHRyZXR1cm4gJHRoaXNUaDtcclxuXHR9O1xyXG5cclxuXHQvLyBDYWxsIG9uIGEgc29ydGFibGUgdGQgdG8gdXBkYXRlIGl0cyB2YWx1ZSBpbiB0aGUgc29ydC4gVGhpcyBzaG91bGQgYmUgdGhlXHJcblx0Ly8gb25seSBtZWNoYW5pc20gdXNlZCB0byB1cGRhdGUgYSBjZWxsJ3Mgc29ydCB2YWx1ZS4gSWYgeW91ciBkaXNwbGF5IHZhbHVlIGlzXHJcblx0Ly8gZGlmZmVyZW50IGZyb20geW91ciBzb3J0IHZhbHVlLCB1c2UgalF1ZXJ5J3MgLnRleHQoKSBvciAuaHRtbCgpIHRvIHVwZGF0ZVxyXG5cdC8vIHRoZSB0ZCBjb250ZW50cywgQXNzdW1lcyB0YWJsZXNvcnRlciBoYXMgYWxyZWFkeSBiZWVuIGNhbGxlZCBmb3IgdGhlIHRhYmxlLlxyXG5cdCQuZm4udXBkYXRlU29ydFZhbCA9IGZ1bmN0aW9uIChuZXdTb3J0VmFsKSB7XHJcblx0XHR2YXIgJHRoaXNUZCA9ICQodGhpcyk7XHJcblx0XHRpZiAoJHRoaXNUZC5pcygnW2RhdGEtc29ydC12YWx1ZV0nKSkge1xyXG5cdFx0XHQvLyBGb3IgdmlzdWFsIGNvbnNpc3RlbmN5IHdpdGggdGhlIC5kYXRhIGNhY2hlXHJcblx0XHRcdCR0aGlzVGQuYXR0cignZGF0YS1zb3J0LXZhbHVlJywgbmV3U29ydFZhbCk7XHJcblx0XHR9XHJcblx0XHQkdGhpc1RkLmRhdGEoJ3NvcnQtdmFsdWUnLCBuZXdTb3J0VmFsKTtcclxuXHRcdHJldHVybiAkdGhpc1RkO1xyXG5cdH07XHJcblxyXG5cdCQuZm4uc3RyaXBDaGFycyA9IGZ1bmN0aW9uICh2YWwpIHtcclxuXHRcdHJldHVybiB2YWwucmVwbGFjZSgvW14wLTkuXS9nLCAnJyk7XHJcblx0fVxyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQvLyBEZWZhdWx0IHNvcnRpbmcgc2V0dGluZ3NcclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQkLmZuLnRhYmxlc29ydGVyLmRpciA9IHtBU0M6ICdhc2MnLCBERVNDOiAnZGVzYyd9O1xyXG5cdCQuZm4udGFibGVzb3J0ZXIuZGVmYXVsdFNvcnRGbnMgPSB7XHJcblxyXG5cdFx0J2ludCc6IGZ1bmN0aW9uIChhLCBiKSB7XHJcblx0XHRcdGEgPSAkLmZuLnN0cmlwQ2hhcnMoYSk7XHJcblx0XHRcdGIgPSAkLmZuLnN0cmlwQ2hhcnMoYik7XHJcblx0XHRcdHJldHVybiBwYXJzZUludChhLCAxMCkgLSBwYXJzZUludChiLCAxMCk7XHJcblx0XHR9LFxyXG5cdFx0J2Zsb2F0JzogZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0YSA9ICQuZm4uc3RyaXBDaGFycyhhKTtcclxuXHRcdFx0YiA9ICQuZm4uc3RyaXBDaGFycyhiKTtcclxuXHRcdFx0cmV0dXJuIHBhcnNlRmxvYXQoYSkgLSBwYXJzZUZsb2F0KGIpO1xyXG5cdFx0fSxcclxuXHRcdCdzdHJpbmcnOiBmdW5jdGlvbiAoYSwgYikge1xyXG5cdFx0XHRyZXR1cm4gYS5sb2NhbGVDb21wYXJlKGIpO1xyXG5cdFx0fSxcclxuXHRcdCdzdHJpbmctaW5zJzogZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0YSA9IGEudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuXHRcdFx0YiA9IGIudG9Mb2NhbGVMb3dlckNhc2UoKTtcclxuXHRcdFx0cmV0dXJuIGEubG9jYWxlQ29tcGFyZShiKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gVGFibGU7XHJcblxyXG59KGpRdWVyeSkpXHJcblxyXG5leHBvcnQgZGVmYXVsdCBUYWJsZTtcclxuIiwiLyoqXHJcbiAqIENvbXBvbmVudCBTZXJ2aWNlXHJcbiAqIEBtb2R1bGUgQ29tcG9uZW50XHJcbiAqIEB2ZXJzaW9uIDEuOS4wXHJcbiAqL1xyXG5cclxuY29uc3QgY29tcG9uZW50cyA9IFtdO1xyXG5cclxuZnVuY3Rpb24gZ2V0QWxsQ29tcG9uZW50cygpIHtcclxuXHRyZXR1cm4gY29tcG9uZW50cztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29tcG9uZW50KGVsKSB7XHJcblx0Zm9yIChjb25zdCBjIG9mIGNvbXBvbmVudHMpIHtcclxuXHRcdGlmIChjLmVsID09PSBlbCAmJiBjLmNvbXBvbmVudCkge1xyXG5cdFx0XHRyZXR1cm4gYy5jb21wb25lbnQ7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQoZWwsIGNvbXBvbmVudCkge1xyXG5cdGlmIChnZXRDb21wb25lbnQoZWwpKSB7XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cdGNvbXBvbmVudHMucHVzaCh7XHJcblx0XHRlbCxcclxuXHRcdGNvbXBvbmVudCxcclxuXHR9KTtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG5cdGdldEFsbENvbXBvbmVudHMsXHJcblx0Z2V0Q29tcG9uZW50LFxyXG5cdHJlZ2lzdGVyQ29tcG9uZW50LFxyXG59O1xyXG4iLCIvKipcclxuICogalF1ZXJ5IEV4dGVuZHNcclxuICogQG1vZHVsZSBFeHRlbmRzXHJcbiAqIEB2ZXJzaW9uIDEuOS4wXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDEuOS4wXHJcbiAqL1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHRpZiAoISQpIHJldHVybiBmYWxzZTtcclxuXHJcblx0JC5leHRlbmQoe1xyXG5cdFx0ZGVib3VuY2U6IGZ1bmN0aW9uKGZuLHRpbWVvdXQsaW52b2tlQXNhcCxjb250ZXh0KSB7XHJcblx0XHRcdGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDMgJiYgdHlwZW9mIGludm9rZUFzYXAgIT09ICdib29sZWFuJyl7XHJcblx0XHRcdFx0Y29udGV4dCA9IGludm9rZUFzYXA7XHJcblx0XHRcdFx0aW52b2tlQXNhcCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgdGltZXI7XHJcblxyXG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcclxuXHRcdFx0XHRjb250ZXh0ID0gY29udGV4dCB8fCB0aGlzO1xyXG5cdFx0XHRcdGludm9rZUFzYXAgJiYgIXRpbWVyICYmIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cclxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZXIpO1xyXG5cclxuXHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCFpbnZva2VBc2FwICYmIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG5cdFx0XHRcdFx0dGltZXIgPSBudWxsO1xyXG5cdFx0XHRcdH0sdGltZW91dCk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0fSk7XHJcbn0pKGpRdWVyeSk7XHJcbiIsIi8qKlxyXG4gKiBJY29uc1xyXG4gKiBAbW9kdWxlIEljb25zXHJcbiAqIEB2ZXJzaW9uIDEuMTMuMFxyXG4gKi9cclxuXHJcbmxldCBjYWNoZWQgPSBmYWxzZTtcclxuY29uc3QgY2FjaGUgPSB7fTtcclxuXHJcbmNvbnN0IGV4dHJhY3RTVkcgPSAoY3NzVGV4dCkgPT4ge1xyXG5cdGNvbnN0IGVuY29kZWRJY29uID0gY3NzVGV4dC5zcGxpdCgnKTsnKVswXS5tYXRjaCgvVVMtQVNDSUksKFteXCInXSspLyk7XHJcblx0aWYgKGVuY29kZWRJY29uICYmIGVuY29kZWRJY29uWzFdKSB7XHJcblx0XHRyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWRJY29uWzFdKTtcclxuXHR9XHJcblx0cmV0dXJuIGZhbHNlO1xyXG59O1xyXG5cclxuY29uc3QgY2FjaGVJY29ucyA9ICgpID0+IHtcclxuXHRjb25zdCBjc3MgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpbmtbaHJlZio9XCIuY3NzXCJdJykpO1xyXG5cdGZvciAoY29uc3QgZmlsZSBvZiBjc3MpIHtcclxuXHRcdGNvbnN0IHJ1bGVzID0gZmlsZS5zaGVldC5jc3NSdWxlcyA/XHJcblx0XHRcdGZpbGUuc2hlZXQuY3NzUnVsZXMgOiBmaWxlLnNoZWV0LnJ1bGVzO1xyXG5cdFx0Zm9yIChjb25zdCBydWxlIG9mIEFycmF5LmZyb20ocnVsZXMpKSB7XHJcblx0XHRcdGNvbnN0IGNsYXNzTmFtZSA9IHJ1bGUuY3NzVGV4dC5zcGxpdCgnICcpWzBdO1xyXG5cdFx0XHRpZiAoY2xhc3NOYW1lLmluZGV4T2YoJy5pY29uLScpID09PSAwKSB7XHJcblx0XHRcdFx0Y29uc3QgbmFtZSA9IGNsYXNzTmFtZS5yZXBsYWNlKC9cXC5pY29uLS9nLCAnJyk7XHJcblx0XHRcdFx0Y29uc3Qgc3ZnID0gZXh0cmFjdFNWRyhydWxlLmNzc1RleHQpO1xyXG5cdFx0XHRcdGlmIChuYW1lICYmIHN2Zykge1xyXG5cdFx0XHRcdFx0Y2FjaGVbbmFtZV0gPSB7XHJcblx0XHRcdFx0XHRcdG5hbWUsXHJcblx0XHRcdFx0XHRcdHN2ZyxcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGNhY2hlZCA9IHRydWU7XHJcbn07XHJcblxyXG5jb25zdCBJY29ucyA9IHtcclxuXHQvKipcclxuXHQgKiBHZXQgaWNvblxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIGljb24gbmFtZVxyXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IGljb25cclxuXHQgKi9cclxuXHRnZXRJY29uKG5hbWUpIHtcclxuXHRcdGlmICghY2FjaGVkKSB7XHJcblx0XHRcdGNhY2hlSWNvbnMoKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjYWNoZVtuYW1lXTtcclxuXHR9LFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSWNvbnM7XHJcbiIsIi8qKlxyXG4gKiBVdGlsaXRpZXNcclxuICogQG1vZHVsZSBVdGlsXHJcbiAqIEB2ZXJzaW9uIDEuMTMuMFxyXG4gKi9cclxuY29uc3QgQlJFQUtQT0lOVFMgPSB7XHJcblx0c206IDc2OCxcclxuXHRtZDogMTAyNCxcclxuXHRsZzogMTQ0MCxcclxufTtcclxuXHJcbmNvbnN0IEVOQUJMRVRSQU5TSVRJT05TID0gdHJ1ZTtcclxuXHJcbmNvbnN0IFRSQU5TSVRJT05TUEVFRCA9IHtcclxuXHRmYXN0OiAwLjE1LFxyXG5cdG1lZGl1bTogMC4zLFxyXG5cdHNsb3c6IDAuNixcclxufTtcclxuXHJcbmNvbnN0IFV0aWwgPSB7XHJcblx0LyoqXHJcblx0ICogR2V0IGJyZWFrcG9pbnQgdmFsdWVcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIEJyZWFrcG9pbnQga2V5XHJcblx0ICovXHJcblx0Z2V0QnJlYWtwb2ludChrZXkpIHtcclxuXHRcdHJldHVybiBCUkVBS1BPSU5UU1trZXldIHx8IGZhbHNlO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCBlbmFibGUgdHJhbnNpdGlvbnNcclxuXHQgKiBAcHVibGljXHJcblx0ICovXHJcblx0Z2V0RW5hYmxlVHJhbnNpdGlvbnMoKSB7XHJcblx0XHRyZXR1cm4gRU5BQkxFVFJBTlNJVElPTlM7XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogR2V0IGFsbCB0cmFuc2l0aW9uIHNwZWVkc1xyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRnZXRUcmFuc2l0aW9uU3BlZWRzKCkge1xyXG5cdFx0Y29uc3QgdHMgPSBUUkFOU0lUSU9OU1BFRUQ7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRmYXN0OiB0cy5mYXN0ICogMTAwMCxcclxuXHRcdFx0bWVkaXVtOiB0cy5tZWRpdW0gKiAxMDAwLFxyXG5cdFx0XHRzbG93OiB0cy5zbG93ICogMTAwMCxcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogR2V0IHRyYW5zaXRpb24gc3BlZWRcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGtleSAtIFRyYW5zaXRpb24ga2V5XHJcblx0ICovXHJcblx0Z2V0VHJhbnNpdGlvblNwZWVkKGtleSkge1xyXG5cdFx0cmV0dXJuIFRSQU5TSVRJT05TUEVFRFtrZXldICogMTAwMCB8fCBmYWxzZTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBHZXQgaGVhZGVyIGhlaWdodFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRnZXRIZWFkZXJIZWlnaHQoKSB7XHJcblx0XHRyZXR1cm4gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSwgbnVsbClcclxuXHRcdFx0LmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctdG9wJyksIDApO1xyXG5cdH0sXHJcblxyXG5cdC8qKlxyXG5cdCAqIEdldCB2aWV3cG9ydCBwb3NpdGlvblxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKi9cclxuXHRnZXRWaWV3cG9ydFBvc2l0aW9uKCkge1xyXG5cdFx0Y29uc3QgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cdFx0Y29uc3QgYm9keSA9IGRvY3VtZW50LmJvZHk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR0b3A6ICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCB8fCBib2R5LnNjcm9sbFRvcCksXHJcblx0XHRcdGxlZnQ6ICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQgfHwgYm9keS5zY3JvbGxMZWZ0KSxcclxuXHRcdH07XHJcblx0fSxcclxuXHJcblx0LyoqXHJcblx0ICogR2V0IGVsZW1lbnQncyBwb3NpdGlvbiBpbiBkb2N1bWVudFxyXG5cdCAqIEBwdWJsaWNcclxuXHQgKiBAcGFyYW0ge05vZGV9IGVsXHJcblx0ICovXHJcblx0Z2V0RWxlbWVudFBvc2l0aW9uKGVsKSB7XHJcblx0XHRjb25zdCBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG5cdFx0Y29uc3QgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG5cclxuXHRcdGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2Muc2Nyb2xsVG9wIHx8IGJvZHkuc2Nyb2xsVG9wO1xyXG5cdFx0Y29uc3Qgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2Muc2Nyb2xsTGVmdCB8fCBib2R5LnNjcm9sbExlZnQ7XHJcblxyXG5cdFx0Y29uc3QgY2xpZW50VG9wID0gZG9jLmNsaWVudFRvcCB8fCBib2R5LmNsaWVudFRvcCB8fCAwO1xyXG5cdFx0Y29uc3QgY2xpZW50TGVmdCA9IGRvYy5jbGllbnRMZWZ0IHx8IGJvZHkuY2xpZW50TGVmdCB8fCAwO1xyXG5cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR0b3A6IE1hdGgucm91bmQoKGJveC50b3AgKyBzY3JvbGxUb3ApIC0gY2xpZW50VG9wKSxcclxuXHRcdFx0bGVmdDogTWF0aC5yb3VuZCgoYm94LmxlZnQgKyBzY3JvbGxMZWZ0KSAtIGNsaWVudExlZnQpLFxyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHQvKipcclxuXHQgKiBDaGVjayBpZiBlbGVtZW50IGlzIGluIHZpZXdcclxuXHQgKiBAcHVibGljXHJcblx0ICogQHBhcmFtIHtOb2RlfSBlbFxyXG5cdCAqL1xyXG5cdGlzRWxlbWVudEluVmlldyhlbCkge1xyXG5cdFx0Y29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cclxuXHRcdHJldHVybiAoXHJcblx0XHRcdHJlY3QudG9wID49IHRoaXMuZ2V0SGVhZGVySGVpZ2h0KCkgJiZcclxuXHRcdFx0cmVjdC5sZWZ0ID49IDAgJiZcclxuXHRcdFx0cmVjdC5ib3R0b20gPD0gKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAmJlxyXG5cdFx0XHRyZWN0LnJpZ2h0IDw9ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpXHJcblx0XHQpO1xyXG5cdH0sXHJcblxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXRpbDtcclxuIl19
