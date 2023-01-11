import isomorphic from "./index.js";

isomorphic.fetch = self.fetch.bind(self);

export default isomorphic;
