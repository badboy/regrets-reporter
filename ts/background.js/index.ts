/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "(extensionGlue)" }]*/

import {
  captureExceptionWithExtras,
  initErrorReportingInBackgroundScript,
  Sentry,
} from "../shared-resources/ErrorReporting";
import { browser, Runtime } from "webextension-polyfill-ts";
import semver from "semver";
import {
  HttpInstrument,
  NavigationInstrument,
  UiInstrument,
  ResponseBodyListener,
} from "../shared-resources/openwpm-webext-instrumentation";
import {
  RegretReport,
  RegretReportData,
  ReportSummarizer,
} from "./ReportSummarizer";
import { triggerClientDownloadOfData } from "./lib/triggerClientDownloadOfData";
import {
  NavigationBatch,
  TrimmedNavigationBatch,
} from "./NavigationBatchPreprocessor";
import { YouTubeUsageStatistics } from "./YouTubeUsageStatistics";
import { OpenWpmPacketHandler } from "./OpenWpmPacketHandler";
import { AnnotatedSharedData, DataSharer } from "./DataSharer";
import { Store } from "./Store";
import { localStorageWrapper } from "./lib/localStorageWrapper";
import { getCurrentTab } from "./lib/getCurrentTab";
import { makeUUID } from "./lib/uuid";
import Port = Runtime.Port;
const openWpmPacketHandler = new OpenWpmPacketHandler();
const reportSummarizer = new ReportSummarizer();
const store = new Store(localStorageWrapper);
const youTubeUsageStatistics = new YouTubeUsageStatistics(
  store,
  reportSummarizer,
);
const dataSharer = new DataSharer(store);

const resetClientUsageStatistics = async () => {
  await openWpmPacketHandler.navigationBatchPreprocessor.processQueue();
  openWpmPacketHandler.navigationBatchPreprocessor.reset();
  await youTubeUsageStatistics.hydrate();
  youTubeUsageStatistics.reset();
  await youTubeUsageStatistics.persist();
};

/**
 * Ties together overall execution logic and allows content scripts
 * to access persistent storage via cross-process messaging
 */
class ExtensionGlue {
  private navigationInstrument: NavigationInstrument;
  private httpInstrument: HttpInstrument;
  private uiInstrument: UiInstrument;
  private openwpmCrawlId: string;
  private getStartedPortListener;
  private extensionPreferencesPortListener: (port: Port) => void;
  private reportRegretFormPortListener: (port: Port) => void;
  private dataDeletionRequestsPortListener: (port: Port) => void;
  private sharedDataRequestPortListener: (port: Port) => void;
  private announcementsComponentPortListener: (port: Port) => void;
  private extensionRemovalRequestPortListener: (port: Port) => void;
  private hasUnreadAnnouncements: boolean = false;

  constructor() {}

  async init() {
    // Enable error reporting if not opted out
    this.extensionPreferencesPortListener = await initErrorReportingInBackgroundScript(
      store,
      [
        "port-from-report-regret-form:index",
        "port-from-options-ui:index",
        "port-from-options-ui:form",
        "port-from-announcements:index",
        "port-from-data-viewer:index",
        "port-from-get-started:index",
        "port-from-get-started:component",
        "port-from-ui-instrument-content-script:index",
        "port-from-response-body-listener-content-script:index",
      ],
    );
  }

  async openGetStarted() {
    const consentFormUrl = browser.runtime.getURL(
      `get-started/get-started.html`,
    );
    await browser.tabs.create({ url: consentFormUrl });
  }

  async start() {
    const { hasReadAnnouncements } = await browser.storage.local.get(
      "hasReadAnnouncements",
    );
    if (!hasReadAnnouncements) {
      this.hasUnreadAnnouncements = true;
    }

    const showSpecificExtensionIconOnWatchPages = async () => {
      const self = this;
      function setActiveExtensionIcon() {
        try {
          browser.browserAction.setIcon({
            path: "icons/icon-toolbar-active.svg.38x38.png",
          });
          browser.browserAction.setPopup({
            popup: "/report-regret-form/report-regret-form.html",
          });
          browser.browserAction.setBadgeText({ text: "" });
          browser.browserAction.setTitle({ title: "Click to report a regret" });
        } catch (e) {
          if (e.message.indexOf("Invalid tab ID") === 0) {
            // do nothing, the tab does not exist anymore
          } else {
            throw e;
          }
        }
      }
      function setInactiveExtensionIcon() {
        try {
          browser.browserAction.setIcon({
            path: "icons/icon-toolbar-inactive.svg.38x38.png",
          });
          browser.browserAction.setPopup({
            popup: "/announcements/announcements.html",
          });
          if (self.hasUnreadAnnouncements) {
            browser.browserAction.setBadgeText({ text: "1" });
            browser.browserAction.setTitle({
              title: "You have 1 unread announcement",
            });
          } else {
            browser.browserAction.setBadgeText({ text: "" });
            browser.browserAction.setTitle({
              title: "RegretsReporter",
            });
          }
          browser.browserAction.setBadgeTextColor({ color: "#ffffff" });
        } catch (e) {
          if (e.message.indexOf("Invalid tab ID") === 0) {
            // do nothing, the tab does not exist anymore
          } else {
            throw e;
          }
        }
      }

      const tab = await getCurrentTab();

      // Sometimes there is no current tab object. Assume not a YouTube watch page...
      if (!tab) {
        setInactiveExtensionIcon();
        return;
      }

      // tab.url is not available in Firefox unless the tabs permission is granted
      if (tab.url) {
        if (tab.url.match(/:\/\/[^\/]*\.?youtube.com\/watch/)) {
          setActiveExtensionIcon();
        } else {
          setInactiveExtensionIcon();
        }
      } else {
        function onExecuted(result) {
          const url = result ? result[0] : false;
          if (url && url.match(/:\/\/[^\/]*\.?youtube.com\/watch/)) {
            setActiveExtensionIcon();
          } else {
            setInactiveExtensionIcon();
          }
        }
        const executing = browser.tabs.executeScript({
          code: "location.href",
        });
        executing.then(onExecuted, setInactiveExtensionIcon);
      }
    };
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      showSpecificExtensionIconOnWatchPages();
    });
    browser.tabs.onActivated.addListener(({ tabId }) => {
      showSpecificExtensionIconOnWatchPages();
    });

    // Make the page action show on watch pages also in case extension is loaded/reloaded while on one
    await showSpecificExtensionIconOnWatchPages();

    // Restore persisted youTubeUsageStatistics
    await youTubeUsageStatistics.hydrate();

    // Set up a connection / listener for content scripts to be able to query collected web traffic data
    let portFromReportRegretForm;
    this.reportRegretFormPortListener = p => {
      if (p.name !== "port-from-report-regret-form") {
        return;
      }
      portFromReportRegretForm = p;
      portFromReportRegretForm.onMessage.addListener(async function(m: {
        regretReport?: RegretReport;
        requestRegretReportData?: {
          windowId: number;
          tabId: number;
          skipWindowAndTabIdFilter?: boolean;
        };
      }) {
        // console.log("Message from report-regret-form script:", { m });
        if (m.regretReport) {
          const { regretReport } = m;
          // Share the reported regret
          dataSharer.share({ regret_report: regretReport });
          console.log("Reported regret shared");
        }
        // The report form has triggered a report-related data collection
        if (m.requestRegretReportData) {
          try {
            const {
              windowId,
              tabId,
              skipWindowAndTabIdFilter,
            } = m.requestRegretReportData;
            await openWpmPacketHandler.navigationBatchPreprocessor.processQueue();
            const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
              openWpmPacketHandler.navigationBatchPreprocessor
                .navigationBatchesByNavigationUuid,
            );
            const youTubeNavigationSpecificRegretReportData = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
              youTubeNavigations,
              windowId,
              tabId,
              skipWindowAndTabIdFilter,
            );
            const youtube_usage_statistics_update = await youTubeUsageStatistics.summarizeUpdate();
            const report_data_uuid = makeUUID();
            const regretReportData: RegretReportData = {
              ...youTubeNavigationSpecificRegretReportData,
              youtube_usage_statistics_update,
              report_data_uuid,
            };
            portFromReportRegretForm.postMessage({
              regretReportData,
            });
          } catch (error) {
            captureExceptionWithExtras(error, {
              msg: "Error encountered during regret report data processing",
            });
            console.error(
              "Error encountered during regret report data processing",
              error,
            );
            portFromReportRegretForm.postMessage({
              errorMessage: error.message,
            });
          }
        }
      });
    };
    browser.runtime.onConnect.addListener(this.reportRegretFormPortListener);

    // Listen for data deletion requests
    this.dataDeletionRequestsPortListener = (port: Port) => {
      if (port.name !== "port-from-options-ui:form") {
        return;
      }
      port.onMessage.addListener(async m => {
        // console.debug(`dataDeletionRequestsPortListener message listener: Message from port "${port.name}"`, { m });
        if (m.requestDataDeletion) {
          // Reset client usage statistics so that subsequently reported statistics start fresh
          await resetClientUsageStatistics();
          // Send the data deletion request
          await dataSharer.requestDataDeletion();
          port.postMessage({
            dataDeletionRequested: true,
          });
        }
      });
    };
    browser.runtime.onConnect.addListener(
      this.dataDeletionRequestsPortListener,
    );

    // Listen for shared data requests
    this.sharedDataRequestPortListener = (port: Port) => {
      if (port.name !== "port-from-data-viewer:component") {
        return;
      }
      port.onMessage.addListener(async function(m) {
        // console.debug(`sharedDataRequestPortListener message listener: Message from port "${port.name}"`, { m });
        if (m.exportSharedData) {
          const sharedData = await dataSharer.export();
          port.postMessage({
            sharedData,
          });
        }
      });
    };
    browser.runtime.onConnect.addListener(this.sharedDataRequestPortListener);

    // Listen for announcements-component messages
    this.announcementsComponentPortListener = (port: Port) => {
      if (port.name !== "port-from-announcements:component") {
        return;
      }
      port.onMessage.addListener(async m => {
        // console.debug(`announcementsComponentPortListener message listener: Message from port "${port.name}"`, { m });
        if (m.announcementsDisplayed) {
          this.hasUnreadAnnouncements = false;
          await browser.storage.local.set({ hasReadAnnouncements: true });
          await showSpecificExtensionIconOnWatchPages();
        }
      });
    };
    browser.runtime.onConnect.addListener(
      this.announcementsComponentPortListener,
    );

    // Listen for extension removal requests
    this.extensionRemovalRequestPortListener = (port: Port) => {
      if (port.name !== "port-from-get-started:component") {
        return;
      }
      port.onMessage.addListener(async m => {
        // console.debug(`extensionRemovalRequestPortListener message listener: Message from port "${port.name}"`, { m });
        if (m.removeExtension) {
          await this.cleanup();
          await browser.management.uninstallSelf();
        }
      });
    };
    browser.runtime.onConnect.addListener(
      this.extensionRemovalRequestPortListener,
    );

    // Add hooks to the navigation batch preprocessor
    // for trimming away irrelevant parts of the batch (decreases memory usage)
    openWpmPacketHandler.navigationBatchPreprocessor.processedNavigationBatchTrimmer =
      reportSummarizer.trimNavigationBatch;

    // Start the navigation batch preprocessor
    await openWpmPacketHandler.navigationBatchPreprocessor.run(
      youTubeUsageStatistics.onNavigationBatchesByUuidProcessed,
    );

    // Start OpenWPM instrumentation (monitors navigations and http content)
    const openwpmConfig = {
      navigation_instrument: true,
      cookie_instrument: false,
      js_instrument: false,
      http_instrument: true,
      save_content: "main_frame,xmlhttprequest",
      save_content_method: browser.webRequest.filterResponseData
        ? "filter_response_data"
        : "injected_page_script",
      http_instrument_resource_types: "main_frame,xmlhttprequest",
      http_instrument_urls: "*://*.youtube.com/*|*://*.youtu.be/*",
      ui_instrument: true,
      ui_instrument_clicks: true,
      ui_instrument_state: true,
      ui_instrument_state_interval_ms: "1000",
      crawl_id: 0,
    };
    await this.startOpenWPMInstrumentation(openwpmConfig);

    // Periodic submission of YouTube usage statistics
    await youTubeUsageStatistics.run(
      dataSharer,
      openWpmPacketHandler.navigationBatchPreprocessor,
    );

    // Attempt telemetry uploads periodically
    await dataSharer.telemetryClient.run();
  }

  async startOpenWPMInstrumentation(config) {
    this.openwpmCrawlId = config["crawl_id"];
    if (config["navigation_instrument"]) {
      await openWpmPacketHandler.logDebug("Navigation instrumentation enabled");
      this.navigationInstrument = new NavigationInstrument(
        openWpmPacketHandler,
      );
      this.navigationInstrument.run(config["crawl_id"]);
    }
    if (config["http_instrument"]) {
      await openWpmPacketHandler.logDebug("HTTP instrumentation enabled");
      this.httpInstrument = new HttpInstrument(openWpmPacketHandler);
      this.httpInstrument.run(
        config["crawl_id"],
        config["save_content"],
        config["save_content_method"],
        config["http_instrument_resource_types"],
        config["http_instrument_urls"],
      );
      if (config["save_content_method"] === "injected_page_script") {
        const registerContentScriptOptions = {
          matches: ["*://*.youtube.com/*"],
          allFrames: false,
          matchAboutBlank: false,
        };
        await ResponseBodyListener.registerContentScript(
          {
            testing: config["testing"],
          },
          registerContentScriptOptions,
        );
      }
    }
    if (config["ui_instrument"]) {
      await openWpmPacketHandler.logDebug("UI instrumentation enabled");
      this.uiInstrument = new UiInstrument(openWpmPacketHandler);
      this.uiInstrument.run(config["crawl_id"]);
      const registerContentScriptOptions = {
        matches: ["*://*.youtube.com/*"],
        allFrames: false,
        matchAboutBlank: false,
      };
      await this.uiInstrument.registerContentScript(
        {
          testing: config["testing"],
          clicks: config["ui_instrument_clicks"],
          state: config["ui_instrument_state"],
          state_interval_ms: config["ui_instrument_state_interval_ms"],
        },
        registerContentScriptOptions,
      );
    }
  }

  pause() {
    openWpmPacketHandler.pause();
    if (openWpmPacketHandler.navigationBatchPreprocessor) {
      openWpmPacketHandler.navigationBatchPreprocessor.cleanup();
    }
  }

  resume() {
    openWpmPacketHandler.resume();
    if (openWpmPacketHandler.navigationBatchPreprocessor) {
      openWpmPacketHandler.navigationBatchPreprocessor.run(
        youTubeUsageStatistics.onNavigationBatchesByUuidProcessed,
      );
    }
  }

  async cleanup() {
    if (this.getStartedPortListener) {
      try {
        browser.runtime.onConnect.removeListener(this.getStartedPortListener);
      } catch (err) {
        console.warn("extensionRemovalRequestPortListener removal error", err);
      }
    }
    if (this.extensionRemovalRequestPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.extensionRemovalRequestPortListener,
        );
      } catch (err) {
        console.warn("extensionRemovalRequestPortListener removal error", err);
      }
    }
    if (this.dataDeletionRequestsPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.dataDeletionRequestsPortListener,
        );
      } catch (err) {
        console.warn("dataDeletionRequestsPortListener removal error", err);
      }
    }
    if (this.sharedDataRequestPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.sharedDataRequestPortListener,
        );
      } catch (err) {
        console.warn("sharedDataRequestPortListener removal error", err);
      }
    }
    if (this.announcementsComponentPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.announcementsComponentPortListener,
        );
      } catch (err) {
        console.warn("announcementsComponentPortListener removal error", err);
      }
    }
    if (this.extensionPreferencesPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.extensionPreferencesPortListener,
        );
      } catch (err) {
        console.warn("extensionPreferencesPortListener removal error", err);
      }
    }
    if (this.reportRegretFormPortListener) {
      try {
        browser.runtime.onConnect.removeListener(
          this.reportRegretFormPortListener,
        );
      } catch (err) {
        console.warn("reportRegretFormPortListener removal error", err);
      }
    }
    if (this.navigationInstrument) {
      try {
        await this.navigationInstrument.cleanup();
      } catch (err) {
        console.warn("navigationInstrument cleanup error", err);
      }
    }
    if (this.httpInstrument) {
      try {
        await this.httpInstrument.cleanup();
      } catch (err) {
        console.warn("httpInstrument cleanup error", err);
      }
    }
    if (this.uiInstrument) {
      try {
        await this.uiInstrument.cleanup();
      } catch (err) {
        console.warn("uiInstrument cleanup error", err);
      }
    }
    if (openWpmPacketHandler.navigationBatchPreprocessor) {
      try {
        await openWpmPacketHandler.navigationBatchPreprocessor.cleanup();
      } catch (err) {
        console.warn(
          "openWpmPacketHandler.navigationBatchPreprocessor cleanup error",
          err,
        );
      }
    }
    if (youTubeUsageStatistics) {
      try {
        await youTubeUsageStatistics.cleanup();
      } catch (err) {
        console.warn("youTubeUsageStatistics cleanup error", err);
      }
    }
    if (dataSharer && dataSharer.telemetryClient) {
      try {
        await dataSharer.telemetryClient.cleanup();
      } catch (err) {
        console.warn("dataSharer.telemetryClient cleanup error", err);
      }
    }
  }
}

// make an instance of the ExtensionGlue class available to the extension background context
const extensionGlue = ((window as any).extensionGlue = new ExtensionGlue());

// make certain objects available to the extension background context for debugging and testing purposes
(window as any).openWpmPacketHandler = openWpmPacketHandler;
(window as any).reportSummarizer = reportSummarizer;
(window as any).youTubeUsageStatistics = youTubeUsageStatistics;
(window as any).triggerClientDownloadOfData = triggerClientDownloadOfData;
(window as any).resetClientUsageStatistics = resetClientUsageStatistics;
(window as any).exportSharedData = async () => {
  const sharedData = await dataSharer.export();
  return triggerClientDownloadOfData(
    sharedData,
    `youTubeRegretsReporter-sharedData-userUuid=${await store.extensionInstallationUuid()}.json`,
  );
};

// migrations
const runMigrations = async () => {
  console.info("Running relevant migrations");
  const resetClientUsageStatisticsIfDataWasSharedPre101 = async () => {
    // Reset client usage statistics if the installation was active before v1.0.1 so that reported statistics start fresh
    const sharedData = await dataSharer.export();
    const sharedDataPre101 = sharedData.filter((data: AnnotatedSharedData) => {
      return (
        !data.event_metadata.extension_version ||
        semver.satisfies(data.event_metadata.extension_version, "<1.0.1")
      );
    });
    if (sharedDataPre101.length > 0) {
      console.info(
        "RegretsReporter will now reset the client usage statistics since it detected client data pre v1.0.1 which may have been affected by some data collection issues",
      );
      await resetClientUsageStatistics();
      console.info("Client usage statistics has been reset");
    }
    await browser.storage.local.set({
      hasAttemptedResetClientUsageStatisticsIfDataWasSharedPre101: true,
    });
  };
  const {
    hasAttemptedResetClientUsageStatisticsIfDataWasSharedPre101,
  } = await browser.storage.local.get(
    "hasAttemptedResetClientUsageStatisticsIfDataWasSharedPre101",
  );
  if (!hasAttemptedResetClientUsageStatisticsIfDataWasSharedPre101) {
    await resetClientUsageStatisticsIfDataWasSharedPre101();
  }
};

// init the extension glue on every extension load
async function onEveryExtensionLoad() {
  await extensionGlue.init();
  await runMigrations();
  const { hasOpenedGetStarted } = await browser.storage.local.get(
    "hasOpenedGetStarted",
  );
  if (!hasOpenedGetStarted) {
    await extensionGlue.openGetStarted();
    await browser.storage.local.set({ hasOpenedGetStarted: true });
  }
  await extensionGlue.start();
}
onEveryExtensionLoad().then();
