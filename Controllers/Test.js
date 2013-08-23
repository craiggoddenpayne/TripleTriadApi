module.exports.TestController = TestController;

function TestController() { }

TestController.prototype.Get = function (request, response) {
    response.setHeader('content-type', 'application/json');
    response.send(200, "You should be able to post and get on the Action method");

};
TestController.prototype.GetAction = function (request, response) {
    response.setHeader('content-type', 'application/json');
    response.send(500, "This is a reserved method, please call the method using a controller name and a action rather than what you just did.");

};
TestController.prototype.PostAction = function (request, response) {
    response.setHeader('content-type', 'application/json');
    response.send(500, "This is a reserved method, please call the method using a controller name and a action rather than what you just did.");
};