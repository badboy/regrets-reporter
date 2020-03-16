import { OpenWPMType, StudyPayloadEnvelope } from "../StudyPayloadPreprocessor";

export const exampleDotComVisitQueue: StudyPayloadEnvelope[] = [
  {
    type: "http_requests" as OpenWPMType,
    httpRequest: {
      incognito: 0,
      crawl_id: 0,
      extension_session_uuid: "ec32bcbd-7fee-4aaf-b36d-0ef56557e4fd",
      event_ordinal: 1,
      window_id: 3,
      tab_id: 1,
      frame_id: 0,
      request_id: "20",
      url: "http://example.com/",
      method: "GET",
      time_stamp: "2018-11-23T01:34:40.487Z",
      referrer: "",
      headers:
        '[["Host","example.com"],["User-Agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"],["Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"],["Accept-Language","en-US,en;q=0.5"],["Accept-Encoding","gzip, deflate"],["Connection","keep-alive"],["Upgrade-Insecure-Requests","1"]]',
      is_XHR: 0,
      is_full_page: 1,
      is_frame_load: 0,
      triggering_origin: "undefined",
      loading_origin: "undefined",
      loading_href: "undefined",
      resource_type: "main_frame",
      top_level_url: "about:blank",
      parent_frame_id: -1,
      frame_ancestors: "[]",
    },
    tabActiveDwellTime: 7750,
  },
  {
    type: "navigations" as OpenWPMType,
    navigation: {
      crawl_id: 0,
      incognito: 0,
      extension_session_uuid: "ec32bcbd-7fee-4aaf-b36d-0ef56557e4fd",
      window_id: 3,
      tab_id: 1,
      frame_id: 0,
      window_width: 1280,
      window_height: 946,
      window_type: "normal",
      tab_width: 1280,
      tab_height: 872,
      tab_cookie_store_id: "firefox-default",
      uuid: "290cb5b2-828c-4eec-9626-69463b7b4d05",
      url: "http://example.com/",
      transition_qualifiers: '["from_address_bar"]',
      transition_type: "typed",
      committed_event_ordinal: 2,
      committed_time_stamp: "2018-11-23T01:34:40.769Z",
      parent_frame_id: -1,
      before_navigate_event_ordinal: 0,
      before_navigate_time_stamp: "2018-11-23T01:34:40.475Z",
    },
    tabActiveDwellTime: 8250,
  },
  {
    type: "http_responses" as OpenWPMType,
    httpResponse: {
      incognito: 0,
      crawl_id: 0,
      extension_session_uuid: "ec32bcbd-7fee-4aaf-b36d-0ef56557e4fd",
      event_ordinal: 3,
      window_id: 3,
      tab_id: 1,
      frame_id: 0,
      request_id: "20",
      is_cached: 0,
      url: "http://example.com/",
      method: "GET",
      response_status: 200,
      response_status_text: "HTTP/1.1 200 OK",
      time_stamp: "2018-11-23T01:34:40.765Z",
      headers:
        '[["Content-Encoding","gzip"],["Accept-Ranges","bytes"],["Cache-Control","max-age=604800"],["Content-Type","text/html; charset=UTF-8"],["Date","Fri, 23 Nov 2018 01:34:40 GMT"],["Etag","\\"1541025663\\""],["Expires","Fri, 30 Nov 2018 01:34:40 GMT"],["Last-Modified","Fri, 09 Aug 2013 23:54:35 GMT"],["Server","ECS (lga/1390)"],["Vary","Accept-Encoding"],["X-Cache","HIT"],["Content-Length","606"]]',
      location: "",
    },
    tabActiveDwellTime: 8250,
  },
  {
    type: "http_requests" as OpenWPMType,
    httpRequest: {
      incognito: 0,
      crawl_id: 0,
      extension_session_uuid: "ec32bcbd-7fee-4aaf-b36d-0ef56557e4fd",
      event_ordinal: 4,
      window_id: 3,
      tab_id: 1,
      frame_id: 0,
      request_id: "21",
      url: "http://example.com/favicon.ico",
      method: "GET",
      time_stamp: "2018-11-23T01:34:40.846Z",
      referrer: "",
      headers:
        '[["Host","example.com"],["User-Agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0"],["Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"],["Accept-Language","en-US,en;q=0.5"],["Accept-Encoding","gzip, deflate"],["Connection","keep-alive"]]',
      is_XHR: 0,
      is_full_page: 1,
      is_frame_load: 0,
      triggering_origin: "http://example.com",
      loading_origin: "http://example.com",
      loading_href: "http://example.com/",
      resource_type: "image",
      top_level_url: "http://example.com/",
      parent_frame_id: -1,
      frame_ancestors: "[]",
    },
    tabActiveDwellTime: 8250,
  },
  {
    type: "http_responses" as OpenWPMType,
    httpResponse: {
      incognito: 0,
      crawl_id: 0,
      extension_session_uuid: "ec32bcbd-7fee-4aaf-b36d-0ef56557e4fd",
      event_ordinal: 5,
      window_id: 3,
      tab_id: 1,
      frame_id: 0,
      request_id: "21",
      is_cached: 0,
      url: "http://example.com/favicon.ico",
      method: "GET",
      response_status: 404,
      response_status_text: "HTTP/1.1 404 Not Found",
      time_stamp: "2018-11-23T01:34:40.982Z",
      headers:
        '[["Content-Encoding","gzip"],["Accept-Ranges","bytes"],["Cache-Control","max-age=604800"],["Content-Type","text/html; charset=UTF-8"],["Date","Fri, 23 Nov 2018 01:34:40 GMT"],["Expires","Fri, 30 Nov 2018 01:34:40 GMT"],["Last-Modified","Fri, 16 Nov 2018 21:05:05 GMT"],["Server","ECS (lga/1391)"],["Vary","Accept-Encoding"],["X-Cache","404-HIT"],["Content-Length","606"]]',
      location: "",
    },
    tabActiveDwellTime: 8250,
  },
];
