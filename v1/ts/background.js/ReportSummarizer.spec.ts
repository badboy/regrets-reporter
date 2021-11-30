import { assert } from "chai";
import { ReportSummarizer } from "./ReportSummarizer";
import { youtubeVisitWatchPageAndStartPlaying10hOfSilenceVideo } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndStartPlaying10hOfSilenceVideo";
import { youtubeVisitWatchPageAndNavigateToFirstUpNext } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndNavigateToFirstUpNext";
import { youtubeVisitWatchPageAndInteractWithEndScreens } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndInteractWithEndScreens";
import { TrimmedNavigationBatchesByUuid } from "./NavigationBatchPreprocessor";
import { youtubeVisitWatchPageAndNavigateToChannelPageThenWatchPage } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndNavigateToChannelPageThenWatchPage";
import { youtubeVisitWatchPageOfADifferentType } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageOfADifferentType";
import { youtubeVisitMainPageSearchClickUserClickVideo } from "./fixtures/ReportSummarizer/youtubeVisitMainPageSearchClickUserClickVideo";
import { youtubeVisitWatchPageAndSearchClickUserSearchResultVideo } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndSearchClickUserSearchResultVideo";
import { youtubeVisitWatchPageChangeTabSwitchBackAndPlayVideoForAWhile } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageChangeTabSwitchBackAndPlayVideoForAWhile";
import { youtubeVisitWatchPageChrome20200820 } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageChrome20200820";
import { youtubeVisitMainPageSearchClickVideoChromeSignedIn } from "./fixtures/ReportSummarizer/youtubeVisitMainPageSearchClickVideoChromeSignedIn";
import { youtubeVisitWatchPageAndNavigateToARelatedVideo202106 } from "./fixtures/ReportSummarizer/youtubeVisitWatchPageAndNavigateToARelatedVideo202106";

const firstEncounteredWindowAndTabIds = (
  navigationBatchesByUuid: TrimmedNavigationBatchesByUuid,
) => {
  const firstNavigationBatchWithWindowAndTabIdUuid = Object.keys(
    navigationBatchesByUuid,
  ).find(
    navUuid =>
      !!navigationBatchesByUuid[navUuid].navigationEnvelope.navigation
        .window_id &&
      !!navigationBatchesByUuid[navUuid].navigationEnvelope.navigation.tab_id,
  );
  const firstNavigationBatchWithWindowAndTabId =
    navigationBatchesByUuid[firstNavigationBatchWithWindowAndTabIdUuid];
  return {
    windowId:
      firstNavigationBatchWithWindowAndTabId.navigationEnvelope.navigation
        .window_id,
    tabId:
      firstNavigationBatchWithWindowAndTabId.navigationEnvelope.navigation
        .tab_id,
  };
};

/**
 * Several navigation batch fixtures were created before trimming was implemented
 * We trim them using this helper function to make sure that the test still passes after trimming
 * @param fixture
 */
const trimNavigationBatchesFixture = (
  fixture: TrimmedNavigationBatchesByUuid,
) => {
  const reportSummarizer = new ReportSummarizer();
  Object.keys(fixture).forEach(navUuid => {
    fixture[navUuid] = reportSummarizer.trimNavigationBatch(fixture[navUuid]);
  });
  return fixture;
};

describe("ReportSummarizer", function() {
  it("should exist", async function() {
    const reportSummarizer = new ReportSummarizer();
    assert.isObject(reportSummarizer);
  });

  it("fixture: youtubeVisitWatchPageAndStartPlaying10hOfSilenceVideo", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndStartPlaying10hOfSilenceVideo,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      1,
      "should have found one youtube navigation",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_id: "g4mHPeMGTJM",
          video_title: "10 hours of absolute silence (the original)",
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_posting_date: "Sep 20, 2011",
          view_count_at_navigation: 4173530,
          view_count_at_navigation_short: "4.1M views",
        },
        page_entry_point: "page_reload",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });
  });

  it("fixture: youtubeVisitWatchPageOfADifferentType", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageOfADifferentType,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      1,
      "should have found one youtube navigation",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "As the world struggles to contain the coronavirus pandemic, many have started claiming how this calamity was predicted centuries ago. Sadhguru busts the myth.\n\nDonate towards Corona relief at\n[http://ishaoutreach.org/corona-relief](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=http%3A%2F%2Fishaoutreach.org%2Fcorona-relief)\n\nDownload Sadhguru App 📲\n[http://onelink.to/sadhguru__app](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=http%3A%2F%2Fonelink.to%2Fsadhguru__app)\n\nYogi, mystic and visionary, Sadhguru is a spiritual master with a difference. An arresting blend of profundity and pragmatism, his life and work serves as a reminder that yoga is a contemporary science, vitally relevant to our times. \n\nSubscribe to Sadhguru YouTube Channel Here:\n[https://youtube.com/user/sadhguru?sub...](https://youtube.com/user/sadhguru?sub_confirmation=1)\n\nOfficial Sadhguru Website\n[http://isha.sadhguru.org](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=http%3A%2F%2Fisha.sadhguru.org)\n\nOfficial Social Profiles of [#Sadhguru](/results?search_query=%23Sadhguru)\n[https://facebook.com/sadhguru](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=https%3A%2F%2Ffacebook.com%2Fsadhguru)\n[https://instagram.com/sadhguru](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=https%3A%2F%2Finstagram.com%2Fsadhguru)\n[https://twitter.com/SadhguruJV](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=https%3A%2F%2Ftwitter.com%2FSadhguruJV)\n\nFree Online Guided Yoga & Meditation by Sadhguru\n[http://isha.sadhguru.org/5-min-practices](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=http%3A%2F%2Fisha.sadhguru.org%2F5-min-practices)\n[http://isha.sadhguru.org/IshaKriya](/redirect?v=P4QP6c8WmKc&redir_token=9k-toAqUx0qYWuR1ek8XiQlJyMl8MTU4NzgxNTYwM0AxNTg3NzI5MjAz&event=video_description&q=http%3A%2F%2Fisha.sadhguru.org%2FIshaKriya)",
          video_id: "P4QP6c8WmKc",
          video_posting_date: "Apr 15, 2020",
          video_title:
            "Was the Corona Pandemic Predicted Centuries Ago? - Sadhguru",
          view_count_at_navigation: 315911,
          view_count_at_navigation_short: "315K views",
        },
        page_entry_point: "direct_navigation",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });
  });

  it("fixture: youtubeVisitWatchPageChrome20200820", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageChrome20200820,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      1,
      "should have found one youtube navigation",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_id: "g4mHPeMGTJM",
          video_title: "10 hours of absolute silence (the original)",
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_posting_date: "20 Sep 2011",
          view_count_at_navigation: 4571365,
          view_count_at_navigation_short: "4.5M views",
        },
        page_entry_point: "page_reload",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 4000,
        document_visible_time: 4000,
      },
      parent_youtube_navigations_metadata: [],
    });
  });

  it("fixture: youtubeVisitWatchPageAndNavigateToFirstUpNext", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndNavigateToFirstUpNext,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      2,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "direct_navigation",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "from_watch_page_up_next_column_click",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_id: "g4mHPeMGTJM",
          video_title: "10 hours of absolute silence (the original)",
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_posting_date: "Sep 20, 2011",
          view_count_at_navigation: 4173534,
          view_count_at_navigation_short: "4.1M views",
        },
        page_entry_point: "direct_navigation",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });

    const windowAndTabIds2 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 2),
      windowAndTabIds2.windowId,
      windowAndTabIds2.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "[http://billwurtz.com](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Fbillwurtz.com)\n\n\n\n\npatreon:  [http://patreon.com/billwurtz](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Fpatreon.com%2Fbillwurtz)\nspotify:  [https://play.spotify.com/artist/78cT0...](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=https%3A%2F%2Fplay.spotify.com%2Fartist%2F78cT0dM5Ivm722EP2sgfDh)\nitunes:  [http://itunes.apple.com/us/artist/bil...](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Fitunes.apple.com%2Fus%2Fartist%2Fbill-wurtz%2Fid1019208137)\ntwitter:  [http://twitter.com/billwurtz](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Ftwitter.com%2Fbillwurtz)\ninstagram:  [http://instagram.com/notbillwurtz](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Finstagram.com%2Fnotbillwurtz)\ndonate:  [http://paypal.com/cgi-bin/webscr?cmd=...](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Fpaypal.com%2Fcgi-bin%2Fwebscr%3Fcmd%3D_s-xclick%26hosted_button_id%3DVXTWA8CDYP4RJ)\nsoundcloud: [http://soundcloud.com/billwurtz](/redirect?v=xuCn8ux2gbs&redir_token=IcgG8GT2OFzaUiUY8ZeAYNEDXOp8MTU4NzEyNTAwNkAxNTg3MDM4NjA2&event=video_description&q=http%3A%2F%2Fsoundcloud.com%2Fbillwurtz)",
          video_id: "xuCn8ux2gbs",
          video_posting_date: "May 10, 2017",
          video_title: "history of the entire world, i guess",
          view_count_at_navigation: 86023815,
          view_count_at_navigation_short: "86M views",
        },
        page_entry_point: "watch_page",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          video_metadata: {
            video_id: "g4mHPeMGTJM",
            video_title: "10 hours of absolute silence (the original)",
            video_description:
              "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
            video_posting_date: "Sep 20, 2011",
            view_count_at_navigation: 4173534,
            view_count_at_navigation_short: "4.1M views",
          },
          page_entry_point: "direct_navigation",
          url_type: "watch_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: 0,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });
  });

  it("fixture: youtubeVisitWatchPageAndInteractWithEndScreens", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndInteractWithEndScreens,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      2,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "direct_navigation",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "from_watch_page_watch_next_end_screen_click",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "Provided to YouTube by TuneCore\n\nMoonlight Sonata · Beethoven\n\nMoonlight Sonata\n\n℗ 2014 Moonlight Sonata\n\nReleased on: 2011-04-27\n\nAuto-generated by YouTube.",
          video_id: "9_C6CTs0WhI",
          video_posting_date: "May 8, 2014",
          video_title: "Moonlight Sonata",
          view_count_at_navigation: 339321,
          view_count_at_navigation_short: "339K views",
        },
        page_entry_point: "direct_navigation",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });

    const windowAndTabIds2 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 2),
      windowAndTabIds2.windowId,
      windowAndTabIds2.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "Provided to YouTube by The Orchard Enterprises\n\nNocturne No. 2 in E flat Major, Op. 9,2 · Frédéric Chopin\n\nChopin\n\n℗ 2009 One Media Publishing\n\nReleased on: 2009-08-17\n\nAuto-generated by YouTube.",
          video_id: "bVeOdm-29pU",
          video_posting_date: "Nov 9, 2014",
          video_title: "Nocturne No. 2 in E flat Major, Op. 9,2",
          view_count_at_navigation: 2423769,
          view_count_at_navigation_short: "2.4M views",
        },
        page_entry_point: "watch_page",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          video_metadata: {
            video_description:
              "Provided to YouTube by TuneCore\n\nMoonlight Sonata · Beethoven\n\nMoonlight Sonata\n\n℗ 2014 Moonlight Sonata\n\nReleased on: 2011-04-27\n\nAuto-generated by YouTube.",
            video_id: "9_C6CTs0WhI",
            video_posting_date: "May 8, 2014",
            video_title: "Moonlight Sonata",
            view_count_at_navigation: 339321,
            view_count_at_navigation_short: "339K views",
          },
          page_entry_point: "direct_navigation",
          url_type: "watch_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: 0,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });
  });

  it("fixture: youtubeVisitWatchPageAndNavigateToChannelPageThenWatchPage", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndNavigateToChannelPageThenWatchPage,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );
    const windowAndTabIds = firstEncounteredWindowAndTabIds(fixture);

    assert.equal(
      youTubeNavigations.length,
      3,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "page_reload",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "without_categorized_clicks",
      url_type: "channel_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);

    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_id: "g4mHPeMGTJM",
          video_posting_date: "Sep 20, 2011",
          video_title: "10 hours of absolute silence (the original)",
          view_count_at_navigation: 4200329,
          view_count_at_navigation_short: "4.2M views",
        },
        page_entry_point: "page_reload",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });

    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 2),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        url_type: "channel_page",
        page_entry_point: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          video_metadata: {
            video_description:
              "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
            video_id: "g4mHPeMGTJM",
            video_posting_date: "Sep 20, 2011",
            video_title: "10 hours of absolute silence (the original)",
            view_count_at_navigation: 4200329,
            view_count_at_navigation_short: "4.2M views",
          },
          page_entry_point: "page_reload",
          url_type: "watch_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: 0,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });

    const youTubeNavigationSpecificRegretReportData3 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 3),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData3, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_id: "g4mHPeMGTJM",
          video_posting_date: "Sep 20, 2011",
          video_title: "10 hours of absolute silence (the original)",
          view_count_at_navigation: 4200329,
          view_count_at_navigation_short: "4.2M views",
        },
        page_entry_point: "channel_page",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "watch_page",
          url_type: "channel_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
        {
          video_metadata: {
            video_description:
              "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
            video_id: "g4mHPeMGTJM",
            video_posting_date: "Sep 20, 2011",
            video_title: "10 hours of absolute silence (the original)",
            view_count_at_navigation: 4200329,
            view_count_at_navigation_short: "4.2M views",
          },
          page_entry_point: "page_reload",
          url_type: "watch_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: 0,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });
  });

  it("fixture: youtubeVisitMainPageSearchClickUserClickVideo", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitMainPageSearchClickUserClickVideo,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );
    const windowAndTabIds = firstEncounteredWindowAndTabIds(fixture);

    assert.equal(
      youTubeNavigations.length,
      4,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "direct_navigation",
      url_type: "youtube_main_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "unspecified",
      url_type: "search_results_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);
    assert.deepEqual(youTubeNavigations[2].youtube_visit_metadata, {
      reach_type: "search_results_non_video_click",
      url_type: "user_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[2].parent_youtube_navigations.length, 2);
    assert.deepEqual(youTubeNavigations[3].youtube_visit_metadata, {
      reach_type: "unspecified",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[3].parent_youtube_navigations.length, 3);

    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        page_entry_point: "direct_navigation",
        url_type: "youtube_main_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });

    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 2),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        page_entry_point: "youtube_main_page",
        url_type: "search_results_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "direct_navigation",
          url_type: "youtube_main_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });

    const youTubeNavigationSpecificRegretReportData3 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 3),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData3, {
      youtube_navigation_metadata: {
        page_entry_point: "search_results_page",
        url_type: "user_page",
        via_search_results: 1,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "youtube_main_page",
          url_type: "search_results_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
        {
          page_entry_point: "direct_navigation",
          url_type: "youtube_main_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });

    const youTubeNavigationSpecificRegretReportData4 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 4),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData4, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "Cal Jam 18 took place October 6, 2018 in San Bernardino, CA. \nSIGN UP FOR MORE INFO ON FUTURE EVENTS: [https://www.caljamfest.com/](/redirect?redir_token=e24CaXAPlv5dOa6xNFHQqQnjvUJ8MTU4NzgxOTYyNkAxNTg3NzMzMjI2&q=https%3A%2F%2Fwww.caljamfest.com%2F&event=video_description&v=PdDpbKX-N-4)",
          video_id: "PdDpbKX-N-4",
          video_posting_date: "Feb 28, 2020",
          video_title: "Cal Jam 18 - More Good Times!",
          view_count_at_navigation: 31958,
          view_count_at_navigation_short: "31K views",
        },
        page_entry_point: "user_page",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "search_results_page",
          url_type: "user_page",
          via_search_results: 1,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
        {
          page_entry_point: "youtube_main_page",
          url_type: "search_results_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
        {
          page_entry_point: "direct_navigation",
          url_type: "youtube_main_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });
  });

  it("fixture: youtubeVisitMainPageSearchClickVideoChromeSignedIn", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitMainPageSearchClickVideoChromeSignedIn,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );
    const windowAndTabIds = firstEncounteredWindowAndTabIds(fixture);

    assert.equal(
      youTubeNavigations.length,
      3,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "direct_navigation",
      url_type: "youtube_main_page",
      video_element_play_time: 0,
      document_visible_time: 3000,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "unspecified",
      url_type: "search_results_page",
      video_element_play_time: 0,
      document_visible_time: 2000,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);
    assert.deepEqual(youTubeNavigations[2].youtube_visit_metadata, {
      reach_type: "search_results_video_click",
      url_type: "watch_page",
      video_element_play_time: 6000,
      document_visible_time: 7000,
    });
    assert.equal(youTubeNavigations[2].parent_youtube_navigations.length, 2);

    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        page_entry_point: "direct_navigation",
        url_type: "youtube_main_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 3000,
      },
      parent_youtube_navigations_metadata: [],
    });

    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 2),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        page_entry_point: "youtube_main_page",
        url_type: "search_results_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: -1,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
        video_element_play_time: 0,
        document_visible_time: 2000,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "direct_navigation",
          url_type: "youtube_main_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 3000,
        },
      ],
    });

    const youTubeNavigationSpecificRegretReportData3 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 3),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData3, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            'Watch the official music video for "The Pretender" by Foo Fighters\nListen to Foo Fighters: [https://FooFighters.lnk.to/listen_YD](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2Flisten_YD&redir_token=QUFFLUhqa3FOdEZudWxuVU9kalhNcmRKQ0dLNTBMVy1ad3xBQ3Jtc0trdkpYNjg4ZjluUnhseDJwWUlCTGNsWEhWM3BUTS1hZXVoNVJUSmx6VlcyM3ZnbTd4WGhCNDJ4cEYzZzNYZkI4R0k1ZGlyUnFWU0prU2NiVGE4Uk96d3BiWVlkaF9XOXdVWWQ0dnZPanZ0eEVSc0dIbw%3D%3D)\n\nSubscribe to the official Foo Fighters YouTube channel: [https://FooFighters.lnk.to/subscribeYD](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FsubscribeYD&redir_token=QUFFLUhqa291MjNoS3N0WWxRWlFJdk5jN2V2c05wN21Yd3xBQ3Jtc0tsTnhGbGQ3YjNXbFI5bkRrR3UzcU1IVU1yajlmV05hYmptTGtKZkN5RDVhT1pFSzFKMU81MDFqWV9IUDVYNjhYTUlycWNwY1pSRGZTUXZUOG5HSHdJcjliV1d6NzRudHlfdUZvZjJWZDQxUHQ0X2tPQQ%3D%3D)\n\nWatch more Foo Fighter videos: [https://FooFighters.lnk.to/listen_YC/...](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2Flisten_YC%2Fyoutube&redir_token=QUFFLUhqbmJfeDdCOFRjTFhSVEVlTHR3TkhXQk5BS3d5d3xBQ3Jtc0ttUDU1WktQYXQ0dmZTLWxaZ1lyUl90Y0dUMnRlUXAtaW53ckQxc1otems5YmVrOXZueGFGVTJna3JGRU5PWmN2RXVfN09uSXFpREFGZksxaGZlTENzQXNFaXJVU3BHMlJOS21VNFpBT19FeXB2WVNxOA%3D%3D)\n\nFollow Foo Fighters:\nFacebook: [https://FooFighters.lnk.to/followFI](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FfollowFI&redir_token=QUFFLUhqbnE3OWhOX3NrQk9qMXFiNV9KaE1iaG1DVFJnUXxBQ3Jtc0tsMHFLMXExM0ZUMm4xaDgySi1iblcyd3h4aEVmOHk5QjRMeDB5em9JLVlZTXhpMjRFMmNLSnVmb25SZ0FtQkxicDdfRzB4X3dpYWpYY2RCUUktWnJIZjV2WUtjd3F4cTZ1VjZoMFRIeTBQMDhfQ3JiTQ%3D%3D)\nInstagram: [https://FooFighters.lnk.to/followII](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FfollowII&redir_token=QUFFLUhqa0FKMWZ0X0VqYlRQQUswbzRVTlE4R2picnR5UXxBQ3Jtc0tub2g1WG5zb0VlS1dRVmpKN0NveGlJOG9HZjZsR2xhdG5sTWZyazlWb3lzNVlHY2lFNmJubHNUdTFhV0NGZ3lVWHRQeTJsZUxRVkFEeVNWRnZFendIcWUyd2J3MlAtSDRodmpkd1VQM0NNc2FPTzFtaw%3D%3D)\nTwitter: [https://FooFighters.lnk.to/followTI](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FfollowTI&redir_token=QUFFLUhqbENmeUpBdnVmdWg4SUVjeWhpMmR6TFhESXFnd3xBQ3Jtc0tuTDdReDVoRnFFRVl1TFZaVG1pSF9oazZMNzNRTk40enBQaG50czFGR0NWdWlmVFFWelpaSEhuZDY2cW1TRmJnRkFrQjVmOWpCemMxWnRzZExwWWw2VFA5SFBFQVZ6aFYzV0dJdkRFeTJFcm9ORzF4aw%3D%3D)\nWebsite: [https://FooFighters.lnk.to/followWI](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FfollowWI&redir_token=QUFFLUhqbXFrd0N4WENJVW9aRUdlZVBublYyN3BJMXZ0UXxBQ3Jtc0ttREpnZ2l6Szhta1N5a0ZIUTluVkx5YTd3Z1h5VEpnbzZ6MnVSdDJLRVdLRWJOUHY5SU9RMlltVFBkNmc0VVVjVmgtOHpGYXI4WkRQY2Fidkx6RDdab21BYlloYmRuUy1taG9rVEVFcDJ1ZGhUdHJCQQ%3D%3D)\nSpotify: [https://FooFighters.lnk.to/followSI](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FfollowSI&redir_token=QUFFLUhqbjZUMy0xVTBIcHdXakxQSFB4cHNsUERkX2psQXxBQ3Jtc0ttNXFtRW8wbDc4UmFZbmtFM005U1o0TjRJWTBqLVZWdzFuVlF4aEpuY2dpZnNwS0w3UWNUa1VVOW1nZmp2aG5NbDZjZklmMnBxaU9QS2dwdVFtdVEtdEZFajVyTXJrVXl4SzlLbTZ6Mmg0Zlc3VXAtRQ%3D%3D)\nYouTube: [https://FooFighters.lnk.to/subscribeYD](/redirect?v=SBjQ9tuuTJQ&event=video_description&q=https%3A%2F%2FFooFighters.lnk.to%2FsubscribeYD&redir_token=QUFFLUhqbFpoMHNXLTNqc1JndkZWUU1iQUN1MlhNY3dHd3xBQ3Jtc0tsc0xQRVZYMXlvcjVERUl1ZVBOU19OTmJ3TTRnb0NEY3FIU1NnQXdzTXZoQ0N2SkQ4bkZYRnB3WEV4RmpMOTFQWmhGYU1FR3BGQkhMSEd0bVQwRVhnbHB3ek8xTUtfa0ZVNFNWS216dHdHSG1MOGdSYw%3D%3D)\n\nLyrics:\nKeep you in the dark\nYou know they all pretend\nKeep you in the dark\nAnd so it all began\n\nSend in your skeletons\nSing as their bones go marching in... again\nThe need you buried deep\nThe secrets that you keep are ever ready\nAre you ready?\nI\'m finished making sense\nDone pleading ignorance\nThat whole defense\n\n[#FooFighters](/results?search_query=%23FooFighters) [#ThePretender](/results?search_query=%23ThePretender) [#Remastered](/results?search_query=%23Remastered) [#OfficialMusicVideo](/results?search_query=%23OfficialMusicVideo)',
          video_id: "SBjQ9tuuTJQ",
          video_posting_date: "Oct 3, 2009",
          video_title: "Foo Fighters - The Pretender",
          view_count_at_navigation: 435926622,
          view_count_at_navigation_short: "435M views",
        },
        page_entry_point: "search_results_page",
        url_type: "watch_page",
        via_search_results: 1,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 1,
        video_element_play_time: 6000,
        document_visible_time: 7000,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "youtube_main_page",
          url_type: "search_results_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 2000,
        },
        {
          page_entry_point: "direct_navigation",
          url_type: "youtube_main_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          video_element_play_time: 0,
          document_visible_time: 3000,
        },
      ],
    });
  });

  it("fixture: youtubeVisitWatchPageAndSearchClickUserSearchResultVideo", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndSearchClickUserSearchResultVideo,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );
    const windowAndTabIds = firstEncounteredWindowAndTabIds(fixture);

    assert.equal(
      youTubeNavigations.length,
      3,
      "should have found youtube navigations",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    assert.deepEqual(youTubeNavigations[0].youtube_visit_metadata, {
      reach_type: "page_reload",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[0].parent_youtube_navigations.length, 0);
    assert.deepEqual(youTubeNavigations[1].youtube_visit_metadata, {
      reach_type: "without_categorized_clicks", // search action
      url_type: "search_results_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[1].parent_youtube_navigations.length, 1);
    assert.deepEqual(youTubeNavigations[2].youtube_visit_metadata, {
      reach_type: "search_results_page_other_indirect_videos_click",
      url_type: "watch_page",
      video_element_play_time: 0,
      document_visible_time: 0,
    });
    assert.equal(youTubeNavigations[2].parent_youtube_navigations.length, 2);

    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_id: "g4mHPeMGTJM",
          video_posting_date: "Sep 20, 2011",
          video_title: "10 hours of absolute silence (the original)",
          view_count_at_navigation: 4217099,
          view_count_at_navigation_short: "4.2M views",
        },
        page_entry_point: "page_reload",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [],
    });

    const youTubeNavigationSpecificRegretReportData2 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 3),
      windowAndTabIds.windowId,
      windowAndTabIds.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData2, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_description:
            "Check out Foo Fighter’s full Hyde Park concert in London, June 17th 2006.\nKeep washing your hands. [#Stayhome](/results?search_query=%23Stayhome)\n \nListen to Foo Fighters: [https://FooFighters.lnk.to/listen_YD](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2Flisten_YD&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nSubscribe to the official Foo Fighters YouTube channel: [https://FooFighters.lnk.to/subscribeYD](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FsubscribeYD&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nWatch more Foo Fighter videos: [https://FooFighters.lnk.to/listen_YC/...](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2Flisten_YC%2Fyoutube&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\n \nFollow Foo Fighters:\nFacebook: [https://FooFighters.lnk.to/followFI](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FfollowFI&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nInstagram: [https://FooFighters.lnk.to/followII](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FfollowII&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nTwitter: [https://FooFighters.lnk.to/followTI](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FfollowTI&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nWebsite: [https://FooFighters.lnk.to/followWI](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FfollowWI&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nSpotify: [https://FooFighters.lnk.to/followSI](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FfollowSI&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\nYouTube: [https://FooFighters.lnk.to/subscribeYD](/redirect?q=https%3A%2F%2FFooFighters.lnk.to%2FsubscribeYD&redir_token=NWmHK6Cec4zk7MPOzibWBOMcqip8MTU4ODI0MTM1NkAxNTg4MTU0OTU2&v=A8z6rbmx7Mg&event=video_description)\n[#FooFighters](/results?search_query=%23FooFighters) [#HydePark](/results?search_query=%23HydePark) [#StayHome](/results?search_query=%23StayHome)",
          video_id: "A8z6rbmx7Mg",
          video_posting_date: "Premiered Apr 24, 2020",
          video_title: "Foo Fighters - Live in Hyde Park (2006)",
          view_count_at_navigation: 316817,
          view_count_at_navigation_short: "316K views",
        },
        page_entry_point: "search_results_page",
        url_type: "watch_page",
        via_search_results: 1,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 1,
        video_element_play_time: 0,
        document_visible_time: 0,
      },
      parent_youtube_navigations_metadata: [
        {
          page_entry_point: "watch_page",
          url_type: "search_results_page",
          via_non_search_algorithmic_recommendations_content: -1,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: -1,
          via_search_results: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
        {
          video_metadata: {
            video_description:
              "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
            video_id: "g4mHPeMGTJM",
            video_posting_date: "Sep 20, 2011",
            video_title: "10 hours of absolute silence (the original)",
            view_count_at_navigation: 4217099,
            view_count_at_navigation_short: "4.2M views",
          },
          page_entry_point: "page_reload",
          url_type: "watch_page",
          via_search_results: 0,
          via_non_search_algorithmic_recommendations_content: 0,
          via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
          video_element_play_time: 0,
          document_visible_time: 0,
        },
      ],
    });
  });

  it("fixture: youtubeVisitWatchPageChangeTabSwitchBackAndPlayVideoForAWhile", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageChangeTabSwitchBackAndPlayVideoForAWhile,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      1,
      "should have found one youtube navigation",
    );

    // console.dir({ youTubeNavigations }, { depth: 5 });

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_id: "g4mHPeMGTJM",
          video_title: "10 hours of absolute silence (the original)",
          video_description:
            "10 hours of comfortable silence. Only watch the original, everything else may contain sound ;-)",
          video_posting_date: "Sep 20, 2011",
          view_count_at_navigation: 4326854,
          view_count_at_navigation_short: "4.3M views",
        },
        page_entry_point: "page_reload",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 8000,
        document_visible_time: 15000,
      },
      parent_youtube_navigations_metadata: [],
    });
  });

  it("fixture: youtubeVisitWatchPageAndNavigateToARelatedVideo202106", async function() {
    const reportSummarizer = new ReportSummarizer();
    const fixture = trimNavigationBatchesFixture(
      youtubeVisitWatchPageAndNavigateToARelatedVideo202106,
    );
    const youTubeNavigations = await reportSummarizer.navigationBatchesByUuidToYouTubeNavigations(
      fixture,
    );

    assert.equal(
      youTubeNavigations.length,
      2,
      "should have found two youtube navigations",
    );

    console.dir({ youTubeNavigations }, { depth: 5 });

    const windowAndTabIds1 = firstEncounteredWindowAndTabIds(fixture);
    const youTubeNavigationSpecificRegretReportData1 = await reportSummarizer.youTubeNavigationSpecificRegretReportDataFromYouTubeNavigations(
      youTubeNavigations.slice(0, 1),
      windowAndTabIds1.windowId,
      windowAndTabIds1.tabId,
    );
    assert.deepEqual(youTubeNavigationSpecificRegretReportData1, {
      youtube_navigation_metadata: {
        video_metadata: {
          video_id: "u9Dg-g7t2l4",
          video_title:
            "Disturbed  - The Sound Of Silence [Official Music Video]",
          video_description:
            'Watch the official music video for The Sound of Silence by Disturbed from the album Immortalized.\n🔔 Subscribe to the channel: [https://youtube.com/c/DisturbedTV/?su...](https://youtube.com/c/DisturbedTV/?sub_confirmation=1)\n\nDownload or stream the song now: [https://wbr.ec/immortalized](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbWdKOVpfS1ZWbHNvd0hmeVU3Yk5GNnF1WWhXUXxBQ3Jtc0tsV2pob2VlNi1QQ2o1RFJUOFpfWXpPTUM1RVI5TEN5RU0tazRqVE1fdWppMnhBdXhDaS1oZ3RpUlpSdkYyRTE2Ukd6QzFtRFAyZ2o2NHZoQ05UZkRhZVl1LU4wRG1RdzF2Q1BCWEE4dkxrTHFZWExtRQ&q=https%3A%2F%2Fwbr.ec%2Fimmortalized)\nNew album \'Evolution\' out now: [https://disturbed.lnk.to/evolution](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbTZOQS1laW5GQnpYcXE2TFphVVVsMHNLT0tFZ3xBQ3Jtc0ttbk1mWmlybEFhd2IwcWoxaDYtU1ZIaWpnMFZpUC1ob2pveUxNRnQ1U1Z1QjdzV2RDeXI2ekFucmxNMk42dFNxR3ZRVnVsckd3Y3dUaWRZV2JLNWJOSW9LZHU3ZjdLVzgxZDB0MF9fQ0hWSlBIdnVaOA&q=https%3A%2F%2Fdisturbed.lnk.to%2Fevolution)\n\nDirected by Matt Mahurin\n[https://mattmahurin.com](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa1FjVl82eVB6TmVJUjJVNDd4SXViRGVTeXcxd3xBQ3Jtc0trVEFyZ2kxdWE0YVlkeC1KNEUxYV9nNXpuWmZFSE4tcFRQb05IcVlyYVlkOW5hZHFGTWVlZldSLWF2b3ZkWC1SNkd1Y0tjcU1JQUMtb0VLV2d1VzhDWkFqN0NrM3pYT2xTQ1FQV3ZoZDZBWVp6di1wbw&q=https%3A%2F%2Fmattmahurin.com)\n\nFollow Disturbed:\nOfficial Website - [https://disturbed1.com](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbVUwbG1MR2l5MDFINEtFc3otcjR2WEpFMmhzUXxBQ3Jtc0trWUQtOXY4UDdxaTc2WWZhNXlYWG54cTU2cDhuTFdvUXc5RDdBb1pFbUN1Sk1fZHNKZ2I1d2pZeUhuZWxiVGJpclJfeVdDYnNyLTVBcDdNVENmdnhjcjhkRjBUZUpIZDlONG9hbnFPT1NUNElTOUVYdw&q=https%3A%2F%2Fdisturbed1.com)\nFacebook - [https://facebook.com/disturbed](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa3A4VU1nQUwxMk9mQUVmUjNSakQyaktIczU3QXxBQ3Jtc0tsUjNwcWplX0l3TDVmYVJ1eTJMa3g3NFhFZnFjRDBNS3ViMF83WUtvZ1ZjbjEwQWI4ZURsd05xay11TlNWRkhXM2NNbGFBWV9DMmpyRW9rTUpEbGQ1Vy0yT2hHOXFjam9wY0hyZ3h3N1MyZDE1THp3TQ&q=https%3A%2F%2Ffacebook.com%2Fdisturbed)\nTwitter - [https://twitter.com/disturbed](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbFdTbVJrMmxqZU0zVUlLSlRES1dPYndvanJvZ3xBQ3Jtc0tsRWZ3azFqc05CcmlMbkVmVGlHZ0xXWlAySjJaNkFKQjJRMlhNNEwteVpZRkFzSWd0VWhKU0pWQlJNcUJYVTZZdm5yRTEtWUhaNUFlblFINHZIeW1FMUtzbHNxTnZhb0Q0U0l4R1JTTWFxYWo0ZE1UWQ&q=https%3A%2F%2Ftwitter.com%2Fdisturbed)\nInstagram - [https://instagram.com/disturbed](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbjFCQkt5YmxITEZVQjBfd00xMTNCRUsxQXNDQXxBQ3Jtc0ttakpKb1RPRm84YmNOcmlTNDNFYnFwMFExVEpoMnA0RW5idTEwNGZuTnlJc00xVk43Z09JN21GNVdaTWdQM1VPLTBEOUtzTGNXRmNLLXlvUVhBdW9zanlsS0h5NHMtQmlYb2tXUkFVd2NRSXVBNjZ5cw&q=https%3A%2F%2Finstagram.com%2Fdisturbed)\nSpotify - [https://smarturl.it/disturbed.spotify](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqa2NleVZQSWdpa2dCMUpXUGVGbTNYWmk5V095Z3xBQ3Jtc0tuaXJ5TjVTUzFVQndUcFduaWNTT3d0NjBfTmFQdUVWa1RFWjlZRjVrUHlPY1pTWjUtZXZIamdubkRpOEpRZzJPUFlKSm1DMVZXT2x0dU45YXU2MFNUOXdvdTI0NkpkeEtUelpRX005S2pQdHZSRzNEaw&q=https%3A%2F%2Fsmarturl.it%2Fdisturbed.spotify)\n\nDisturbed is a multi-platinum-selling heavy metal band renowned for their hits “Down With The Sickness,” “Sound of Silence,” “The Vengeful One,” “The Light,” “Stricken,” “Land Of Confusion,” and “Indestructible.” They worked with artists like Myles Kennedy, and Lzzy Hale — amassing billions of global streams and achieving 5 consecutive number one debuts on the Billboard Top 200.\n\nLyrics:\nHello, darkness, my old friend\nI\'ve come to talk with you again\nBecause a vision softly creeping\nLeft its seeds while I was sleeping\n\nAnd the vision that was planted in my brain\nStill remains\nWithin the sound of silence\n\nIn restless dreams I walked alone\nNarrow streets of cobblestone\n\'Neath the halo of a street lamp\nI turned my collar to the cold and damp\n\nWhen my eyes were stabbed by the flash of a neon light\nThat split the night\nAnd touched the sound of silence\n\nAnd in the naked light I saw\nTen thousand people, maybe more\nPeople talking without speaking\nPeople hearing without listening\n\nPeople writing songs that voices never share\nAnd no one dare\nDisturb the sound of silence\n\n"Fools," said I, ""You do not know\nSilence, like a cancer, grows\nHear my words that I might teach you\nTake my arms that I might reach you""\n\nBut my words like silent raindrops fell\nAnd echoed in the wells of silence\n\nAnd the people bowed and prayed\nTo the neon god they made\nAnd the sign flashed out its warning\nIn the words that it was forming\n\nAnd the sign said\n"The words of the prophets are written on the subway walls\nAnd tenement halls\nAnd whispered in the sound\nOf silence"\n\n[#OfficialMusicVideo](/hashtag/officialmusicvideo) [#Disturbed](/hashtag/disturbed) [#SoundOfSilence](/hashtag/soundofsilence) [#WeAreWarnerRecords](/hashtag/wearewarnerrecords)',
          video_posting_date: "Dec 8, 2015",
          view_count_at_navigation: 722354944,
          view_count_at_navigation_short: "722M views",
        },
        page_entry_point: "direct_navigation",
        url_type: "watch_page",
        via_search_results: 0,
        via_non_search_algorithmic_recommendations_content: 0,
        via_recommendations_with_an_explicit_query_or_constraint_to_optimize_for: 0,
        video_element_play_time: 0,
        document_visible_time: 5000,
      },
      parent_youtube_navigations_metadata: [],
    });
  });
});
