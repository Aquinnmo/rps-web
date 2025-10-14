import assert from "node:assert";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../src/app/page";

test("home page keeps controls spaced away from the header on small screens", () => {
  const markup = renderToStaticMarkup(<Home />);

  assert.match(markup, /pt-32/);
  assert.match(markup, /top-24/);
  assert.match(markup, /max-w-xs/);
  assert.match(markup, /w-full/);
});
