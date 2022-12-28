import ReactDOM from "react-dom/client";
import * as React from "react";
import { App } from "./components";

const domContainer = document.getElementById("root");
const root = ReactDOM.createRoot(domContainer!);
root.render(<App />);
