'use strict';

(function() {

    angular.module('core.domain')
        .factory('EntityMapper', [function() {
            var EntityMapper = function(entityConstructor) {
                this.entityConstructor = entityConstructor;
            };

            EntityMapper.prototype = {
                toRaw: function(entity) {
                    return angular.fromJson(entity);
                },
                toEntity: function(raw) {
                    return new this.entityConstructor(raw);
                },
                toRawArray: function(entities) {
                    return angular.fromJson(entities);
                },
                toEntities: function(rawArray, iterator) {
                    var list = [],
                        obj;
                    if (rawArray instanceof Array) {
                        for (var l = rawArray.length, i = 0; i < l; i++) {
                            obj = new this.entityConstructor(rawArray[i]);
                            if (typeof(iterator) === 'function') {
                                iterator(obj);
                            }
                            list.push(obj);
                        }
                    }
                    return list;
                }
            };

            return EntityMapper;
        }]);

})();
