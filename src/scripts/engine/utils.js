var Utils = (function (my) {

    return my;
} (Utils || {}));

Utils.Random = (function (my, parent) {
    //This function generates floating-point between two numbers low (inclusive) and high (exclusive)([low, high))
    my.Float = function (low, high) {
        return Math.random() * (high - low) + low;
    };
    //This function generates random integer between two numbers low (inclusive) and high (exclusive) ([low, high))
    my.Int = function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    };
    return my;
} (Utils.Random || {}, Utils));