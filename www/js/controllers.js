var app = angular.module('starter.controllers', ['youtube-embed'])

/**
 * This variable will store the base configuration which we get using the config service in AppCtrl
 */
app.baseConfig = false;

/**
 * This controllers reads the configuration and adds the states
 */
app.controller('InitCtrl', function ($scope, $state, $timeout, $ionicHistory, config,Pages) {
    $scope.startLoading();

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
    });

    var existingStates = [];

    var addStates = function (states) {
        existingStates = getExistingStates();
        for (var idx in states) {
            addState(states[idx]);
        }
    };

    var getExistingStates = function () {
        var states = $state.get();
        var result = [];
        for (var idx in states) {
            result.push(states[idx].name)
        }
        return result;
    };

    var stateExist = function (state) {
        return existingStates.indexOf(state) !== -1;
    };

    var setDefaultState = function (state) {
        // Store defaultState in defaultStateSafe as it gets overwritten while re-initializing
        app.baseConfig.defaultState = app.defaultStateSafe = state.state;
        app.urlRouterProvider.otherwise(state.state);
    };

    var addState = function (state) {
        app.baseConfig.defaultState = app.defaultStateSafe;

        // Only add states that are not there yet
        if (!stateExist(state.state)) {
            if (state.defaultState) {
                setDefaultState(state);
            }
            app.stateProvider.state(state.state, {
                url: state.url,
                views: {
                    'menuContent': {
                        templateUrl: state.templateUrl,
                        controller: state.controller
                        
                    },
                    'sideMenu':{
                       templateUrl:'themes/' + Pages.data.data.theme + '/templates/sideMenu.html',
                       controller:'SettingsCtrl'            
                     },
                     'subMenu':{
                       templateUrl:'themes/' + Pages.data.data.theme + '/templates/subMenu.html',
                       controller:'SettingsCtrl'            
                     }
                },
                parentId:state.parentId,
                data:state.data
            });
        }
    };
    $timeout(function () {

        // Read the configuration
        config.config().then(function (response) {

            // Set the baseConfig
            app.baseConfig = response.data;

            // Add the states
            addStates(app.baseConfig.states);

            // Go to the default state
            $state.go(app.baseConfig.defaultState, {}, {location: true})
        });

    }, 1000);

});

/**
 * The AppCtrl takes care of the parent view for all the other views
 * It is defined in one of the two static states in this application
 */
app.controller('AppCtrl', function ($scope, $state, $ionicHistory, $cordovaInAppBrowser,Pages,$ionicModal) {
    
    $scope.stopLoading();

    $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
    });

    //Declarations ---------------------------
    $scope.appName = app.baseConfig.appName;
    $scope.menuItems = app.baseConfig.menuItems;
    $scope.data = Pages;
    $scope.currentData = $state.current.data;


    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
     };

     console.log('menu length');
     console.log($scope.menuItems.length);

     //limit tabMenu
     if(Pages.data.data.theme === 'tabMenu'){
        if($scope.menuItems.length > 4){
          $scope.showMoreMenu = true;
          $scope.quantity = 3;
        }else{
          $scope.showMoreMenu = false;
          $scope.quantity = 4;
        }
     }
     
     //show hamburger menu
     if(Pages.data.data.theme === 'flyOutGrid' || Pages.data.data.theme === 'flyOutList' || Pages.data.data.theme === 'halfSide'){
      $scope.flyoutStatus = true;
     }

     Pages.getSpecs();

     $scope.subsSwitch = function(label,index){
        $scope.subsOn = true;

        $('.backdrop.active').removeClass('visible');
        
        if(Pages.data.data.menuItems[index].label == label){

          $scope.currentParentOfSub = Pages.data.data.menuItems[index].subMenu;

          console.log('subSwitch: ');
          console.log($scope.currentParentOfSub);
          console.log($scope);
        }
      }

      $scope.pageInfo = function(index){      
         $scope.currentParentOfSubInfo = $scope.currentParentOfSub.menuItems[index];
         console.log('Pageinfo: ');
         console.log(index);
         $scope.aboutIndex = index;
         console.log($scope.currentParentOfSubInfo);

         if(Pages.data.data.theme === 'halfSide'){
           $scope.subsOn = false;
           $('.backdrop.active').toggleClass('visible');
         }
      }

      $scope.backToParentMenu = function(){
          $scope.subsOn = false;
        }
      $scope.backdropHide = function() {
        $('.backdrop.active').removeClass('visible');
        $('.flyout').removeClass('active');
      }

      if(Pages.data.data.theme === 'tabMenu'){
           //more menu
            $ionicModal.fromTemplateUrl('moreMenu.html', {
            id: '1', // We need to use and ID to identify the modal that is firing the event!
            scope: $scope,
            backdropClickToClose: true,
            animation: 'slide-in-up'
            }).then(function(modal) {
              $scope.oModalSettings = modal;
            });

            //Cleanup the modal when we're done with it!
            $scope.$on('$destroy', function() {
              $scope.modal.remove();
            });

            $scope.moreModal = function(index) {
              $scope.oModalSettings.show();
            };

            $scope.closeMoreModal = function(index) {
              $scope.oModalSettings.hide();
            };
      }
});

/**
 * The LayoutCtrl is attached to the body
 */
app.controller('LayoutCtrl', function ($scope, $state, $ionicLoading) {
    $scope.init = function () {
        $state.go('init', true);
    };
    $scope.defaultState = function () {
        $state.go(app.baseConfig.defaultState, true);
    };
    $scope.startLoading = function () {
        $ionicLoading.show({
            template: 'Loading...'
        });
    };
    $scope.stopLoading = function () {
        $ionicLoading.hide();
    };
});


app.controller('HeaderCtrl',function($scope,Pages){$scope.data = Pages;});
app.controller('SettingsCtrl',function($scope,$ionicModal,Pages,MenuFunctions, $ionicHistory){

    $scope.data = Pages;
    Pages.getSpecs();

    //console.log(MenuFunctions);
    //MenuFunctions.flyout.open();
    if($scope.data.data.data.headerText){
      $scope.headerText = $scope.data.data.data.headerText;
    }else{
      $scope.headerText = $scope.data.data.data.applicationName;
    }
    
     $ionicModal.fromTemplateUrl('settings.html', {
      id: '1', // We need to use and ID to identify the modal that is firing the event!
      scope: $scope,
      backdropClickToClose: false,
      animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.oModalSettings = modal;
      });

      $scope.openModal = function(index) {
        $scope.oModalSettings.show();
      };

      $scope.closeModal = function(index) {
        $scope.oModalSettings.hide();
      };

       $scope.myGoBack = function() {
          $ionicHistory.goBack();
        };

        if(Pages.data.data.theme === 'flyOutGrid' || Pages.data.data.theme === 'flyOutList'){
            $scope.flyOut = function(){
            $('.flyout').addClass('active');

            if($('.menuList.menu1 > li').length > 6){
               $scope.withHeight = true;
            }else{
               $scope.withHeight = false;
            }

          }
        }

         if(Pages.data.data.theme === 'halfSide'){
          $scope.flyOut = function(){
            $('.flyout').toggleClass('active');
            $scope.subsOn = false;
            if($('.menuList.menu1 > li').length > 6){
               $scope.withHeight = true;
            }else{
               $scope.withHeight = false;
            }
          }
          console.log('wwwwww');
        }
        
   

        $scope.flyBack = function(){
          $('.flyout').removeClass('active');
        }

        //Show a backdrop
        $scope.backdrop = function() {
          $('.backdrop.active').toggleClass('visible');
        };
         $scope.backdropActive = function() {
          $('.backdrop.active').addClass('visible');
        };
      
});
app.controller('BlankCtrl',function($scope,Pages,$timeout){
  $scope.blankOn = true;
  $('.backdrop.active').removeClass('visible');
});

app.controller('MenuPreviewCtrl',function($scope,Pages,$timeout){
  $timeout(function() {
     $('.flyout').addClass('active');
     $('.backdrop.active').addClass('visible');
  }, 10);
});

app.controller('MenuCtrl', function($scope,Pages,menuInfo) {
      $scope.data = Pages;
      console.log('Menu ctrl: ');
      console.log($scope);
});





