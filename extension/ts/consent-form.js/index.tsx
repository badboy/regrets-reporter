import * as React from "react";
import * as ReactDOM from "react-dom";

import { ErrorBoundary } from "../shared-react-resources/ErrorBoundary";
import { ConsentForm } from "./ConsentForm";

ReactDOM.render(
  <ErrorBoundary>
    <ConsentForm />
  </ErrorBoundary>,
  document.getElementById("app"),
);
