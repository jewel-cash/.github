import React from "react";
import renderer from "react-test-renderer";
import Front from "../src/components/frontpage/front";

it("Front should be displayed", () => {
    const component = renderer.create(
        <Front/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});