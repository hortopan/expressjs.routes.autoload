import { RoutesLoader } from "../src/index";
import { expect } from "chai";

describe("#load routes", () => {
  it("load route", () => {
    const routes = RoutesLoader("./test/routes", { recursive: false }).stack;
    expect(routes[0].route.path).to.equal("/typescript");
    expect(routes[1].route.path).to.equal("/");
  });
});

describe("#load routes recursive", () => {
  it("load route recursive", () => {
    const routes = RoutesLoader("./test/routes", { recursive: true }).stack;
    expect(routes[0].route.path).to.equal("/recursive");
    expect(routes[1].route.path).to.equal("/typescript");
    expect(routes[2].route.path).to.equal("/");
  });
});
