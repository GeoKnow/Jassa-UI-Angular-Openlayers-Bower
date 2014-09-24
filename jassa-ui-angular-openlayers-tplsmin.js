/*
 * jassa-ui-angular
 * https://github.com/GeoKnow/Jassa-UI-Angular

 * Version: 0.8.1 - 2014-09-24
 * License: MIT
 */
angular.module("ui.jassa.openlayers",["ui.jassa.openlayers.tpls","ui.jassa.openlayers.jassa-map-ol"]),angular.module("ui.jassa.openlayers.tpls",[]),jassa.setOlMapCenter=function(a,b){var c=b.zoom,d=b.center,e=null;if(d&&null!=d.lon&&null!=d.lat){var f=new OpenLayers.LonLat(d.lon,d.lat);e=f.clone().transform(a.displayProjection,a.projection)}null!=e?a.setCenter(e,c):null!=c&&a.setZoom(c)},angular.module("ui.jassa.openlayers.jassa-map-ol",[]).controller("JassaMapOlCtrl",["$scope","$q",function(a){a.loadingSources=[],a.items=[];var b=function(b){var c=a.map.widget;if(b.zoomClusterBounds)c.addBox(b.id,b.zoomClusterBounds);else{var d=b.wkt,e=d.getLiteralLexicalForm();c.addWkt(b.id,e,b)}};a.$watchCollection("items",function(){var c=a.map.widget;c.clearItems(),_(a.items).each(function(a){b(a)})});var c=function(a,b){var c=a.fetchData(b),d=c.pipe(function(a){return a=_(a).compact()});return d},d=function(b,d,e){var f=_(a.loadingSources).indexBy("id"),g=f[b];g?g.promise.abort&&g.promise.abort():(g={id:b,requestId:0},f[b]=g,a.loadingSources.push(g));var h=++g.requestId,i=c(d,e),j=i.pipe(function(c){return f[b].requestId==h?(c=_(c).compact(!0),jassa.util.ArrayUtils.removeByGrep(a.loadingSources,function(a){return a.id===b}),jassa.util.ArrayUtils.addAll(a.items,c),a.$$phase||a.$root.$$phase||a.$apply(),c):void 0});return g.promise=j,j},e=function(a,b){var c=[];_(a).each(function(a,e){var f=d(""+e,a,b);c.push(f)});var e=jQuery.when.apply(window,c).pipe(function(){var a=_(arguments).flatten(!0);return a});return e},f=function(){jassa.util.ArrayUtils.clear(a.items);{var b=a.sources,c=jassa.geo.openlayers.MapUtils.getExtent(a.map);e(b,c)}};a.ObjectUtils=jassa.util.ObjectUtils,a.$watch("config",function(b,c){_(b).isEqual(c)||jassa.setOlMapCenter(a.map,b)},!0),a.$watch("[map.center, map.zoom]",function(){f()},!0),a.$watchCollection("sources",function(){f()})}]).directive("jassaMapOl",["$compile",function(a){return{restrict:"EA",replace:!0,template:"<div></div>",controller:"JassaMapOlCtrl",scope:{config:"=",sources:"=",onSelect:"&select",onUnselect:"&unselect"},link:function(b,c){var d=jQuery(c).ssbMap(),e=d.data("custom-ssbMap"),f=e.map;f.widget=e,b.map=f,jassa.setOlMapCenter(b.map,b.config);var g='<span ng-show="loadingSources.length > 0" class="label label-primary" style="position: absolute; right: 10px; bottom: 25px; z-index: 1000;">Waiting for data from <span class="badge">{{loadingSources.length}}</span> sources... </span>',h=a(g)(b);c.append(h);var i=function(){var a=b.map.getCenter(),c=a.transform(b.map.projection,b.map.displayProjection);b.config.center={lon:c.lon,lat:c.lat},b.config.zoom=b.map.getZoom(),b.$root.$$phase||b.$apply()};d.on("ssbmapfeatureselect",function(a,c){b.onSelect({data:c})}),d.on("ssbmapfeatureunselect",function(a,c){b.onUnselect({data:c})}),f.events.register("moveend",this,i),f.events.register("zoomend",this,i)}}}]),function(a){a.widget("custom.ssbMap",{_create:function(){var a=this;this.wktParser=new OpenLayers.Format.WKT;this.options;this.idToBox={},this.domElement=this.element.get(0),this.options.zoomLabel="Click to\nzoom in\non the\ndata",this.idToFeature={};var b=new OpenLayers.Control.PanZoomBar(null);b=OpenLayers.Util.extend(b,{draw:function(){return OpenLayers.Control.PanZoomBar.prototype.draw.apply(this,[new OpenLayers.Pixel(250,0)]),this.div}});var c={projection:new OpenLayers.Projection("EPSG:900913"),displayProjection:new OpenLayers.Projection("EPSG:4326"),units:"m",controls:[new OpenLayers.Control.Navigation,b,new OpenLayers.Control.MousePosition,new OpenLayers.Control.ScaleLine,new OpenLayers.Control.Attribution]};this.map=new OpenLayers.Map(this.domElement,c);var d=OpenLayers.Util.getParameters(window.location.href).renderer;d=d?[d]:OpenLayers.Layer.Vector.prototype.renderers;var e=OpenLayers.Feature.Vector.style["default"];this.styles={},this.styles.hoverStyle=OpenLayers.Util.extend(OpenLayers.Util.extend({},e),{fillColor:"#8080ff",fillOpacity:.4,stroke:!0,strokeLinecap:"round",strokeWidth:1,strokeColor:"#5050a0",pointRadius:12,label:a.options.zoomLabel,fontColor:"#8080ff",fontWeight:"bold"}),this.styles.markerStyle=OpenLayers.Util.extend(OpenLayers.Util.extend({},e),{graphicOpacity:.8,graphicWidth:31,graphicHeight:31,graphicYOffset:-31,graphicXOffset:-16,fillColor:"${fillColor}",strokeColor:"${strokeColor}",fontColor:"${fontColor}",fontSize:"12px",fontFamily:"Courier New, monospace",fontWeight:"bold",label:"${shortLabel}",labelYOffset:21}),this.styles.boxStyle=OpenLayers.Util.extend(OpenLayers.Util.extend({},e),{fillColor:"#8080ff",fillOpacity:.2,stroke:!0,strokeLinecap:"round",strokeWidth:1,strokeColor:"#7070ff",pointRadius:12,label:a.options.zoomLabel,fontColor:"#8080ff",fontWeight:"bold"}),this.boxLayer=new OpenLayers.Layer.Vector("Boxes",{projection:new OpenLayers.Projection("EPSG:4326"),visibility:!0,displayInLayerSwitcher:!0,renderers:d}),this.featureLayer=new OpenLayers.Layer.Vector("Features",{projection:new OpenLayers.Projection("EPSG:4326"),visibility:!0,displayInLayerSwitcher:!0,styleMap:new OpenLayers.StyleMap({"default":new OpenLayers.Style(this.styles.markerStyle)}),renderers:d});var f=new OpenLayers.Layer.OSM("Mapnik","http://a.tile.openstreetmap.org/${z}/${x}/${y}.png",{numZoomLevels:19});this.map.addLayers([f,this.boxLayer,this.featureLayer]),this.map.events.register("moveend",this,function(b){a._trigger("mapevent",b,{map:a.map})}),this.map.events.register("zoomend",this,function(b){a._trigger("mapevent",b,{map:a.map})});this.highlightController=new OpenLayers.Control.SelectFeature(this.boxLayer,{hover:!0,highlightOnly:!0,selectStyle:this.styles.hoverStyle,eventListeners:{beforefeaturehighlighted:function(a){var b=a.feature,c=b.geometry;return c instanceof OpenLayers.Geometry.Point?!1:void 0}}}),this.highlightController.handlers.feature.stopDown=!1,this.map.addControl(this.highlightController),this.highlightController.activate(),this.selectFeatureController=new OpenLayers.Control.SelectFeature([this.boxLayer,this.featureLayer],{onUnselect:function(b){var c=b.attributes,d=null;a._trigger("featureUnselect",d,c)},onSelect:function(b){var c=b.attributes,d=b.geometry,e=this.handlers.feature.evt.xy;if(c.zoomable&&d instanceof OpenLayers.Geometry.Polygon){var f=a.map.getLonLatFromViewPortPx(e),g=a.map.getZoom(),h=g+1,i=a.map.getNumZoomLevels();h>=i&&(h=i-1),a.map.setCenter(f,h)}else{var j=null;a._trigger("featureSelect",j,c)}}}),this.selectFeatureController.handlers.feature.stopDown=!1,this.map.addControl(this.selectFeatureController),this.selectFeatureController.activate();var g=new OpenLayers.LonLat(-3.56,56.07),h=g.clone().transform(this.map.displayProjection,this.map.projection);this.map.setCenter(h,3),this.redraw()},getFeatureLayer:function(){return this.featureLayer},redraw:function(){this.boxLayer.redraw(),this.featureLayer.redraw()},addWkt:function(a,b,c){var d=this.wktParser.read(b);d.geometry.transform(this.map.displayProjection,this.map.projection),d.attributes=c,this.idToFeature[a]=d,this.featureLayer.addFeatures([d])},addItem:function(a,b,c,d){var e=this.idToFeature[a];e&&this.removeItem(a),e=this.createMarker(a,b,c),this.idToFeature[a]=e,d&&this.featureLayer.addFeatures([e])},setVisible:function(a,b){var c=this.idToFeature.get(a);c&&(b?this.featureLayer.addFeatures([c]):this.featureLayer.removeFeatures([c]))},addItems:function(a,b){for(var c in idToLonlat){var d=idToLonlat[c],e=b[c];this.addItem(c,d,e,!0)}},clearItems:function(){this.removeItems(_(this.idToFeature).keys()),this.removeBoxes(_(this.idToBox).keys()),this.featureLayer.destroyFeatures(),this.boxLayer.destroyFeatures()},removeItem:function(a){var b=this.idToFeature[a];b?(this.featureLayer.removeFeatures([b]),delete this.idToFeature[a]):console.log("[WARN] Id "+a+" requested for deletion, but not found in the "+_.keys(this.idToFeature).length+" available ones: ",this.idToFeature)},removeItems:function(a){for(var b=0;b<a.length;++b){var c=a[b];this.removeItem(c)}},_intersectBounds:function(){},addBox:function(a,b){var c=this.idToBox[a];c&&this.removeBox(a);var d=new OpenLayers.Bounds(-179.999,-85,179.999,85),e=new OpenLayers.Bounds(Math.max(b.left,d.left),Math.max(b.bottom,d.bottom),Math.min(b.right,d.right),Math.min(b.top,d.top));e.transform(this.map.displayProjection,this.map.projection);var f=new OpenLayers.LonLat(e.left,e.bottom),g=new OpenLayers.LonLat(e.right,e.top),h=this.map.getPixelFromLonLat(f),i=this.map.getPixelFromLonLat(g),j=10,k=new OpenLayers.Pixel(h.x+j,h.y-j),l=new OpenLayers.Pixel(i.x-j,i.y+j),m=this.map.getLonLatFromPixel(k),n=this.map.getLonLatFromPixel(l),o=new OpenLayers.Bounds(m.lon,m.lat,Math.max(m.lon,n.lon),Math.max(m.lat,n.lat)),p=new OpenLayers.Feature.Vector(o.toGeometry(),{zoomable:!0},this.styles.boxStyle);this.boxLayer.addFeatures([p]),this.idToBox[a]=p},removeBoxes:function(a){var b=this;_(a).each(function(a){b.removeBox(a)})},removeBox:function(a){var b=this.idToBox[a];b&&this.boxLayer.removeFeatures([b])},_doBind:function(){},_pointToScreen:function(a){return a.clone().transform(this.map.displayProjection,this.map.projection)},createMarker:function(a,b,c){var d=b.clone().transform(this.map.displayProjection,this.map.projection),e=new OpenLayers.Geometry.Point(d.lon,d.lat),f=OpenLayers.Util.extend(OpenLayers.Util.extend({},c),{point:b,nodeId:a,label:c.abbr,radius:12}),g=new OpenLayers.Feature.Vector(e,f);return g},getExtent:function(){return this.map.getExtent().transform(this.map.projection,this.map.displayProjection)},getState:function(){var a=this.map,b=a.getCenter(),c=b.transform(a.projection,a.displayProjection),d={lon:c.lon,lat:c.lat},e=a.getZoom(),f={center:d,zoom:e};return console.log("Saved center",d),f},loadState:function(a){if(a){var b=this.map,c=a.center;console.log("Load raw center ",c);var d;if(c){var e=new OpenLayers.LonLat(a.center.lon,a.center.lat);d=e.transform(b.displayProjection,b.projection)}else d=this.map.getCenter();console.log("Loaded center ",d);var f=a.zoom?a.zoom:this.map.getZoom();this.map.setCenter(d,f,!1,!1)}},getElement:function(){return this.domElement}})}(jQuery);