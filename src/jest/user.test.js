import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from '../App'

let container = null;
beforeEach(() => {

  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
it("topページ表示", () => {
  act(() => {
    render(<App />, container);
  });
  let userTitle = container.querySelector("[data-testid='usertitle']")
  expect(userTitle.textContent).toBe("会員一覧");

  
});