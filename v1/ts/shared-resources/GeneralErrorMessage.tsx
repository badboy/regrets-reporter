import * as React from "react";
import { MouseEvent } from "react";
import { browser } from "webextension-polyfill-ts";
import { config } from "../config";
import { Link } from "../shared-resources/photon-components-web/photon-components/Link";

export class GeneralErrorMessage extends React.Component<
  {
    message?: string;
    additionalInfo?: string;
    eventId?: string;
  },
  {}
> {
  constructor(props) {
    super(props);
  }

  cancel(event: MouseEvent) {
    event.preventDefault();
    window.close();
  }

  render() {
    return (
      <>
        <div className="p-8 border-b border-grey-30 bg-white">
          <div className="text-lg font-sans font-semibold leading-none mb-5">
            {this.props.message || "An error occurred"}
          </div>
          <div className="text-base">
            {this.props.additionalInfo ||
              "Don't worry. This may be a temporary glitch. Please try again."}
          </div>
          <div className="text-base mt-5">
            If this problem persists, help us fix it!{" "}
            <a
              href={config.feedbackSurveyUrl}
              rel="noreferrer noopener"
              target="_blank"
              className="text-red underline"
            >
              Send us feedback
            </a>
            .
          </div>
        </div>

        <div className="p-5 bg-white mt-3">
          <div className="text-xs">
            Information about this extension:{" "}
            <Link
              className="inline text-red"
              target="_blank"
              href={browser.runtime.getURL(`get-started/get-started.html`)}
            >
              RegretReporter Instructions
            </Link>
          </div>
        </div>
      </>
    );
  }
}
