import assert from "node:assert";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../src/app/page";

test("home page brain power selector is responsive", () => {
  const markup = renderToStaticMarkup(<Home />);

  assert.match(markup, /Record/);
  assert.match(markup, /Wins - Ties - Losses/);
  assert.match(markup, /Streak/);
  assert.match(markup, /Brain Power Level/);
  assert.match(markup, /Kindergarden/);
  assert.match(markup, /Elementary/);
  assert.match(markup, /class=\"[^\"]*max-w-md[^\"]*\"/);
  assert.match(markup, /padding-top:calc\(5rem \+ env\(safe-area-inset-top\)\)/);
});
