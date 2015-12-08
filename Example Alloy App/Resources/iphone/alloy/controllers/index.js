function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __alloyId0 = [];
    $.__views.win1 = Ti.UI.createWindow({
        id: "win1",
        title: "Google Tasks",
        backgroundColor: "white",
        barColor: "black"
    });
    $.__views.table = Ti.UI.createTableView({
        id: "table"
    });
    $.__views.win1.add($.__views.table);
    $.__views.tab1 = Ti.UI.createTab({
        window: $.__views.win1,
        id: "tab1",
        title: "Google Tasks",
        icon: "/images/259-list.png"
    });
    __alloyId0.push($.__views.tab1);
    $.__views.index = Ti.UI.createTabGroup({
        tabs: __alloyId0,
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    $.index.addEventListener("open", function() {
        var activity = $.index.getActivity();
        activity.invalidateOptionsMenu();
    });
    Alloy.Globals.googleAuth;
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;