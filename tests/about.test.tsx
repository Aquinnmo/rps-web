import assert from "node:assert";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage from "../src/app/about/page";

test("about page highlights both computer strategies", () => {
  const markup = renderToStaticMarkup(<AboutPage />);

  assert.match(markup, /Version 0/);
  assert.match(markup, /Version 1/);
  assert.match(markup, /weighted opening move/i);
  assert.match(markup, /single-order Markov chain/i);
});
