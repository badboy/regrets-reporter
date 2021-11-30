import { assert } from "chai";
import { ReportSummarizer } from "./ReportSummarizer";
import { OpenWpmPacketHandler } from "./OpenWpmPacketHandler";
import {
  NavigationBatch,
  TrimmedNavigationBatch,
  TrimmedNavigationBatchesByUuid,
} from "./NavigationBatchPreprocessor";

const trimNavigationBatches = (
  reportSummarizer: ReportSummarizer,
  navigationBatchesByUuid: TrimmedNavigationBatchesByUuid,
): TrimmedNavigationBatchesByUuid => {
  const navUuids = Object.keys(navigationBatchesByUuid);
  const trimmedNavigationBatchesByUuid: TrimmedNavigationBatchesByUuid = {};
  for (const navUuid of navUuids) {
    trimmedNavigationBatchesByUuid[
      navUuid
    ] = reportSummarizer.trimNavigationBatch(navigationBatchesByUuid[navUuid]);
  }
  return trimmedNavigationBatchesByUuid;
};

describe("OpenWpmPacketHandler", function() {
  it("should exist", async function() {
    const openWpmPacketHandler = new OpenWpmPacketHandler();
    assert.isObject(openWpmPacketHandler);
  });

  it("fixture: youtubeVisitWatchPageAndStartPlaying10hOfSilenceVideo", async function() {
    const reportSummarizer = new ReportSummarizer();
    const trimmedNavigationBatchesByUuid: TrimmedNavigationBatchesByUuid = trimNavigationBatches(
      reportSummarizer,
      {},
    );

    // console.log({ trimmedNavigationBatchesByUuid });
  });
});
