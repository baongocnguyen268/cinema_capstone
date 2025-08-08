import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { generateRoutes } from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>{generateRoutes()}</Routes>
    </BrowserRouter>
  );
}

export default App;
