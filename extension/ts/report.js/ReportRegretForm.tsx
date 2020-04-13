import * as React from "react";
import { Component, MouseEvent } from "react";
import "photon-colors/photon-colors.css";
import "../components/photon-components-web/index.css";
import "../components/photon-components-web/attributes";
import "../components/tailwind.css";
import { Input } from "../components/photon-components-web/photon-components/Input";
import { Radio } from "../components/photon-components-web/photon-components/Radio";
// import { Checkbox } from "../components/photon-components-web/photon-components/Checkbox";
import { Link } from "../components/photon-components-web/photon-components/Link";
import { browser, Runtime } from "webextension-polyfill-ts";
import Port = Runtime.Port;
import { RegretReport } from "../background.js/ReportSummarizer";
import * as LikertScale from "likert-react";
import {
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentVeryDissatisfied,
} from "react-icons/all";
import { DisplayError } from "../components/DisplayError";
// import { TextArea } from "../components/photon-components-web/photon-components/TextArea";

export interface ReportRegretFormProps {}

export interface ReportRegretFormState {
  loading: boolean;
  videoThumbUrl: null | string;
  reportData: any;
  userSuppliedRegretCategory: string;
  userSuppliedOtherRegretCategory: string;
  // userSuppliedOptionalComment: string;
  userSuppliedSeverity: null | number;
  // includeWatchHistory: boolean;
  error: boolean;
}

export class ReportRegretForm extends Component<
  ReportRegretFormProps,
  ReportRegretFormState
> {
  public state = {
    loading: true,
    videoThumbUrl: null,
    reportData: null,
    userSuppliedRegretCategory: "",
    userSuppliedOtherRegretCategory: "",
    // userSuppliedOptionalComment: "",
    userSuppliedSeverity: null,
    // includeWatchHistory: true,
    error: false,
  };

  private backgroundContextPort: Port;

  componentDidMount(): void {
    // console.log("Connecting to the background script");
    this.backgroundContextPort = browser.runtime.connect(browser.runtime.id, {
      name: "port-from-report-regret-form",
    });

    // Send a request to gather the report data
    this.backgroundContextPort.postMessage({
      requestReportData: true,
    });

    // When we have received report data, update state that summarizes it
    this.backgroundContextPort.onMessage.addListener(
      async (m: { reportData: { regretReport: RegretReport } }) => {
        if (m.reportData) {
          const { reportData } = m;
          console.log({ reportData });
          if (!reportData || !reportData.regretReport) {
            await this.setState({
              reportData,
              loading: false,
              error: true,
            });
            throw new Error(
              "The report data was not available at the time of initiating the regret form",
            );
          }
          const videoThumbUrl = `https://img.youtube.com/vi/${reportData.regretReport.regretted_youtube_navigation_brief_video_metadata.video_id}/mqdefault.jpg`;
          this.setState({
            reportData,
            videoThumbUrl,
            loading: false,
          });
        }
      },
    );
  }

  inspectReportContents(event: MouseEvent) {
    event.preventDefault();
    // TODO: Open the report in a new tab/window via a data url
  }

  cancel(event: MouseEvent) {
    event.preventDefault();
    window.close();
  }

  report = async (event: MouseEvent) => {
    event.preventDefault();
    this.backgroundContextPort.postMessage({
      reportedRegret: {
        reportData: this.state.reportData,
        userSuppliedRegretCategory: this.state.userSuppliedRegretCategory,
        userSuppliedOtherRegretCategory: this.state
          .userSuppliedOtherRegretCategory,
        // userSuppliedOptionalComment: this.state.userSuppliedOptionalComment,
        userSuppliedSeverity: this.state.userSuppliedSeverity,
        // includeWatchHistory: this.state.includeWatchHistory,
      },
    });
    window.close();
  };

  handleUserSuppliedRegretCategoryOptionChange = changeEvent => {
    console.log({ changeEvent });
    this.setState({
      userSuppliedRegretCategory: changeEvent.target.value,
    });
  };

  render() {
    if (this.state.error) {
      return <DisplayError />;
    }
    if (this.state.loading) {
      return (
        <header className="panel-section panel-section-header">
          <div className="icon-section-header">
            <img
              src="../icons/green-extensionsicon.svg"
              width="32"
              height="32"
            />
          </div>
          <div className="text-section-header text-nowrap">Loading ...</div>
        </header>
      );
    }
    return (
      <form>
        <header className="panel-section panel-section-header">
          <div className="icon-section-header">
            <img
              src="../icons/green-extensionsicon.svg"
              width="32"
              height="32"
            />
          </div>
          <div className="text-section-header">
            Report a "YouTube Regret" to Mozilla
          </div>
        </header>

        {/*
        <div class="panel-section-separator"></div>

        <div class="panel-section panel-section-formElements">
          <div class="panel-formElements-item">
            <strong>Choose the video that altered your recommendations for the worse:</strong>
          </div>
        </div>

        <div class="panel-section panel-section-list">

          <div class="panel-list-item">
            <div class="icon"></div>
            <div class="text">List Item</div>
            <div class="text-shortcut">13:12</div>
          </div>

          <div class="panel-list-item">
            <div class="icon"></div>
            <div class="text">List Item</div>
            <div class="text-shortcut">foo</div>
          </div>

          <div class="panel-list-item">
            <div class="icon"></div>
            <div class="text">List Item</div>
            <div class="text-shortcut">bar</div>
          </div>

        </div>
        */}

        <div className="panel-section panel-section-formElements pb-0">
          <div className="panel-formElements-item">
            <h2 className="font-bold">I regret watching this video:</h2>
          </div>
        </div>

        <div className="px-0">
          <div className="flex -mx-0">
            <div className="w-1/2 px-0">
              <div className="panel-section panel-section-formElements">
                <div className="panel-formElements-item">
                  <div className="flex-1 mr-1">
                    <div>
                      <img
                        className="w-full"
                        src={this.state.videoThumbUrl}
                        alt=""
                      />
                    </div>
                    <div className="mb-0 mt-1">
                      <h4 className="text-sm font-medium">
                        {
                          this.state.reportData.regretReport
                            .regretted_youtube_navigation_brief_video_metadata
                            .video_title
                        }
                      </h4>
                      <p className="mt-1 font-hairline text-xs text-grey-darker">
                        {
                          this.state.reportData.regretReport
                            .regretted_youtube_navigation_brief_video_metadata
                            .view_count_at_navigation_short
                        }{" "}
                        ·{" "}
                        {
                          this.state.reportData.regretReport
                            .regretted_youtube_navigation_brief_video_metadata
                            .video_posting_date
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 px-0">
              <div className="pb-0 panel-section panel-section-formElements">
                <div className="panel-formElements-item mb-6">
                  <div>
                    <p className="mb-3">
                      <span className="input__label">
                        Why do you regret watching the video?
                        {/*How were your recommendations affected?*/}
                      </span>
                    </p>
                    <ul className="list-none">
                      {[
                        {
                          value: "racist-sexist-homo-trans-phobic-content",
                          label:
                            "Racist, sexist, or homophobic/transphobic content",
                        },
                        {
                          value: "sexual-content",
                          label: "Sexual content",
                        },
                        {
                          value: "extreme-ideological-content-content",
                          label: "Extreme ideological content",
                        },
                        {
                          value: "violence-disturbing-content",
                          label: "Violence/disturbing content",
                        },
                        {
                          value: "conspiracy-theories",
                          label: "Conspiracy theories",
                        },
                        {
                          value: "not-appropriate-for-my-age-group",
                          label:
                            "Not appropriate for my age group (eg. kids content)",
                        },
                        {
                          value: "bad-music",
                          label: "Bad music",
                        },
                        {
                          value: "slanderous-content",
                          label: "Slanderous content",
                        },
                      ].map(item => (
                        <li key={item.value} className="mb-2">
                          <Radio
                            name="user_supplied_regret_category"
                            value={item.value}
                            label={item.label}
                            checked={
                              this.state.userSuppliedRegretCategory ===
                              item.value
                            }
                            onChange={
                              this.handleUserSuppliedRegretCategoryOptionChange
                            }
                          />
                        </li>
                      ))}
                      <li className="mb-2">
                        <Radio
                          name="user_supplied_regret_category"
                          value="other"
                          label="Other: "
                          checked={
                            this.state.userSuppliedRegretCategory === "other"
                          }
                          onChange={
                            this.handleUserSuppliedRegretCategoryOptionChange
                          }
                        />
                        <Input
                          className="input__field w-full my-3"
                          id="user_supplied_other_regret_category"
                          name="user_supplied_other_regret_category"
                          placeholder=""
                          disabled={
                            this.state.userSuppliedRegretCategory !== "other"
                          }
                          value={this.state.userSuppliedOtherRegretCategory}
                          onChange={changeEvent => {
                            this.setState({
                              userSuppliedOtherRegretCategory:
                                changeEvent.target.value,
                            });
                          }}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex -mx-0">
            <div className="w-1/2 px-0">
              <div className="pt-0 panel-section panel-section-formElements">
                <div className="panel-formElements-item">
                  <div className="w-full">
                    {/*
                    <p className="mb-3">
                      <label
                        htmlFor="user_supplied_comment"
                        className="input__label mb-3 align-left"
                        style={{ textAlign: "left" }}
                      >
                        Comment (optional)
                      </label>
                    </p>
                    <TextArea
                      className="textarea__field w-full form-textarea mt-1 block w-full"
                      rows={3}
                      id="user_supplied_comment"
                      name="user_supplied_comment"
                      placeholder=""
                      value={this.state.userSuppliedOptionalComment}
                      onChange={changeEvent => {
                        this.setState({
                          userSuppliedOptionalComment: changeEvent.target.value,
                        });
                      }}
                    />
                    */}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 px-0">
              <div className="pt-0 panel-section panel-section-formElements">
                <div className="panel-formElements-item">
                  <div className="w-full">
                    <span>
                      <LikertScale
                        reviews={[{ question: "How severe is your regret?" }]}
                        icons={[
                          <MdSentimentNeutral key="3" />,
                          <MdSentimentDissatisfied key="2" />,
                          <MdSentimentVeryDissatisfied key="1" />,
                        ]}
                        onClick={(q, n) =>
                          this.setState({ userSuppliedSeverity: n })
                        }
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="panel-section-separator" />

        <div className="panel-section panel-section-formElements">
          <div className="panel-formElements-item mb-6">
            <span>
              <Checkbox
                label="Include recent watch history in the report (helps researchers figure out why you were recommended this video)"
                onChange={() => {
                  this.setState({
                    includeWatchHistory: !this.state.includeWatchHistory,
                  });
                }}
                checked={this.state.includeWatchHistory}
              />
            </span>
          </div>
        </div>
        */}

        <div className="panel-section-separator" />

        <div className="panel-section panel-section-formElements">
          <span>
            Your report is shared with Mozilla according to our{" "}
            <Link
              className="inline"
              target="_blank"
              href="https://www.mozilla.org/en-US/privacy/"
            >
              Privacy Policy
            </Link>
            .<br />
            Click{" "}
            <Link
              className="inline"
              target="_blank"
              href={browser.runtime.getURL(`consent-form/consent-form.html`)}
            >
              here to learn more
            </Link>{" "}
            about the YouTube Regrets research and the specific data that is
            shared.
            <a
              className="link inline"
              target="_blank"
              href="./report-regret.html"
            >
              Debug
            </a>
          </span>
        </div>

        <footer className="panel-section panel-section-footer">
          <div onClick={this.cancel} className="panel-section-footer-button">
            Cancel
          </div>
          <div className="panel-section-footer-separator"></div>
          <div
            onClick={this.report}
            className="panel-section-footer-button default"
          >
            Report
          </div>
        </footer>
      </form>
    );
  }
}
