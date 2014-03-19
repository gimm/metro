//drag and drop service
angular.module("metroApp").service("reorder", function ($document, grid) {
    console.log("reorder service", grid);
    this.init = function (dragged, scope) {
        this.dragged = dragged;
        this.group = scope;
    }
    this.enter = function (entered) {
        if(this.dragged != entered){
            //change dragged cords, reorder tiles and group(s)
            var d = grid.byId(this.dragged);
            if(entered.indexOf('placeholder')===0){//placeholder
                if(d.size !== 2){
                    angular.forEach(this.group.layout, function (tile, index) {
                        if(tile.id == entered){
                            this.group.layout.splice(index, 1);
                            console.log('remove tile', tile);

                        }
                    }, this);
                    var newCoords = this.getCoordsById(entered);
                    d.coords = newCoords;
                    this.group.$apply();
                }else{

                }

            }else{//tile

            }
            //var e = grid.byId(entered);




        }else{//enter itself, drag just started

        }
    };
    this.leave = function (leaved) {
        if(leaved == this.dragged){
            var draggedTile = grid.byId(this.dragged);
            console.log('add tile', draggedTile.coords);
            this.group.layout.push({
                'id': ['placeholder', this.group.id, draggedTile.coords.x, draggedTile.coords.y].join('-'),
                'coords': {'x': draggedTile.coords.x, 'y': draggedTile.coords.y}
            });
            this.group.$apply();
        }else{

        }
    };
    this.getCoordsById = function (appId) {
        var coords = {};
        if(appId.indexOf('placeholder')===0){
            var parts = appId.split('-');
            coords.x = parts[2];
            coords.y = parts[3];
        }else{
            coords = grid.byId(appId).coords;
        }
        return coords;
    };
});