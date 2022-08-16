import React from "react";
import renderer from "react-test-renderer";
import App from "../src/components/app";

it("App should be displayed", () => {
    const component = renderer.create(
        <App/>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});