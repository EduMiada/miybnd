'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'miybnd';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 
		'ui.utils','cgBusy','ngMaterial','ngAria','ng-mfb', 'ui.sortable'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$mdThemingProvider',
	function($locationProvider,$mdThemingProvider) {
		$locationProvider.hashPrefix('!');

		 $mdThemingProvider.theme('default')
		    .primaryPalette('blue')
		    .accentPalette('green');
		
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});


'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('setlists');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('songs');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Configuring the Articles module
//angular.module('articles').run(['Menus',
//	function(Menus) {
		// Set top bar menu items
//		Menus.addMenuItem('topbar', 'Articles', 'articles', 'dropdown', '/articles(/create)?');
//		Menus.addSubMenuItem('topbar', 'articles', 'List Articles', 'articles');
//		Menus.addSubMenuItem('topbar', 'articles', 'New Article', 'articles/create');
//	}
//]);
'use strict';

// Setting up route
angular.module('articles').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('listArticles', {
			url: '/articles',
			templateUrl: 'modules/articles/views/list-articles.client.view.html'
		}).
		state('createArticle', {
			url: '/articles/create',
			templateUrl: 'modules/articles/views/create-article.client.view.html'
		}).
		state('viewArticle', {
			url: '/articles/:articleId',
			templateUrl: 'modules/articles/views/view-article.client.view.html'
		}).
		state('editArticle', {
			url: '/articles/:articleId/edit',
			templateUrl: 'modules/articles/views/edit-article.client.view.html'
		});
	}
]);
'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles',
	function($scope, $stateParams, $location, Authentication, Articles) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', ['$resource',
	function($resource) {
		return $resource('articles/:articleId', {
			articleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
	}
]);
/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-cssanimations-csstransitions-touch-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.cssanimations=function(){return F("animationName")},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('setlists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Setlists', 'setlists', 'dropdown', '/setlists(/create)?');
		//Menus.addSubMenuItem('topbar', 'setlists', 'List Setlists', 'setlists');
		//Menus.addSubMenuItem('topbar', 'setlists', 'New Setlist', 'setlists/create');
		Menus.addMenuItem('topbar', 'Setlists', 'setlists',  'setlists');
	}
]);
'use strict';

//Setting up route
angular.module('setlists').config(['$stateProvider',
	function($stateProvider) {
		// Setlists state routing
		$stateProvider.
		state('listSetlists', {
			url: '/setlists',
			templateUrl: 'modules/setlists/views/list-setlists.client.view.html'
		}).
		state('createSetlist', {
			url: '/setlists/create',
			templateUrl: 'modules/setlists/views/create-setlist.client.view.html'
		}).
		state('viewSetlist', {
			url: '/setlists/:setlistId',
			templateUrl: 'modules/setlists/views/view-setlist.client.view.html'
		}).
		state('editSetlist', {
			url: '/setlists/:setlistId/edit',
			templateUrl: 'modules/setlists/views/edit-setlist.client.view.html'
		});
	}
]);
'use strict';

// Setlists controller
angular.module('setlists').controller('SetlistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Setlists', '$mdDialog','$mdToast','Songs',
	function($scope, $stateParams, $location, Authentication, Setlists, $mdDialog, $mdToast, Songs) {
		$scope.authentication = Authentication;


		$scope.setlistName = 'xxxxx';

		/*--------------------------------------
		Scope variables - general functions
		--------------------------------------*/
		$scope.viewModePlay = false;
		
		$scope.showMessage = function (message) {
   			$mdToast.show(
		      	$mdToast.simple()
		        .content(message)
		        .position('bottom center')
		        .hideDelay(3000)
	    	);
		};
		
		
		/*------------------------------------------
		PAGE CONTROLER
		-------------------------------------------*/
		$scope.itemsPerPage = 1;
		//$scope.totalItems = 15;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};
		
    
    /*---------------------------------------------
		DIALOG LIST SONG
		----------------------------------------------*/
		$scope.alert = '';
 
		$scope.showSongsDialog = function(ev, songs) {
			//list songs
			$scope.songs = Songs.query();		

			$mdDialog.show({
			  controller: DialogController,
			  templateUrl: 'modalListSongs.tmpl.html',
			  parent: angular.element(document.body), 
			  targetEvent: ev,
			  locals: {
			       items: $scope.songs
			     },
			})
			.then(function(answer) {
			  var songs = answer;
			  
			      for (var i = 0; i < songs.length; i++) {
			          var item = {
			              '_id':songs[i], 
			              'order':9999,
			              'song': songs[i]
			          };
			           $scope.setlist.songs.push(item);
			      }
			      
			    
			      	$scope.setlist.$update(function() {
			  			 $scope.findOne();
			        $scope.showMessage(songs.length + ' added to setlist.');
			          			 	
			  			}, function(errorResponse) {
			  				$scope.error = errorResponse.data.message;
			  			});
			        
			    
			
			}, function() {
			  $scope.alert = 'You cancelled the dialog.';
			});
		};





$scope.dragControlListeners = {
//    accept: function (sourceItemHandleScope, destSortableScope) {return boolean}, //override to determine drag is allowed or not. default is true.
 //   itemMoved: function (event) {
      //Do what you want
  //    },
    orderChanged: function(event) {
      //update the order field and save      
      angular.forEach($scope.setlist.songs, function(u, i) {
          $scope.setlist.songs[i].order = i+1;
      });

      $scope.setlist.$update(function() {
				$scope.find();
        
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
      
      
    
    
   },
    containment: '#tableContainer'//optional param.
};

$scope.removeSong = function(index){
    $scope.setlist.songs.splice(index,1);
   // var setlist = $scope.setlist;

			$scope.setlist.$update(function() {
				$scope.find();
        
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
 };

    /*----------------------------------------
		GRID FUNCTIONS
		-----------------------------------------*/
		$scope.sort = {
            column: '',
            descending: false
    };    

		//altera ordem das colunas do grid
 		$scope.changeSorting = function(column) {
           var sort = $scope.sort;
 
            if (sort.column === column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
   };

		//select grid rows
 		//$scope.selected = [];
		
		//$scope.toggle = function (item, list) {
	//		var idx = list.indexOf(item);
	//		if (idx > -1) list.splice(idx, 1);
	//			else list.push(item);
	//		};
	//		$scope.exists = function (item, list) {
	//		return list.indexOf(item) > -1;
	//	};	
		
		$scope.openDetail = function(setlistID){
			$location.path('setlists/' + setlistID);
		};




  $scope.alert = '';
 

  $scope.showSetlistDialog = function(ev, songs) {
    $scope.find();
	$scope.setlistName='';
   // alert(songs);
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
           items: $scope.setlists
         },
    })
    .then(function(setlist, setlistName) {
		//if new setlostID = 0
		//alert(setlist);
		//alert(setlistName);
		//var setName = setlistName;
		
		alert($scope.setlistName);
		
		if (!setlist){
			setlist = new Setlists ({name: $scope.setlistName, songs:[]});		
			//x'setlist.name = setlistName;
		}
		
		
		//alert(setlist);
      //var setlist = answer;
     
		for (var i = 0; i < songs.length; i++) {
		  var item = {
		      '_id':songs[i], 
		      'order':9999,
		      'song': songs[i]
		  };
		   setlist.songs.push(item);
		}

		

      	setlist.$save(function() {
    		$scope.showMessage(songs.length + ' added to setlist.');
		}, function(errorResponse) {
			$scope.error = errorResponse.data.message;
		});
        

    }, function() {
      $scope.alert = 'You cancelled the dialog.';
    });
  };



		// Create new Setlist
		$scope.create = function() {
			// Create new Setlist object
			var setlist = new Setlists ({
				name: this.name
			});

			// Redirect after save
			setlist.$save(function(response) {
				$location.path('setlists/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Setlist
		$scope.remove = function(setlist) {
			if ( setlist ) { 
				setlist.$remove();

				for (var i in $scope.setlists) {
					if ($scope.setlists [i] === setlist) {
						$scope.setlists.splice(i, 1);
					}
				}
			} else {
				$scope.setlist.$remove(function() {
					$location.path('setlists');
				});
			}
		};

		// Update existing Setlist
		$scope.update = function() {
			var setlist = $scope.setlist;

			setlist.$update(function() {
				$location.path('setlists/' + setlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Setlists
		$scope.find = function() {
			$scope.setlists = Setlists.query();
		};

		// Find existing Setlist
		$scope.findOne = function() {
			$scope.setlist = Setlists.get({ 
				setlistId: $stateParams.setlistId
			});
		};
	}
]);

function DialogController($scope, $mdDialog, items) {
  
  $scope.setlistName = '';
  $scope.items = items;
  $scope.selected = [];
  
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.add = function(answer) {
    $mdDialog.hide(answer, null);
  };
  
  $scope.modalAddToSetlist = function(setlistID) {
    $mdDialog.hide(setlistID);
  };
  
  $scope.modalAddSetlist = function(){
	 $mdDialog.hide(null, $scope.setlistName);
  };
  
  
  $scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
				else list.push(item);
		
			
		};
		
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};	
		
}


/*
 $scope.showAlert = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.body))
        .title('This is an alert title')
        .content('You can specify some description text in here.')
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );
  };
  $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
      .parent(angular.element(document.body))
      .title('Would you like to delete your debt?')
      .content('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .ok('Please do it!')
      .cancel('Sounds like a scam')
      .targetEvent(ev);
    $mdDialog.show(confirm).then(function() {
      $scope.alert = 'You decided to get rid of your debt.';
    }, function() {
      $scope.alert = 'You decided to keep your debt.';
    });
  };
  
  */
'use strict';

//Setlists service used to communicate Setlists REST endpoints
angular.module('setlists').factory('Setlists', ['$resource',
	function($resource) {
		return $resource('setlists/:setlistId', { setlistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Configuring the Articles module
angular.module('songs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		//Menus.addMenuItem('topbar', 'Songs', 'songs', 'dropdown', '/songs(/create)?');
		//Menus.addSubMenuItem('topbar', 'songs', 'List Songs', 'songs');
		//Menus.addSubMenuItem('topbar', 'songs', 'New Song', 'songs/create');
		Menus.addMenuItem('topbar', 'Repertoire', 'songs',  'songs');
	}
]);




'use strict';

//Setting up route
angular.module('songs').config(['$stateProvider',
	function($stateProvider) {
		// Songs state routing
		$stateProvider.
		state('listSongs', {
			url: '/songs',
			templateUrl: 'modules/songs/views/list-songs.client.view.html'
		}).
		state('createSong', {
			url: '/songs/create',
			templateUrl: 'modules/songs/views/create-song.client.view.html'
		}).
		state('viewSong', {
			url: '/songs/:songId',
			templateUrl: 'modules/songs/views/view-song.client.view.html'
		}).
		state('editSong', {
			url: '/songs/:songId/edit',
			templateUrl: 'modules/songs/views/edit-song.client.view.html'
		});
	}
]);
'use strict';

// Songs controller
angular.module('songs').controller('SongsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Songs', 'UnratedSongs' , '$http', '$mdDialog', '$mdToast','songsService',
	function($scope, $stateParams, $location, Authentication, Songs, UnratedSongs, $http, $mdDialog, $mdToast, songsService) {
		$scope.authentication = Authentication;

		/*--------------------------------------
		Scope variables - general functions
		--------------------------------------*/
		//song rating code
		$scope.rate = 0;
		$scope.max = 5;
		
		//selected grid rows
 		$scope.selected = [];
		
		
		$scope.FSisOpen = false;
	
		$scope.$back = function() { 
			$scope.FSisOpen = false;
			window.history.back();
		};

		$scope.showMessage = function (message) {
   			$mdToast.show(
		      	$mdToast.simple()
		        .content(message)
		        .position('bottom center')
		        .hideDelay(3000)
	    	);
		};
		
		
		
		

		
		/*------------------------------------------
		PAGE CONTROLER
		-------------------------------------------*/
		$scope.itemsPerPage = 3;
		//$scope.totalItems = 15;
		$scope.currentPage = 1;

		$scope.setPage = function (pageNo) {
			$scope.currentPage = pageNo;
		};

		
		
		/*----------------------------------------
		DROP DOWN ICON MENU
		-----------------------------------------*/
		$scope.status = {
		   isopen: false
		 };
		
		$scope.toggleDropdown = function($event) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.status.isopen = !$scope.status.isopen;
		};


	
		
		/*----------------------------------------
		GRID FUNCTIONS
		-----------------------------------------*/
		$scope.sort = {
            column: '',
            descending: false
        };    

		//altera ordem das colunas do grid
  		$scope.changeSorting = function(column) {
            var sort = $scope.sort;
 
            if (sort.column === column) {
                sort.descending = !sort.descending;
            } else {
                sort.column = column;
                sort.descending = false;
            }
		
        };
		
		$scope.toggle = function (item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) list.splice(idx, 1);
				else list.push(item);
		
			songsService.setSelectedSongs(list);
			
		};
		
		$scope.exists = function (item, list) {
			return list.indexOf(item) > -1;
		};	
		
		$scope.openDetail = function(songID){
			$location.path('songs/' + songID);
		};

		/*----------------------------------------
		Manage Songs
		-----------------------------------------*/

		$scope.$edit = function() {
			if ( $scope.song ) { 		
					$location.path('songs/' + $scope.song._id +  '/edit');
			}
		};

		// Create new Song
		$scope.create = function() {
			// Create new Song object
			var song = new Songs ({
				name: this.name
			});

			// Redirect after save
			song.$save(function(response) {
				$location.path('songs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Song
		$scope.remove = function(song) {
			if ( song ) { 
				song.$remove();

				for (var i in $scope.songs) {
					if ($scope.songs [i] === song) {
						$scope.songs.splice(i, 1);
					}
				}
			} else {
				$scope.song.$remove(function() {
					$location.path('songs');
				});
			}
		};

		// Update existing Song
		$scope.update = function() {
			var song = $scope.song;

			song.$update(function() {
				$location.path('songs/' + song._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Filter by type
		$scope.findByType = function(typeEnum) {
			$scope.songs = Songs.query({'filterType': typeEnum});
		};
		
		// Find a list of Songs
		$scope.find = function() {
			//se estiver na home mostra unrated , senao mostra repertorio
			if($location.path() === '/'){
				$scope.unratedSongs = UnratedSongs.query();
				$scope.totalItems = $scope.unratedSongs.length;
			}else{
				$scope.songs = Songs.query();			
				$scope.totalItems = $scope.songs.length;
			}
		};

		// Find existing Song
		$scope.findOne = function() {
			$scope.song = Songs.get({ 
				songId: $stateParams.songId
			});
		};



		/*------------------------------
		Rate song actions
		--------------------------------*/
		//star rate onhover		
		$scope.hoveringOver = function(value) {
			$scope.overStar = value;
			$scope.percent = 100 * (value / $scope.max);
		};

		//rate song click
		$scope.rateSong = function(songID, rate){		
			if(rate!==0){
				$scope.unratedSongs =  UnratedSongs.post({songId: songID, rateNumber:rate});
			}
		};


		
		

		/*------------------------------
		MusixMatch actions
		--------------------------------*/
		//When selected musixmatch from list
	 	$scope.onSelect = function ($item, $model, $label) {
	    	$scope.newTrackID = $item.track_id; 
		};
		
		//seach with typeahead musixmatch
		$scope.searchMusixMatch = function(val) {
		    return $http.get('musicxmatch', {params: { music: val, sensor: false}
		    }).then(function(response){
			      	return response.data.map(function(item){
			        	return item;
			     });
		    });
		};

		
		//add  music  from musixmatch
	 	$scope.addFromMusixmatch = function () {
	   		$scope.error = null; 
			$scope.asyncSelected = null;

			$scope.myPromise =	$http.post('/createmusicxmatch/' + $scope.newTrackID + '?status=' + $scope.addStatus  )
		        .success(function(response) {
					$scope.showMessage('Song added successfuly! Press (F5) to refresh :-)');
					$scope.find();	          
		        })
		        .error(function(response) {
					$scope.showMessage(response.message);		 
		        });		
		};



	} //end of module
]);
'use strict';

//Songs service used to communicate Songs REST endpoints
angular.module('songs').factory('Songs', ['$resource',
	function($resource) {
		return $resource('songs/:songId', { songId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
  
  
 



]);


angular.module('songs').factory('UnratedSongs', ['$resource',
  function($resource) {
    return $resource('/songs/unrated/:songId', { songId: '@_id'}, {
      update: {
        method: 'PUT'
      },
      post: { method: 'POST', params: { songId:'@songId', rateNumber:'@rateNumber'}, isArray: true }
	  //, query: { method: 'GET', params: {}, isArray: true }
    });
  }

]);


angular.module('songs').service('songsService', function () {
   var selectedSongs = [];

  var setSelectedSongs = function(newArray) {
      selectedSongs = newArray;
  };

  var addSong = function(newObj) {
      selectedSongs.push(newObj);
  };

  var getSelectedSongs = function(){
      return selectedSongs;
  };

  return {
    addSong: addSong,
    getSelectedSongs: getSelectedSongs,
    setSelectedSongs: setSelectedSongs
  };
});
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);