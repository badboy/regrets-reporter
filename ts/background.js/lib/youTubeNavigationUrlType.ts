type FailedStringAttribute = "<failed>";

export type YouTubeNavigationUrlType =
  | "search_results_page"
  | "search_results_page_load_more_results"
  | "watch_page"
  | "user_page"
  | "channel_page"
  | "youtube_main_page"
  | "other"
  | "misc_xhr"
  | "not_a_youtube_page"
  | "prefetch"
  | "empty"
  | "unknown"
  | FailedStringAttribute;

export const classifyYouTubeNavigationUrlType = (
  url: string,
): YouTubeNavigationUrlType => {
  if (!url || url === "") {
    return "empty";
  }
  const parsedUrl = new URL(url);
  if (parsedUrl.origin.indexOf("youtube.com") === -1) {
    return "not_a_youtube_page";
  }
  /*
  // any subdomain other than www, eg:
  img.youtube.com
  r3---sn-ab5l6ndy.c.youtube.com/videoplayback
   */
  if (
    parsedUrl.origin.indexOf("www.youtube.com") === -1 &&
    parsedUrl.origin.indexOf(".youtube.com") > -1
  ) {
    return "other";
  }
  if (url.indexOf("prefetch=1") > 0) {
    return "prefetch";
  }
  const searchResultsPageStartWiths = ["/results", "/youtubei/v1/search"];
  for (const startWith of searchResultsPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      if (parsedUrl.search.indexOf("&continuation=") > 0) {
        return "search_results_page_load_more_results";
      }
      return "search_results_page";
    }
  }
  const watchPageStartWiths = ["/watch"];
  for (const startWith of watchPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "watch_page";
    }
  }
  const possiblyXhrWatchPageStartWiths = ["/youtubei/v1/next"];
  for (const startWith of possiblyXhrWatchPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      // The same url that is used for fetching information about the next video to watch is also
      // used to fetch more recommendations (e.g. onResponseReceivedEndpoints[0].appendContinuationItemsAction)
      // and possibly other things as well. Here we assume that this is a watch page until
      // we have inspected the contents of the response
      return "watch_page";
    }
  }
  const miscXhrRequestStartWiths = [
    /*
    "/api/stats",
    */
    "/api",
    /*
    "/youtubei/v1/log_event",
    "/youtubei/v1/guide",
    "/youtubei/v1/feedback",
    "/youtubei/v1/related_ajax",
    "/youtubei/v1/notification/get_unseen_count",
    "/youtubei/v1/updated_metadata",
     */
    "/youtubei/v1/",
    /*
    "/live_chat/get_live_chat",
     */
    "/live_chat/",
    "/heartbeat",
    "/error_204",
    "/yts/",
    "/videoplayback",
    "/generate_204",
    "/getDatasyncIdsEndpoint",
    "/getAccountSwitcherEndpoint",
    "/sw.js_data",
    "/iframe_api",
  ];
  for (const startWith of miscXhrRequestStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "misc_xhr";
    }
  }
  /*
  "/comment_service_ajax",
  "/related_ajax",
  "/notifications_ajax",
  "/list_ajax",
  "/browse_ajax",
  "/service_ajax",
   */
  if (parsedUrl.pathname.match(/^\/[a-z_]+_ajax/)) {
    return "misc_xhr";
  }
  /*
  "/get_video_info",
  "/get_midroll_info",
   */
  if (parsedUrl.pathname.match(/^\/get_[a-z_]+_info/)) {
    return "misc_xhr";
  }
  const userPageStartWiths = ["/user"];
  for (const startWith of userPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "user_page";
    }
  }
  const channelPageStartWiths = [
    "/channel",
    "/c/",
    // Various popular channels have their own shortlinks:
    "/snl/",
    "/ABolha",
    "/CanalPeixeBabel",
    "/TomScottGo",
    "/annaakana",
    "/entrepreneurs",
    "/fendermusical",
    "/gaming",
    "/microsoftwindows",
    "/mozilla",
    "/ratoborrachudo",
    "/sewmakecreate",
    "/technikfaultier",
    "/theschooloflifetv",
    "/yoomjji",
    "/GiorgioProductions",
    "/walmart",
    "/aashiqui2",
    "/jkl",
    "/theyoungturks",
    "/drbecky",
  ];
  for (const startWith of channelPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "channel_page";
    }
  }
  /*
  /feed/trending
  /feed/subscriptions
  /feed/library
  /feed/history
  /feed/guide_builder
  */
  const youTubeMainPageStartWiths = ["/feed/", "/index"];
  for (const startWith of youTubeMainPageStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "youtube_main_page";
    }
  }
  if (parsedUrl.pathname === "/") {
    return "youtube_main_page";
  }
  const otherRequestStartWiths = [
    "/about",
    "/playlist",
    "/accounts",
    "/redirect",
    "/premium",
    "/reporthistory",
    "/account",
    "/post",
    "/signin",
    "/embed",
    "/oembed",
    "/pagead",
    "/post",
    "/ptracking",
    "/img",
    "/feeds/",
    "/live_204",
    "/s/",
    "/create_channel",
    "/pair",
    "/pcs",
    "/audiolibrary",
    "/timedtext_video",
    "/dashboard",
    "/attribution_link",
    "/error",
    "/logout",
    "/oembed",
    "/signin",
    "/t/",
    "/profile",
    "/upload",
    "/youtube/",
    "/yt/",
    "/ads/",
    "/app_shell",
    "[Filtered]",
    "undefined",
    "/tv",
    "/paid_memberships",
    "/analytics",
    "/live_chat",
    "/shorts",
    "/hashtag",
    "/360/",
  ];
  for (const startWith of otherRequestStartWiths) {
    if (parsedUrl.pathname.indexOf(startWith) === 0) {
      return "other";
    }
  }
  const otherRequestIncludes = [
    "/from",
    "/to/",
    "/init",
    ".js",
    ".ico",
    ".css",
    ".png",
    ".gif",
  ];
  for (const includes of otherRequestIncludes) {
    if (parsedUrl.pathname.indexOf(includes) >= 0) {
      return "other";
    }
  }
  return "unknown";
};
