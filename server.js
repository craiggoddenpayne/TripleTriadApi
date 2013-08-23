var restify = require('restify');
var server = restify.createServer({ name: 'WebServer' });
var testController = require("./Controllers/Test.js");

var api = new MvcApi();
function MvcApi() {
    this.testController = new testController.TestController();
}

function controllerNotFound(req, res) {
    res.send("Controller Not Found!");
}
function actionNotFound(req, res) {
    res.send("Action Not Found!");
}

Setup(controllerNotFound, actionNotFound);
function Setup(notFoundControllerHandler, notFoundActionHandler) {
    

    server.get("/api/:controller", getResponseHandler);
    server.post("/api/:controller", postResponseHandler);
    server.put("/api/:controller", putResponseHandler);
    server.del("/api/:controller", deleteResponseHandler);
    server.head("/api/:controller", headResponseHandler);
    server.opts("/api/:controller", optionsResponseHandler);
    server.patch("/api/:controller", patchResponseHandler);
    server.get("/api/:controller/:action", getResponseHandler);
    server.post("/api/:controller/:action", postResponseHandler);
    server.put("/api/:controller/:action", putResponseHandler);
    server.del("/api/:controller/:action", deleteResponseHandler);
    server.head("/api/:controller/:action", headResponseHandler);
    server.opts("/api/:controller/:action", optionsResponseHandler);
    server.patch("/api/:controller/:action", patchResponseHandler);

    function getResponseHandler(req, res) {responseHandler(req, res, "get");}
    function postResponseHandler(req, res) { responseHandler(req, res, "post"); }
    function putResponseHandler(req, res) { responseHandler(req, res, "put"); }    
    function deleteResponseHandler(req, res) { responseHandler(req, res, "delete"); }
    function headResponseHandler(req, res) { responseHandler(req, res, "head"); }
    function optionsResponseHandler(req, res) { responseHandler(req, res, "options"); }
    function patchResponseHandler(req, res) { responseHandler(req, res, "patch"); }
    
    function responseHandler(request, response, method) {
        var handle = {};
        try {
            var controller = request.params.controller;
            var action = request.params.action;
            if (!controller) controller = "";
            if (!action) action = "";

            handle = api.FindRoute(controller, action, method);
        } catch (exception) {
            if (exception == "Controller not found") {
                notFoundControllerHandler(request, response);
            } else if (exception == "Action not found") {
                notFoundActionHandler(request, response);
            } else {
                throw "Unknown Error";
            }
        }
        handle(request, response);
    };
    
}

MvcApi.prototype.FindRoute = function (controllerName, actionName, method) {
    //find matching controller and action (without case sensitivity)
    for (var controller in api) {
        if (controller.toLowerCase() === controllerName.toLowerCase()) {
            for (var action in api[controller]) {
                if (action.toLowerCase() === (method + actionName.toLowerCase())) {
                    return api[controller][action];
                }
            }
            throw "Action not found";
        }
    }
    throw "Controller not found";
};

server.use(restify.fullResponse()).use(restify.bodyParser());
server.listen(8081, function () { console.log('%s listening at %s', server.name, server.url); });