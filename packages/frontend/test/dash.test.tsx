import React from "react";
import renderer from "react-test-renderer";
import Dash from "../src/components/dash";

it("Dash should be displayed", () => {
    const component = renderer.create(
        <Dash/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});