!function t(n,i,r){function e(s,c){if(!i[s]){if(!n[s]){var p="function"==typeof require&&require;if(!c&&p)return p(s,!0);if(o)return o(s,!0);var a=new Error("Cannot find module '"+s+"'");throw a.code="MODULE_NOT_FOUND",a}var u=i[s]={exports:{}};n[s][0].call(u.exports,function(t){var i=n[s][1][t];return e(i?i:t)},u,u.exports,t,n,i,r)}return i[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)e(r[s]);return e}({1:[function(t,n,i){var r=function(t){this.entity=t};r.prototype.draw=function(){console.log("Drawing a bird")},i.BirdGraphicsComponent=r},{}],2:[function(t,n,i){var r=t("../components/graphics/bird"),e=function(){console.log("Creating Bird Entity");var t=new r.BirdGraphicsComponent(this);this.components={graphics:t}};i.Bird=e},{"../components/graphics/bird":1}],3:[function(t,n,i){var r=t("./systems/graphics"),e=t("./entities/bird"),o=function(){this.entities=[new e.Bird],this.graphics=new r.GraphicsSystem(this.entities)};o.prototype.run=function(){this.graphics.run()},i.FlappyBird=o},{"./entities/bird":2,"./systems/graphics":5}],4:[function(t,n,i){var r=t("./flappy_bird");document.addEventListener("DOMContentLoaded",function(){var t=new r.FlappyBird;t.run()})},{"./flappy_bird":3}],5:[function(t,n,i){var r=function(t){this.entities=t};r.prototype.run=function(){for(var t=0;5>t;t++)this.tick()},r.prototype.tick=function(){for(var t=0;t<this.entities.length;t++){var n=this.entities[t];!1 in n.components||n.components.graphics.draw(this.context)}},i.GraphicsSystem=r},{}]},{},[4]);