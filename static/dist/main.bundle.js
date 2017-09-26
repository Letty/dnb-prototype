webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	return new Promise(function(resolve, reject) { reject(new Error("Cannot find module '" + req + "'.")); });
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <timeline></timeline>\n  <person></person>\n  <topic></topic>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'app';
    }
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html")
    })
], AppComponent);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_timeline_component__ = __webpack_require__("../../../../../src/app/components/timeline.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_person_component__ = __webpack_require__("../../../../../src/app/components/person.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_topic_component__ = __webpack_require__("../../../../../src/app/components/topic.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_api_service__ = __webpack_require__("../../../../../src/app/services/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_4__components_timeline_component__["a" /* TimelineComponent */],
            __WEBPACK_IMPORTED_MODULE_5__components_person_component__["a" /* PersonComponent */],
            __WEBPACK_IMPORTED_MODULE_6__components_topic_component__["a" /* TopicComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* HttpModule */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_7__services_api_service__["a" /* ApiService */]
        ],
        bootstrap: [
            __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* AppComponent */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/components/person.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"person-div\">\n  <div class=\"headline-div\"><h3>Personen</h3>\n    <div *ngIf=\"selectedPerson\" class=\"selected-person\">{{selectedPerson.name}}</div>\n  </div>\n  <div class=\"person-list\">\n    <div *ngFor=\"let p of persons | slice:0:10\" class=\"person\" (click)=\"onSelect(p)\">\n      <span [style]=\"setFontSize(p.count)\">{{p.name}}</span>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/components/person.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PersonComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_api_service__ = __webpack_require__("../../../../../src/app/services/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_d3__ = __webpack_require__("../../../../d3/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PersonComponent = (function () {
    function PersonComponent(api, sanitizer) {
        this.api = api;
        this.sanitizer = sanitizer;
        this.min = 1e10;
        this.max = -1e10;
        this.fontScale = __WEBPACK_IMPORTED_MODULE_3_d3__["f" /* scaleLinear */]()
            .range([0.8, 2.5]);
    }
    PersonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.api.getPersons().subscribe(function (result) {
            _this.persons = Object.keys(result).map(function (key) {
                if (result[key].count < _this.min) {
                    _this.min = result[key].count;
                }
                if (result[key].count > _this.max) {
                    _this.max = result[key].count;
                }
                return {
                    id: result[key].id,
                    name: result[key].name,
                    count: result[key].count
                };
            });
            _this.fontScale.domain([_this.min, _this.max]);
        }, function (error) {
            _this.persons = [
                { id: '66048', name: 'z Geschichte 1956-1966', count: 6 },
                { id: '1280', name: '547.8404572', count: 6 },
                { id: '12468', name: 'Deutsche Literatur', count: 405236 },
                { id: '35273', name: 'Medizin, Gesundheit', count: 329684 },
            ];
        }, function () {
        });
    };
    PersonComponent.prototype.onSelect = function (person) {
        this.selectedPerson = person;
        this.api.setFilter(this.selectedPerson.id, 'person');
    };
    PersonComponent.prototype.setFontSize = function (count) {
        var style;
        style = this.sanitizer.bypassSecurityTrustStyle('font-size: ' + this.fontScale(count) + 'em');
        return style;
    };
    return PersonComponent;
}());
PersonComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'person',
        template: __webpack_require__("../../../../../src/app/components/person.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["b" /* DomSanitizer */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser__["b" /* DomSanitizer */]) === "function" && _b || Object])
], PersonComponent);

var _a, _b;
//# sourceMappingURL=person.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/timeline.component.html":
/***/ (function(module, exports) {

module.exports = "<div>\n  <h3>Veröffentlichungsjahr</h3>\n  <div id=\"viz\"></div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/components/timeline.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TimelineComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_api_service__ = __webpack_require__("../../../../../src/app/services/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_d3__ = __webpack_require__("../../../../d3/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TimelineComponent = (function () {
    function TimelineComponent(api, myElement, ren) {
        this.api = api;
        this.myElement = myElement;
        this.ren = ren;
    }
    TimelineComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.api.getYears().subscribe(function (result) {
            _this.years = Object.keys(result).map(function (key) {
                return {
                    id: result[key].id,
                    year: result[key].year,
                    count: result[key].count
                };
            });
            _this.showAreaChart();
        }, function (error) {
        }, function () {
        });
    };
    TimelineComponent.prototype.showAreaChart = function () {
        var margin = { top: 20, bottom: 20, left: 50, right: 20 };
        var height = 200 - margin.top - margin.bottom, width = 1350 - margin.left - margin.right;
        var svg = __WEBPACK_IMPORTED_MODULE_2_d3__["i" /* select */]('#viz').append('svg')
            .attr('height', height + margin.top + margin.bottom)
            .attr('width', width + margin.left + margin.right)
            .attr('class', 'year-area-svg')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        var x = __WEBPACK_IMPORTED_MODULE_2_d3__["h" /* scaleTime */]()
            .rangeRound([0, width]);
        var y = __WEBPACK_IMPORTED_MODULE_2_d3__["g" /* scalePow */]()
            .exponent(0.3)
            .rangeRound([height, 0]);
        var area = __WEBPACK_IMPORTED_MODULE_2_d3__["a" /* area */]()
            .x(function (d) { return x(new Date(d.year, 1, 1)); })
            .y0(height)
            .y1(function (d) { return y(d.count); });
        // ------
        x.domain(__WEBPACK_IMPORTED_MODULE_2_d3__["d" /* extent */](this.years, function (d) {
            return new Date(d.year, 1, 1);
        }));
        y.domain([0, __WEBPACK_IMPORTED_MODULE_2_d3__["e" /* max */](this.years, function (d) {
                return d.count;
            })]);
        svg.append("path")
            .datum(this.years)
            .attr('class', 'area-path')
            .attr("d", area)
            .on('mousemove', function (d) {
            // extraxtion des jahres + infos
            //console.log(x.invert(d3.mouse(this)[0]).getFullYear(), year[new Date(x.invert(d3.mouse(this)[0]).getFullYear(),1,1)]);
        });
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(__WEBPACK_IMPORTED_MODULE_2_d3__["b" /* axisBottom */](x));
        svg.append("g")
            .call(__WEBPACK_IMPORTED_MODULE_2_d3__["c" /* axisLeft */](y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Veröffentlichungen");
    };
    return TimelineComponent;
}());
TimelineComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'timeline',
        template: __webpack_require__("../../../../../src/app/components/timeline.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer2 */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["_0" /* Renderer2 */]) === "function" && _c || Object])
], TimelineComponent);

var _a, _b, _c;
//# sourceMappingURL=timeline.component.js.map

/***/ }),

/***/ "../../../../../src/app/components/topic.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"topic-div\">\n  <div class=\"headline-div\"><h3>Themen</h3>\n    <div *ngIf=\"selectedTopic\" class=\"selected-topic\">{{selectedTopic.keyword}}</div>\n  </div>\n  <div class=\"topic-list\">\n    <div *ngFor=\"let t of topics\" class=\"topic\" (click)=\"onSelect(t)\">\n      {{t.keyword}}\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "../../../../../src/app/components/topic.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TopicComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_api_service__ = __webpack_require__("../../../../../src/app/services/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TopicComponent = (function () {
    function TopicComponent(api) {
        this.api = api;
    }
    TopicComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.api.getTopics().subscribe(function (result) {
            _this.topics = Object.keys(result).map(function (key) {
                return {
                    id: result[key].id,
                    keyword: result[key].keyword,
                    count: result[key].count
                };
            });
        }, function (error) {
            _this.topics = [
                { id: 66048, keyword: 'z Geschichte 1956-1966', count: 6 },
                { id: 1280, keyword: '547.8404572', count: 6 },
                { id: 12468, keyword: 'Deutsche Literatur', count: 405236 },
                { id: 35273, keyword: 'Medizin, Gesundheit', count: 329684 },
            ];
        }, function () {
        });
    };
    TopicComponent.prototype.onSelect = function (topic) {
        this.selectedTopic = topic;
        this.api.setFilter(this.selectedTopic.id, 'topic');
    };
    return TopicComponent;
}());
TopicComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'topic',
        template: __webpack_require__("../../../../../src/app/components/topic.component.html")
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_api_service__["a" /* ApiService */]) === "function" && _a || Object])
], TopicComponent);

var _a;
//# sourceMappingURL=topic.component.js.map

/***/ }),

/***/ "../../../../../src/app/services/api.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApiService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__("../../../http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("../../../../rxjs/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ApiService = (function () {
    function ApiService(http) {
        this.http = http;
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
    }
    ApiService.prototype.getTopics = function () {
        return this.http.get('/getTopTopics').map(function (res) { return res.json(); });
    };
    ApiService.prototype.getPersons = function () {
        return this.http.get('/getTopPeople').map(function (res) { return res.json(); });
    };
    ApiService.prototype.getYears = function () {
        return this.http.get('/getTimeline').map(function (res) { return res.json(); });
    };
    ApiService.prototype.setFilter = function (id, filterName) {
        if (filterName === 'topic') {
            this.http.put('/setFilterForTopic', { id: id }, this.headers)
                .subscribe(function (res) {
                // console.log(res);
            }, function (error) {
                console.log(error);
            });
        }
        else if (filterName === 'person') {
            this.http.put('/setFilterForPerson', { id: id }, this.headers)
                .subscribe(function (res) {
                // console.log(res);
            }, function (error) {
                console.log(error);
            });
        }
        else if (filterName === 'year') {
            this.http.put('/setFilterForYear', { id: id }, this.headers)
                .subscribe(function (res) {
                // console.log(res);
            }, function (error) {
                console.log(error);
            });
        }
    };
    return ApiService;
}());
ApiService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]) === "function" && _a || Object])
], ApiService);

var _a;
//# sourceMappingURL=api.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_20" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map