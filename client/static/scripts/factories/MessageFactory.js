console.log("loaded messageFactory");
app.factory('messageFactory', ['$http', function ($http) {
  var factory = {}

  factory.createMessage = function (messageInfo, callback) {
    $http.post('/', messageInfo).then(function (data) {
      console.log(data);
      callback()
    })
  }
  //
  factory.getMessages = function (callback) {
    http.get('').then(function (returnedData) {
      callback(returnedData)
    })
  }
  return factory;

}])
