sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
        /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller
         */
        function (Controller, Filter, FilterOperator) {
            "use strict";
            var that;
            return Controller.extend("vcpapp.vcpcomponentrequirements.controller.Home", {
                onInit: function () {
                    that = this;
                    this.smartFilterBar = this.getView().byId("smartFilterBar");
                    var donutChart = this.getView().byId("idChartDonut");
                    var heatChart = this.getView().byId("idChartHeat");
                    var mainChart = this.getView().byId("idChart");
                    donutChart.setVizProperties({
                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        }
                    });
                    heatChart.setVizProperties({
                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        }
                    });
                    mainChart.setVizProperties({
                        plotArea: {
                            dataLabel: {
                                visible: true
                            }
                        }
                    });
                    // var today = new Date();
                    // var twoMonthsLater = new Date();
                    // twoMonthsLater.setMonth(today.getMonth() + 2);
                    // var oSelectOption = new sap.ui.comp.smartfilterbar.SelectOption({
                    //     low: today.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
                    //     // high: twoMonthsLater.toISOString().split("T")[0], // Convert to YYYY-MM-DD format
                    //     high : "2023-10-24",
                    //     operator: "BT" // Between operator
                    // });
                    // this.smartFilterBar.getControlConfiguration()[0].addDefaultFilterValue(oSelectOption);
                },
                onAfterRendering: function (params) {
                    var interval = setInterval(() => {
                        var key = this.smartFilterBar.getControlByKey("WEEK_DATE");
                        if (key) {
                            clearInterval(interval);
                            var today = new Date();
                            var twoMonthsLater = new Date();
                            twoMonthsLater.setMonth(today.getMonth() + 2);
                            var obj = {
                                exclude : false,
                                keyField:"WEEK_DATE",
                                operation:"BT",
                                tokenText:today.toISOString().split("T")[0] +"-"+twoMonthsLater.toISOString().split("T")[0],
                                value1:today,
                                value2:twoMonthsLater
                            }
                            var arr = [];
                            arr.push(obj);
                            this.smartFilterBar.setFilterData({
                                WEEK_DATE: {
                                    ranges : arr
                                }
                            });
                            this.smartFilterBar.search();
                        }
                    }, 1000);
                },
                onCardChartItem: function (oEvent) {
                    var id = oEvent.getSource().getId();
                    var sItems = oEvent.getParameters().data;
                    var fieldName, mainObj;
                    var arr = []; var arr1 = []; var arr2 = [];
                    if (id.includes("idChartDonut")) {
                        fieldName = this.byId("idChartDonut").getVisibleDimensions()[0];
                        sItems.forEach((el) => {
                            let value = el.data.ASMB_DESC;
                            let obj = {};
                            obj.key = value;
                            obj.text = value;
                            arr.push(obj);
                        });
                        mainObj = {
                            "ASMB_DESC": {
                                items: arr
                            }
                        }
                        if (this.smartFilterBar.getFilters().length === 0) {
                            this.smartFilterBar.setFilterData(mainObj, true);
                            this.smartFilterBar.search();
                        } else {
                            var existingFilterData = this.smartFilterBar.getFilterData();
                            if (fieldName === "ASMB_DESC") {
                                existingFilterData[fieldName] = {
                                    items: arr
                                };
                            }
                            this.smartFilterBar.setFilterData(existingFilterData, true);
                            this.smartFilterBar.search();
                        }
                    }
                    if (id.includes("idChartHeat")) {
                        var diamensions = this.byId("idChartHeat").getVisibleDimensions();
                        for (let i = 0; i < diamensions.length; i++) {
                            fieldName = this.byId("idChartHeat").getVisibleDimensions()[i];
                            if (fieldName === "ASMB_DESC") {
                                sItems.forEach((el) => {
                                    let value = el.data.ASMB_DESC;
                                    let obj = {};
                                    obj.key = value;
                                    obj.text = value;
                                    arr1.push(obj);
                                });
                                var keys = ["key", "text"]
                                var uArr1 = that.removeDuplicates(arr1, keys)
                            }
                            if (fieldName === "WEEK_DATE") {
                                sItems.forEach((el) => {
                                    let value = el.data.WEEK_DATE;
                                    let obj = {};
                                    obj.key = that.getFormattedDate(value);
                                    obj.text = that.getFormattedDate(value);
                                    arr2.push(obj);
                                });
                                var keys = ["key", "text"]
                                var uArr2 = that.removeDuplicates(arr2, keys)
                            }
                        }
                        mainObj = {
                            "ASMB_DESC": {
                                items: uArr1
                            },
                            "WEEK_DATE": {
                                items: uArr2
                            }
                        }
                        if (this.smartFilterBar.getFilters().length === 0) {
                            this.smartFilterBar.setFilterData(mainObj, true);
                            this.smartFilterBar.search();
                        } else {
                            var existingFilterData = this.smartFilterBar.getFilterData();
                            existingFilterData["ASMB_DESC"] = {
                                items: uArr1
                            };
    
                            existingFilterData["WEEK_DATE"] = {
                                items: uArr2
                            };
    
                            this.smartFilterBar.setFilterData(existingFilterData, true);
                            this.smartFilterBar.search();
                        }
    
                    };
    
                },
                removeDuplicates: function (array, keys) { //Function to remove duplicates in an array
                    const filtered = array.filter(
                        (s => o =>
                            (k => !s.has(k) && s.add(k))
                                (keys.map(k => o[k]).join('|'))
                        )
                            (new Set)
                    );
                    return filtered;
                },
                getFormattedDate: function (value) {
                    var weekDateMilliseconds = value;
                    var date = new Date(weekDateMilliseconds);
                    var year = date.getFullYear();
                    var month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed, so add 1
                    var day = String(date.getDate()).padStart(2, '0');
    
                    var formattedDate = `${year}-${month}-${day}`;
                    return formattedDate;
                },
                onSelectChartItem: function (oEvent) {
                    var selectedDataPoints = this.byId("idChart").getSelectedDataPoints().dataPoints;
                    var filters = [];
                    selectedDataPoints.forEach(el => {
                        var urlPath = el.context.sPath;
                        var jsonPart = urlPath.substring(urlPath.indexOf("'") + 1, urlPath.lastIndexOf("'"));
                        var json = JSON.parse(decodeURIComponent(jsonPart));
                        var fieldNames = Object.keys(json.key);
                        var fieldValues = Object.values(json.key);
                        for (var i = 0; i < fieldNames.length; i++) {
                            var fieldName = fieldNames[i];
                            var value = fieldValues[i];
                            value = value.replace(/^['"]|['"]$/g, '');
                            if (fieldName === "WEEK_DATE") {
                                var matches = value.match(/\((\d+)\)/);
                                var unixTimestamp = parseInt(matches[1]);
                                var dateObject = new Date(unixTimestamp);
                                var year = dateObject.getFullYear();
                                var month = String(dateObject.getMonth() + 1).padStart(2, '0');
                                var day = String(dateObject.getDate()).padStart(2, '0');
                                value = year + '-' + month + '-' + day;;
                            }
                            var oFilter = new Filter({
                                path: fieldName,
                                operator: FilterOperator.EQ,
                                value1: value
                            });
                            filters.push(oFilter);
                        }
                    });
                    this.byId("smartTable").getTable().getBinding("rows").filter(filters);
                }
            });
        });
    