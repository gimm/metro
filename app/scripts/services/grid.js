angular.module("metroApp").service("grid", function ($q, $timeout, data) {
    this.tiles = [];
    this.groups = [];

    this.load = function () {
        //fetch tiles and groups info
        var defer = $q.defer();
        $timeout(function() {
            defer.resolve({});
        }, 3000);
        this.tiles = data.tiles;
        this.groups = data.groups;
        return defer.promise;
    };

    this.byId = function (appId) {
        return this.tiles.filter(function (tile) {
           return tile.id == appId;
        }).pop();
    };
    this.removeById = function (appId) {
        angular.forEach(this.tiles, function (tile, index) {
            if(tile.id == appId){
                this.tiles.splice(index, 1);
                console.log('remove tile', tile);
            }
        }, this);
    }

    this.byGroup = function (groupId) {
        return this.tiles.filter(function (tile) {
            return tile.group == groupId;
        });
    };

    //generate layout for group
    this.render = function (groupId) {
        var tiles = this.byGroup(groupId);
        var layout = {};
        var group = {
            'size': 3,
            'tiles': []
        };

        //group's default row and column number, starts from 0
        var maxRow = 2;
        var maxCol = 2;



        //sort tiles by cords, meanwhile get the max cord-x
        tiles.forEach(function (tile) {
            var row = tile.coords.y;
            var col = tile.coords.x;
            maxCol = maxCol > col ? maxCol : col;
            layout["coords"+row+col] = tile;
            if(tile.size ==2){
                //occupied, but don't need placeholder
                layout["coords"+row+(col+1)] = false;
            }
        });

        group.size = maxCol+1;

        for(var x=0; x<=maxCol; x++){
            for(var y=0; y<=maxRow; y++){
                if(!layout.hasOwnProperty("coords"+y+x)){
                    layout["coords"+y+x] = {
                        'id': ['placeholder', groupId, x, y].join('-'),
                        'coords': {'x': x, 'y': y}
                    };
                }
            }
        }

        angular.forEach(layout, function (tile, k) {
            if(angular.isObject(tile)){
                group.tiles.push(tile);
            }
        });

        return group;
    };
    this.update = function () {

    };
});