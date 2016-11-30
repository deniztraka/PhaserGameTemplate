function Inventory() {
    var maxItemCount = 5;
    var items = new Array(maxItemCount);

    this.getItems = function () {
        return items;
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
}