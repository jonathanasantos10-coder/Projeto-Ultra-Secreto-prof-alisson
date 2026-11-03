import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './menu/menu';
import * as i0 from "@angular/core";
export class App {
    static ɵfac = function App_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || App)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: App, selectors: [["app-root"]], decls: 2, vars: 0, template: function App_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "app-menu")(1, "router-outlet");
        } }, dependencies: [RouterOutlet, Menu], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n  background: var(--%NS%areia-100);\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(App, [{
        type: Component,
        args: [{ selector: 'app-root', imports: [RouterOutlet, Menu], template: "<app-menu></app-menu>\n<router-outlet></router-outlet>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n  background: var(--areia-100);\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 11 }); })();
