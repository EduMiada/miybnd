"use strict";function DialogController($scope,$mdDialog,items){$scope.setlistName="",$scope.items=items,$scope.selected=[],$scope.hide=function(){$mdDialog.hide()},$scope.cancel=function(){$mdDialog.cancel()},$scope.add=function(answer){$mdDialog.hide(answer,null)},$scope.modalAddToExistingSetlist=function(item){var response={setlist:item,name:null};$mdDialog.hide(response)},$scope.modalAddtoNewSetlist=function(){var response={setlist:null,name:$scope.setlistName};$mdDialog.hide(response)},$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item)},$scope.exists=function(item,list){return list.indexOf(item)>-1}}var ApplicationConfiguration=function(){var applicationModuleName="miybnd",applicationModuleVendorDependencies=["ngResource","ngCookies","ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","ui.utils","cgBusy","ngMaterial","ngAria","ng-mfb","ui.sortable"],registerModule=function(moduleName,dependencies){angular.module(moduleName,dependencies||[]),angular.module(applicationModuleName).requires.push(moduleName)};return{applicationModuleName:applicationModuleName,applicationModuleVendorDependencies:applicationModuleVendorDependencies,registerModule:registerModule}}();angular.module(ApplicationConfiguration.applicationModuleName,ApplicationConfiguration.applicationModuleVendorDependencies),angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider","$mdThemingProvider",function($locationProvider,$mdThemingProvider){$locationProvider.hashPrefix("!"),$mdThemingProvider.theme("default").primaryPalette("blue").accentPalette("green")}]),angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!"),angular.bootstrap(document,[ApplicationConfiguration.applicationModuleName])}),ApplicationConfiguration.registerModule("articles"),ApplicationConfiguration.registerModule("bands"),ApplicationConfiguration.registerModule("core"),ApplicationConfiguration.registerModule("setlists"),ApplicationConfiguration.registerModule("songs"),ApplicationConfiguration.registerModule("users"),angular.module("articles").config(["$stateProvider",function($stateProvider){$stateProvider.state("listArticles",{url:"/articles",templateUrl:"modules/articles/views/list-articles.client.view.html"}).state("createArticle",{url:"/articles/create",templateUrl:"modules/articles/views/create-article.client.view.html"}).state("viewArticle",{url:"/articles/:articleId",templateUrl:"modules/articles/views/view-article.client.view.html"}).state("editArticle",{url:"/articles/:articleId/edit",templateUrl:"modules/articles/views/edit-article.client.view.html"})}]),angular.module("articles").controller("ArticlesController",["$scope","$stateParams","$location","Authentication","Articles",function($scope,$stateParams,$location,Authentication,Articles){$scope.authentication=Authentication,$scope.create=function(){var article=new Articles({title:this.title,content:this.content});article.$save(function(response){$location.path("articles/"+response._id),$scope.title="",$scope.content=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(article){if(article){article.$remove();for(var i in $scope.articles)$scope.articles[i]===article&&$scope.articles.splice(i,1)}else $scope.article.$remove(function(){$location.path("articles")})},$scope.update=function(){var article=$scope.article;article.$update(function(){$location.path("articles/"+article._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.articles=Articles.query()},$scope.findOne=function(){$scope.article=Articles.get({articleId:$stateParams.articleId})}}]),angular.module("articles").factory("Articles",["$resource",function($resource){return $resource("articles/:articleId",{articleId:"@_id"},{update:{method:"PUT"}})}]),angular.module("bands").config(["$stateProvider",function($stateProvider){$stateProvider.state("listBands",{url:"/bands",templateUrl:"modules/bands/views/list-bands.client.view.html"}).state("createBand",{url:"/bands/create",templateUrl:"modules/bands/views/create-band.client.view.html"}).state("viewBand",{url:"/bands/:bandId",templateUrl:"modules/bands/views/view-band.client.view.html"}).state("editBand",{url:"/bands/:bandId/edit",templateUrl:"modules/bands/views/edit-band.client.view.html"})}]),angular.module("bands").controller("BandsController",["$scope","$stateParams","$location","Authentication","Bands","$http",function($scope,$stateParams,$location,Authentication,Bands,$http){$scope.authentication=Authentication,$scope.usersList=[],$scope.onSelect=function($item,$model,$label){$scope.selectedMemberID=$item},$scope.searchUsers=function(val){return $http.get("searchMembers",{params:{search:val,sensor:!1}}).then(function(response){return response.data.map(function(item){return item})})},$scope.addMember=function(){var memberID=$scope.selectedMemberID;$scope.error=null,$scope.asyncSelected=null,$scope.band.members.push({admin:0,member:memberID}),$scope.update()},$scope.create=function(){var band=new Bands({name:this.name});band.$save(function(response){$location.path("bands/"+response._id),$scope.name=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(band){if(band){band.$remove();for(var i in $scope.bands)$scope.bands[i]===band&&$scope.bands.splice(i,1)}else $scope.band.$remove(function(){$location.path("bands")})},$scope.update=function(){var band=$scope.band;band.$update(function(){$location.path("bands/"+band._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.bands=Bands.query()},$scope.findOne=function(){$scope.band=Bands.get({bandId:$stateParams.bandId}),console.log($scope.band)}}]),angular.module("bands").factory("Bands",["$resource",function($resource){return $resource("bands/:bandId",{bandId:"@_id"},{update:{method:"PUT"}})}]),angular.module("core").config(["$stateProvider","$urlRouterProvider",function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("home",{url:"/",templateUrl:"modules/core/views/home.client.view.html"})}]),angular.module("core").controller("HeaderController",["$scope","Authentication","Menus",function($scope,Authentication,Menus){$scope.authentication=Authentication,$scope.isCollapsed=!1,$scope.menu=Menus.getMenu("topbar"),$scope.toggleCollapsibleMenu=function(){$scope.isCollapsed=!$scope.isCollapsed},$scope.$on("$stateChangeSuccess",function(){$scope.isCollapsed=!1})}]),angular.module("core").controller("HomeController",["$scope","Authentication",function($scope,Authentication){$scope.authentication=Authentication}]),angular.module("core").service("Menus",[function(){this.defaultRoles=["*"],this.menus={};var shouldRender=function(user){if(!user)return this.isPublic;if(~this.roles.indexOf("*"))return!0;for(var userRoleIndex in user.roles)for(var roleIndex in this.roles)if(this.roles[roleIndex]===user.roles[userRoleIndex])return!0;return!1};this.validateMenuExistance=function(menuId){if(menuId&&menuId.length){if(this.menus[menuId])return!0;throw new Error("Menu does not exists")}throw new Error("MenuId was not provided")},this.getMenu=function(menuId){return this.validateMenuExistance(menuId),this.menus[menuId]},this.addMenu=function(menuId,isPublic,roles){return this.menus[menuId]={isPublic:isPublic||!1,roles:roles||this.defaultRoles,items:[],shouldRender:shouldRender},this.menus[menuId]},this.removeMenu=function(menuId){this.validateMenuExistance(menuId),delete this.menus[menuId]},this.addMenuItem=function(menuId,menuItemTitle,menuItemURL,menuItemType,menuItemUIRoute,isPublic,roles,position){return this.validateMenuExistance(menuId),this.menus[menuId].items.push({title:menuItemTitle,link:menuItemURL,menuItemType:menuItemType||"item",menuItemClass:menuItemType,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].roles:roles,position:position||0,items:[],shouldRender:shouldRender}),this.menus[menuId]},this.addSubMenuItem=function(menuId,rootMenuItemURL,menuItemTitle,menuItemURL,menuItemUIRoute,isPublic,roles,position){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===rootMenuItemURL&&this.menus[menuId].items[itemIndex].items.push({title:menuItemTitle,link:menuItemURL,uiRoute:menuItemUIRoute||"/"+menuItemURL,isPublic:null===isPublic||"undefined"==typeof isPublic?this.menus[menuId].items[itemIndex].isPublic:isPublic,roles:null===roles||"undefined"==typeof roles?this.menus[menuId].items[itemIndex].roles:roles,position:position||0,shouldRender:shouldRender});return this.menus[menuId]},this.removeMenuItem=function(menuId,menuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)this.menus[menuId].items[itemIndex].link===menuItemURL&&this.menus[menuId].items.splice(itemIndex,1);return this.menus[menuId]},this.removeSubMenuItem=function(menuId,submenuItemURL){this.validateMenuExistance(menuId);for(var itemIndex in this.menus[menuId].items)for(var subitemIndex in this.menus[menuId].items[itemIndex].items)this.menus[menuId].items[itemIndex].items[subitemIndex].link===submenuItemURL&&this.menus[menuId].items[itemIndex].items.splice(subitemIndex,1);return this.menus[menuId]},this.addMenu("topbar")}]),angular.module("setlists").config(["$stateProvider",function($stateProvider){$stateProvider.state("listSetlists",{url:"/setlists",templateUrl:"modules/setlists/views/list-setlists.client.view.html"}).state("createSetlist",{url:"/setlists/create",templateUrl:"modules/setlists/views/create-setlist.client.view.html"}).state("viewSetlist",{url:"/setlists/:setlistId",templateUrl:"modules/setlists/views/view-setlist.client.view.html"}).state("editSetlist",{url:"/setlists/:setlistId/edit",templateUrl:"modules/setlists/views/edit-setlist.client.view.html"})}]),angular.module("setlists").controller("SetlistsController",["$scope","$stateParams","$location","Authentication","Setlists","$mdDialog","$mdToast","Songs",function($scope,$stateParams,$location,Authentication,Setlists,$mdDialog,$mdToast,Songs){$scope.authentication=Authentication,$scope.setlistName="",$scope.viewModePlay=!1,$scope.showMessage=function(message){$mdToast.show($mdToast.simple().content(message).position("bottom center").hideDelay(3e3))},$scope.itemsPerPage=1,$scope.currentPage=1,$scope.setPage=function(pageNo){$scope.currentPage=pageNo},$scope.showSongsDialog=function(ev,songs){$scope.songs=Songs.query(),$mdDialog.show({controller:DialogController,templateUrl:"modalListSongs.tmpl.html",parent:angular.element(document.body),targetEvent:ev,locals:{items:$scope.songs}}).then(function(response){for(var songs=response.setlist,i=0;i<songs.length;i++){var item={_id:songs[i],order:9999,song:songs[i]};$scope.setlist.songs.push(item)}$scope.setlist.$update(function(){$scope.findOne(),$scope.showMessage(songs.length+" song added to setlist.")},function(errorResponse){$scope.error=errorResponse.data.message})},function(){$scope.alert="You cancelled the dialog."})},$scope.dragControlListeners={orderChanged:function(event){angular.forEach($scope.setlist.songs,function(u,i){$scope.setlist.songs[i].order=i+1}),$scope.setlist.$update(function(){$scope.find()},function(errorResponse){$scope.error=errorResponse.data.message})},containment:"#tableContainer"},$scope.removeSong=function(index){$scope.setlist.songs.splice(index,1),$scope.setlist.$update(function(){$scope.find()},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.sort={column:"",descending:!1},$scope.changeSorting=function(column){var sort=$scope.sort;sort.column===column?sort.descending=!sort.descending:(sort.column=column,sort.descending=!1)},$scope.openDetail=function(setlistID){$location.path("setlists/"+setlistID)},$scope.showSetlistDialog=function(ev,songs){$scope.find(),$mdDialog.show({controller:DialogController,templateUrl:"dialog1.tmpl.html",parent:angular.element(document.body),targetEvent:ev,locals:{items:$scope.setlists}}).then(function(response){var setlist;response.setlist?(setlist=response.setlist,$scope.splitSongs(setlist,songs),setlist.$update(function(){$scope.showMessage(songs.length+" added to setlist | "+setlist.name)},function(errorResponse){$scope.showMessage(errorResponse.data.message)})):(setlist=new Setlists({name:response.name,songs:[]}),$scope.splitSongs(setlist,songs),setlist.$save(function(){$scope.showMessage(songs.length+" added to setlist | "+setlist.name)},function(errorResponse){$scope.showMessage(errorResponse.data.message)}))},function(){$scope.alert="You cancelled the dialog."})},$scope.splitSongs=function(setlist,songs){for(var i=0;i<songs.length;i++){var item={order:9999,song:songs[i]};setlist.songs.push(item)}},$scope.create=function(){var setlist=new Setlists({name:this.name});setlist.$save(function(response){$location.path("setlists/"+response._id),$scope.name=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(setlist){if(setlist){setlist.$remove();for(var i in $scope.setlists)$scope.setlists[i]===setlist&&$scope.setlists.splice(i,1)}else $scope.setlist.$remove(function(){$location.path("setlists")})},$scope.update=function(){var setlist=$scope.setlist;setlist.$update(function(){$location.path("setlists/"+setlist._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.find=function(){$scope.setlists=Setlists.query()},$scope.findOne=function(){$scope.setlist=Setlists.get({setlistId:$stateParams.setlistId})}}]),angular.module("setlists").factory("Setlists",["$resource",function($resource){return $resource("setlists/:setlistId",{setlistId:"@_id"},{update:{method:"PUT"}})}]),angular.module("songs").run(["Menus",function(Menus){Menus.addMenuItem("topbar","Repertoire","songs","dropdown","songs"),Menus.addSubMenuItem("topbar","songs","Songs","songs"),Menus.addSubMenuItem("topbar","songs","Setlists","setlists")}]),angular.module("songs").config(["$stateProvider",function($stateProvider){$stateProvider.state("listSongs",{url:"/songs",templateUrl:"modules/songs/views/list-songs.client.view.html"}).state("createSong",{url:"/songs/create",templateUrl:"modules/songs/views/create-song.client.view.html"}).state("viewSong",{url:"/songs/:songId",templateUrl:"modules/songs/views/view-song.client.view.html"}).state("editSong",{url:"/songs/:songId/edit",templateUrl:"modules/songs/views/edit-song.client.view.html"})}]),angular.module("songs").controller("SongsController",["$scope","$stateParams","$location","Authentication","Songs","UnratedSongs","$http","$mdDialog","$mdToast","songsService",function($scope,$stateParams,$location,Authentication,Songs,UnratedSongs,$http,$mdDialog,$mdToast,songsService){$scope.authentication=Authentication,$scope.rate=0,$scope.max=5,$scope.selected=[],$scope.FSisOpen=!1,$scope.$back=function(){$scope.FSisOpen=!1,window.history.back()},$scope.showMessage=function(message){$mdToast.show($mdToast.simple().content(message).position("bottom center").hideDelay(3e3))},$scope.itemsPerPage=3,$scope.currentPage=1,$scope.setPage=function(pageNo){$scope.currentPage=pageNo},$scope.status={isopen:!1},$scope.toggleDropdown=function($event){$event.preventDefault(),$event.stopPropagation(),$scope.status.isopen=!$scope.status.isopen},$scope.sort={column:"",descending:!1},$scope.changeSorting=function(column){var sort=$scope.sort;sort.column===column?sort.descending=!sort.descending:(sort.column=column,sort.descending=!1)},$scope.toggle=function(item,list){var idx=list.indexOf(item);idx>-1?list.splice(idx,1):list.push(item),songsService.setSelectedSongs(list)},$scope.exists=function(item,list){return list.indexOf(item)>-1},$scope.openDetail=function(songID){$location.path("songs/"+songID)},$scope.$edit=function(){$scope.song&&$location.path("songs/"+$scope.song._id+"/edit")},$scope.create=function(){var song=new Songs({name:this.name});song.$save(function(response){$location.path("songs/"+response._id),$scope.name=""},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.remove=function(song){if(song){song.$remove();for(var i in $scope.songs)$scope.songs[i]===song&&$scope.songs.splice(i,1)}else $scope.song.$remove(function(){$location.path("songs")})},$scope.update=function(){var song=$scope.song;song.$update(function(){$location.path("songs/"+song._id)},function(errorResponse){$scope.error=errorResponse.data.message})},$scope.findByType=function(typeEnum){$scope.songs=Songs.query({filterType:typeEnum})},$scope.find=function(){"/"===$location.path()?($scope.unratedSongs=UnratedSongs.query(),$scope.totalItems=$scope.unratedSongs.length):($scope.songs=Songs.query(),$scope.totalItems=$scope.songs.length)},$scope.findOne=function(){$scope.song=Songs.get({songId:$stateParams.songId})},$scope.hoveringOver=function(value){$scope.overStar=value,$scope.percent=100*(value/$scope.max)},$scope.rateSong=function(songID,rate){0!==rate&&($scope.unratedSongs=UnratedSongs.post({songId:songID,rateNumber:rate}))},$scope.onSelect=function($item,$model,$label){$scope.newTrackID=$item.track_id},$scope.searchMusixMatch=function(val){return $http.get("musicxmatch",{params:{music:val,sensor:!1}}).then(function(response){return response.data.map(function(item){return item})})},$scope.addFromMusixmatch=function(){$scope.error=null,$scope.asyncSelected=null,$scope.myPromise=$http.post("/createmusicxmatch/"+$scope.newTrackID+"?status="+$scope.addStatus).success(function(response){$scope.showMessage("Song added successfuly! Press (F5) to refresh :-)"),$scope.find()}).error(function(response){$scope.showMessage(response.message)})}}]),angular.module("songs").factory("Songs",["$resource",function($resource){return $resource("songs/:songId",{songId:"@_id"},{update:{method:"PUT"}})}]),angular.module("songs").factory("UnratedSongs",["$resource",function($resource){return $resource("/songs/unrated/:songId",{songId:"@_id"},{update:{method:"PUT"},post:{method:"POST",params:{songId:"@songId",rateNumber:"@rateNumber"},isArray:!0}})}]),angular.module("songs").service("songsService",function(){var selectedSongs=[],setSelectedSongs=function(newArray){selectedSongs=newArray},addSong=function(newObj){selectedSongs.push(newObj)},getSelectedSongs=function(){return selectedSongs};return{addSong:addSong,getSelectedSongs:getSelectedSongs,setSelectedSongs:setSelectedSongs}}),angular.module("users").config(["$httpProvider",function($httpProvider){$httpProvider.interceptors.push(["$q","$location","Authentication",function($q,$location,Authentication){return{responseError:function(rejection){switch(rejection.status){case 401:Authentication.user=null,$location.path("signin");break;case 403:}return $q.reject(rejection)}}}])}]),angular.module("users").config(["$stateProvider",function($stateProvider){$stateProvider.state("profile",{url:"/settings/profile",templateUrl:"modules/users/views/settings/edit-profile.client.view.html"}).state("password",{url:"/settings/password",templateUrl:"modules/users/views/settings/change-password.client.view.html"}).state("accounts",{url:"/settings/accounts",templateUrl:"modules/users/views/settings/social-accounts.client.view.html"}).state("signup",{url:"/signup",templateUrl:"modules/users/views/authentication/signup.client.view.html"}).state("signin",{url:"/signin",templateUrl:"modules/users/views/authentication/signin.client.view.html"}).state("forgot",{url:"/password/forgot",templateUrl:"modules/users/views/password/forgot-password.client.view.html"}).state("reset-invalid",{url:"/password/reset/invalid",templateUrl:"modules/users/views/password/reset-password-invalid.client.view.html"}).state("reset-success",{url:"/password/reset/success",templateUrl:"modules/users/views/password/reset-password-success.client.view.html"}).state("reset",{url:"/password/reset/:token",templateUrl:"modules/users/views/password/reset-password.client.view.html"})}]),angular.module("users").controller("AuthenticationController",["$scope","$http","$location","Authentication",function($scope,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.signup=function(){$http.post("/auth/signup",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})},$scope.signin=function(){$http.post("/auth/signin",$scope.credentials).success(function(response){$scope.authentication.user=response,$location.path("/")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("PasswordController",["$scope","$stateParams","$http","$location","Authentication",function($scope,$stateParams,$http,$location,Authentication){$scope.authentication=Authentication,$scope.authentication.user&&$location.path("/"),$scope.askForPasswordReset=function(){$scope.success=$scope.error=null,$http.post("/auth/forgot",$scope.credentials).success(function(response){$scope.credentials=null,$scope.success=response.message}).error(function(response){$scope.credentials=null,$scope.error=response.message})},$scope.resetUserPassword=function(){$scope.success=$scope.error=null,$http.post("/auth/reset/"+$stateParams.token,$scope.passwordDetails).success(function(response){$scope.passwordDetails=null,Authentication.user=response,$location.path("/password/reset/success")}).error(function(response){$scope.error=response.message})}}]),angular.module("users").controller("SettingsController",["$scope","$http","$location","Users","Authentication",function($scope,$http,$location,Users,Authentication){$scope.user=Authentication.user,$scope.user||$location.path("/"),$scope.hasConnectedAdditionalSocialAccounts=function(provider){for(var i in $scope.user.additionalProvidersData)return!0;return!1},$scope.isConnectedSocialAccount=function(provider){return $scope.user.provider===provider||$scope.user.additionalProvidersData&&$scope.user.additionalProvidersData[provider]},$scope.removeUserSocialAccount=function(provider){$scope.success=$scope.error=null,$http["delete"]("/users/accounts",{params:{provider:provider}}).success(function(response){$scope.success=!0,$scope.user=Authentication.user=response}).error(function(response){$scope.error=response.message})},$scope.updateUserProfile=function(isValid){if(isValid){$scope.success=$scope.error=null;var user=new Users($scope.user);user.$update(function(response){$scope.success=!0,Authentication.user=response},function(response){$scope.error=response.data.message})}else $scope.submitted=!0},$scope.changeUserPassword=function(){$scope.success=$scope.error=null,$http.post("/users/password",$scope.passwordDetails).success(function(response){$scope.success=!0,$scope.passwordDetails=null}).error(function(response){$scope.error=response.message})}}]),angular.module("users").factory("Authentication",[function(){var _this=this;return _this._data={user:window.user},_this._data}]),angular.module("users").factory("Users",["$resource",function($resource){return $resource("users",{},{update:{method:"PUT"}})}]);