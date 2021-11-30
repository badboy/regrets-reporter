import * as React from "react";
import { Component, MouseEvent } from "react";
import "photon-colors/photon-colors.css";
import "../shared-resources/photon-components-web/index.css";
import "../shared-resources/photon-components-web/attributes/index.css";
import "../shared-resources/tailwind.css";
import "./index.css";
import { Checkbox } from "../shared-resources/photon-components-web/photon-components/Checkbox";
import "../shared-resources/photon-components-web/photon-components/Checkbox/light-theme.css";
import { browser, Runtime } from "webextension-polyfill-ts";
import Port = Runtime.Port;
import { DisplayError } from "./DisplayError";
import { ExtensionPreferences } from "../background.js/Store";
import { captureExceptionWithExtras } from "../shared-resources/ErrorReporting";
import Button from "../shared-resources/photon-components-web/photon-components/Button";
import { config } from "../config";

export interface ExtensionPreferencesFormProps {}

export interface ExtensionPreferencesFormState {
  loading: boolean;
  extensionPreferences: ExtensionPreferences | null;
  dataDeletionRequested: boolean;
  error: boolean;
}

export class ExtensionPreferencesForm extends Component<
  ExtensionPreferencesFormProps,
  ExtensionPreferencesFormState
> {
  public state = {
    loading: true,
    extensionPreferences: null,
    dataDeletionRequested: false,
    error: false,
  };

  private backgroundContextPort: Port;

  async componentDidMount(): Promise<void> {
    // console.log("Connecting to the background script");
    this.backgroundContextPort = browser.runtime.connect(browser.runtime.id, {
      name: "port-from-options-ui:form",
    });

    this.backgroundContextPort.postMessage({
      requestExtensionPreferences: true,
    });

    this.backgroundContextPort.onMessage.addListener(
      async (m: {
        extensionPreferences?: ExtensionPreferences;
        dataDeletionRequested?: boolean;
      }) => {
        if (m.extensionPreferences) {
          const { extensionPreferences } = m;
          console.log("Options UI received extension preferences", {
            extensionPreferences,
          });
          await this.setState({
            loading: false,
            extensionPreferences,
          });
          return null;
        }
        if (m.dataDeletionRequested) {
          await this.setState({
            loading: false,
            dataDeletionRequested: true,
          });
          return null;
        }
        captureExceptionWithExtras(new Error("Unexpected message"), { m });
        console.error("Unexpected message", { m });
        await this.setState({
          loading: false,
          error: true,
        });
      },
    );
  }

  cancel(event: MouseEvent) {
    event.preventDefault();
    window.close();
  }

  saveExtensionPreferences = async (
    updatedExtensionPreferences: ExtensionPreferences,
  ) => {
    this.backgroundContextPort.postMessage({
      saveExtensionPreferences: { updatedExtensionPreferences },
    });
  };

  handleEnableErrorReportingChange = async changeEvent => {
    await this.saveExtensionPreferences({
      ...this.state.extensionPreferences,
      enableErrorReporting: !this.state.extensionPreferences
        .enableErrorReporting,
    });
  };

  handleHidePrivacySummaryBannerChange = async changeEvent => {
    await this.saveExtensionPreferences({
      ...this.state.extensionPreferences,
      hidePrivacySummaryBanner: !this.state.extensionPreferences
        .hidePrivacySummaryBanner,
    });
  };

  requestDataDeletion = async () => {
    this.backgroundContextPort.postMessage({
      requestDataDeletion: true,
    });
  };

  render() {
    if (this.state.loading || this.state.extensionPreferences === null) {
      return (
        <>
          <div className="p-0 mx-0 my-4">
            <div className="panel-formElements-item">Loading...</div>
          </div>
        </>
      );
    }
    if (this.state.error) {
      return <DisplayError />;
    }
    return (
      <>
        <div className="text-xl font-semibold">Error Reporting</div>
        <div className="my-4">
          <label className="flex items-center">
            <span className="checkbox__label__text flex items-center">
              <Checkbox
                className="w-8 h-8 mr-2"
                label=""
                value="enable_error_reporting"
                checked={this.state.extensionPreferences.enableErrorReporting}
                onChange={this.handleEnableErrorReportingChange}
              />
              <span className="ml-1">
                Allow RegretsReporter to send information about encountered
                errors to Mozilla
              </span>
            </span>
          </label>
        </div>
        <div className="text-xl font-semibold mt-12">Collected Data</div>
        <div className="my-4 flex justify-between items-center">
          <span className="">
            See what data RegretsReporter has collected so far
          </span>
          <a
            className="btn btn-grey ml-4 text-center outline-none"
            target="_blank"
            href={browser.runtime.getURL(`data-viewer/data-viewer.html`)}
          >
            Inspect Collected Data
          </a>
        </div>
        <div className="my-4 flex justify-between items-center">
          <span className="">
            Request that all your RegretsReporter data gets deleted from
            Mozilla's servers
          </span>
          {(this.state.dataDeletionRequested && (
            <span className="text-center font-semibold">
              Data deletion has been requested.
            </span>
          )) || (
            <Button
              onClick={this.requestDataDeletion}
              className="btn btn-grey ml-4"
            >
              Send Data Deletion Request
            </Button>
          )}
        </div>
        <div className="text-xl font-semibold mt-12">Privacy</div>
        <div className="my-4">
          <label className="flex items-center">
            <span className="checkbox__label__text flex items-center">
              <Checkbox
                className="w-8 h-8 mr-2"
                label=""
                value="enable_error_reporting"
                checked={
                  this.state.extensionPreferences.hidePrivacySummaryBanner
                }
                onChange={this.handleHidePrivacySummaryBannerChange}
              />
              <span className="ml-1">
                Hide the privacy summary banner on the{" "}
                <a
                  className="text-red underline"
                  target="_blank"
                  href={browser.runtime.getURL(`get-started/get-started.html`)}
                >
                  instructions page
                </a>
              </span>
            </span>
          </label>
        </div>
        <div className="my-4">
          Please review the{" "}
          <a
            href={config.privacyNoticeUrl}
            target="_blank"
            className="text-red underline"
          >
            privacy notice
          </a>
          .
        </div>
        <div className="text-xl font-semibold mt-12">Instructions</div>
        <div className="my-4">
          General information on how to use this extension:{" "}
          <a
            className="text-red underline"
            target="_blank"
            href={browser.runtime.getURL(`get-started/get-started.html`)}
          >
            RegretReporter Instructions
          </a>
          .
        </div>
        <div className="text-xl font-semibold mt-12">Feedback</div>
        <div className="my-4">
          Do you have feedback about the RegretsReporter? We would love to hear
          it.{" "}
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
        <div className="text-xl font-semibold mt-12">
          Additional information
        </div>
        <div className="my-4">
          Extension version:{" "}
          <code>{this.state.extensionPreferences.extensionVersion}</code>
        </div>
        <div className="my-4">
          Extension Installation ID:{" "}
          <code>
            {this.state.extensionPreferences.extensionInstallationUuid}
          </code>
        </div>
        <div className="my-4">
          Error Reporting ID:{" "}
          <code>
            {
              this.state.extensionPreferences
                .extensionInstallationErrorReportingUuid
            }
          </code>
        </div>
      </>
    );
  }
}
