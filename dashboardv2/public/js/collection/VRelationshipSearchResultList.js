/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(['require',
    'collection/BaseCollection',
    'models/VRelationSearch',
    'utils/UrlLinks'
], function(require, BaseCollection, VRelationSearch, UrlLinks) {
    'use strict';
    var VRelationshipSearchResultList = BaseCollection.extend(
        //Prototypal attributes
        {
            url: UrlLinks.relationshipSearchApiUrl(),

            model: VRelationSearch,

            initialize: function(options) {
                _.extend(this, options);
                this.modelName = 'VRelationshipSearchResultList';
                this.modelAttrName = '';
                this.dynamicTable = false;
            },
            parseRecords: function(resp, options) {
                this.queryType = resp.queryType;
                this.queryText = resp.queryText;
                this.referredEntities = resp.referredEntities;
                if (resp.attributes) {
                    this.dynamicTable = true;
                    var entities = [];
                    _.each(resp.attributes.values, function(obj) {
                        var temp = {};
                        _.each(obj, function(val, index) {
                            var key = resp.attributes.name[index];
                            if (key == "__guid") {
                                key = "guid"
                            }
                            temp[key] = val;
                        });
                        entities.push(temp);
                    });
                    return entities;
                } else if (resp.entities) {
                    this.dynamicTable = false;
                    return resp.entities ? resp.entities : [];
                } else {
                    return [];
                }
            },
            getBasicRearchResult: function(options) {
                var url = UrlLinks.relationshipSearchApiUrl('basic');

                options = _.extend({
                    contentType: 'application/json',
                    dataType: 'json',
                }, options);
                options.data = JSON.stringify(options.data);

                return this.constructor.nonCrudOperation.call(this, url, 'POST', options);
            }
        },
        //Static Class Members
        {
            /**
             * Table Cols to be passed to Backgrid
             * UI has to use this as base and extend this.
             *
             */
            tableCols: {}
        }
    );
    return VRelationshipSearchResultList;
});