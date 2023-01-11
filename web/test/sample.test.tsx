import React from "react";
import renderer from "react-test-renderer";

it("Front should be displayed", () => {
    const component = renderer.create(
        <div/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});