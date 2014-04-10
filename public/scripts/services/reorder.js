//drag and drop service
angular.module("metroApp").service("reorder", function ($document, grid) {
    console.log("reorder service", grid);
    this.init = function (dragged, scope) {
        this.dragged = dragged;
        this.group = scope;
    }
    this.enter = function (entered) {
        if (this.dragged != entered) {
            //change dragged cords, reorder tiles and group(s)
            var d = grid.byId(this.dragged);
            var e = grid.byId(entered);
            var old = e.order;
            var step = 1;
            if(d.size===1){

            }
            console.log('order', d.order, e.order);
            var direction;
            var start;
            var end;
            if(e.order > d.order){
                direction = 'backward'
                start = d.order;
                end = e.order;
            }else if(e.order < d.order){
                direction = 'forward'
                start = e.order;
                end = d.order;
            }else{
                start = end = e.order;
            }
            console.log(start, end);
            angular.forEach(this.group.items, function (tiles, order) {
                if (order >= start && order <=end) {
                    angular.forEach(tiles, function (tile, index) {
                        if(direction === 'backward'){
                            tile.order -= 1;
                        }else{
                            tile.order += 1;
                        }
                    });
                }
            }, this);
            d.order = old;
            var newLayout = grid.render(this.group.group.id);
            this.group.items = newLayout.items;
            this.group.size = newLayout.size;
            this.group.$apply();


            //var e = grid.byId(entered);


        } else {//enter itself, drag just started

        }
    };
    this.leave = function (leaved) {

    };
});