function Inventory(maxItemCount) {
    var maxItemCount = maxItemCount;
    var items = new Array(maxItemCount);

    this.getItems = function () {
        var itemsX = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i] != null) {
                itemsX.push(items[i]);
            }
        }        
        return itemsX;
    };

    this.getItem = function (i) {
        return items[i];
    }

    this.addItem = function (item) {
        var isAdded = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i] == null) {
                items[i] = item;
                isAdded = true;
                break;
            }
        }
        return isAdded;
    }

    this.removeItem = function (item) {
        for (var i = 0; i < items.length; i++) {
            if (items[i].guid == item.guid) {
                items[i] = null;
                return;
            }
        }
    }

    this.isFull = function () {
        var size = 0;
        for (var i = 0; i < items.length; i++) {
            if (items[i] != null)
                size++;
        }
        return size == items.length;
    }

    this.hasItems = function () {
        var yes = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i] != null)
                yes = true;
        }
        return yes;
    }

    this.removeItems = function () {
        for (var i = 0; i < items.length; i++) {
            items[i] = null;
        }
    }
}