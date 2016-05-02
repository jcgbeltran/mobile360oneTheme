
app.controller('testimonialCtrl', function($scope,$location,$rootScope,$timeout,$ionicModal,Pages,$state) {

      
      $scope.data = Pages;
      Pages.getSpecs();

      console.log('testi ctrl: ');
      console.log($scope);
      console.log('Parent');

      //data sharing
        $scope.currentData = $state.current.data;
        $scope.parentId =  $state.current.parentId;
        //set data to parent about pages
        $scope.currentTestiData = $scope.data.scrum2[$scope.currentData];
      //end of data sharing

      if($scope.parentId){
        $scope.homeData = $scope.data.scrum2[$scope.parentId];
        console.log($scope.homeData.subMenu);
        angular.forEach($scope.homeData.subMenu.menuItems,function(value,key){
           
            if($scope.currentData == $scope.homeData.subMenu.menuItems[key].id){
              //alert($scope.homeData.subMenu.menuItems[key].id);
              $scope.currentTestiData = $scope.homeData.subMenu.menuItems[key];
            }
        });
      }

     
//widget lock
    if(Pages.data.data.login.isGlobal == true){
        if($rootScope.loggedIn == false){
           $state.go('app.login', true);
        }
    }
    else{

      $scope.lockname = sessionStorage.getItem($scope.currentTestiData.label);

      if($scope.lockname == true){
       console.log('yey!');
      }
      else{
        if($scope.currentTestiData.isLocked){
          
          $rootScope.currentAuthRequest = $scope.currentTestiData.label;
         // alert(typeof localStorage[$rootScope.currentAuthRequest]);
          if(sessionStorage[$rootScope.currentAuthRequest] == 'true'){
            console.log('yey!');

          }
          else{
            sessionStorage.setItem($rootScope.currentAuthRequest, false);
            console.log('else:');
            console.log(sessionStorage[$rootScope.currentAuthRequest]);
            $state.go('app.login', true);
          }
         
        }
      }
    }


     $rootScope.currentState = $state.current.name;

    console.log($state.current.name);
});