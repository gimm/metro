angular.module("metroApp").service("grid", function ($q, $timeout, data) {
    this.MAX_ROW = 3;
    this.size = {
        'em': 0
    };
    this.tiles = [];
    this.groups = [];

    this.load = function () {
        //fetch tiles and groups info
        var defer = $q.defer();
        $timeout(function() {
            defer.resolve({});
        }, 1000);
        this.tiles = data.tiles;
        this.groups = data.groups;
        return defer.promise;
    };

    this.tileById = function (appId) {
        return this.tiles.filter(function (tile) {
           return tile.id == appId;
        }).pop();
    };
    this.isSingle = function (tile) {
        var tiles = this.byGroup(tile.group).filter(function (t) {
            return t.order == tile.order;
        });
        return tiles.length === 1;
    };

    this.tileByGroup = function (groupId) {
        return this.tiles.filter(function (tile) {
            return tile.group == groupId;
        });
    };
    this.groupById = function (groupId) {
        return this.groups.filter(function (group) {
            return group.id == groupId;
        }).pop();
    };
    this.groupSize = function (groupId) {
        var tiles = this.tileByGroup(groupId);
        tiles.sort(function (t1, t2) {
            return t1.order - t2.order;
        });
        var maxOrder = tiles[tiles.length-1].order;
        return (Math.ceil(maxOrder / this.MAX_ROW)) * 2;
    };

    //generate layout for group
    this.render = function () {
        this.size.em = 0;
        angular.forEach(this.groups, function (group) {
            group.tiles = this.tileByGroup(group.id);
            group.size = this.groupSize(group.id);
            this.size.em += (group.size*10 +2);
        }, this);
        console.log(this.size, 'fff');
    };
    this.update = function () {

    };
});