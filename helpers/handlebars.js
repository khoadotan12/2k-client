var register = function (Handlebars) {
    var helpers = {
        ifCond: function (v1, v2, options) {
            if (v1 && v2)
                if (v1.toString() === v2.toString()) {
                    return options.fn(this);
                }
            return options.inverse(this);
        },
        json: function (context) {
            return JSON.stringify(context);
        },
        for: function (from, to, block) {
            let accum = '';
            for (let i = from; i <= to; i++)
                accum += block.fn(i);
            return accum;
        },
    }
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }

};

module.exports.register = register;
module.exports.helpers = register(null); 