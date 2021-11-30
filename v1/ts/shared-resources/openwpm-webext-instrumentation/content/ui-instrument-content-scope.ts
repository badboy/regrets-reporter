import { browser } from "webextension-polyfill-ts";
import { uiInstrumentPageScript } from "./ui-instrument-page-scope";

export interface UiInstrumentTimeStampedMessage {
  timeStamp: string;
}

function getPageScriptAsString() {
  return `(${uiInstrumentPageScript}());`;
}

function insertScript(text, data) {
  const parent = document.documentElement,
    script = document.createElement("script");
  script.text = text;
  script.async = false;

  for (const key of Object.keys(data)) {
    const qualifiedName = "data-" + key.split("_").join("-");
    script.setAttribute(qualifiedName, data[key]);
  }

  parent.insertBefore(script, parent.firstChild);
  parent.removeChild(script);
}

function emitMsg(type, msg) {
  msg.timeStamp = new Date().toISOString();
  browser.runtime.sendMessage({
    namespace: "ui-instrument",
    type,
    data: msg,
  });
}

export function injectUiInstrumentPageScript(contentScriptConfig) {
  const injection_uuid = Math.random();

  // listen for messages from the script we are about to insert
  document.addEventListener(injection_uuid.toString(), function(
    e: CustomEvent,
  ) {
    if (!e.detail) {
      console.error("Message sent from page script was empty/falsy", { e });
      throw new Error("Message sent from page script was empty/falsy");
    }
    // pass these on to the background page
    const msgs = e.detail;
    if (Array.isArray(msgs)) {
      msgs.forEach(function(msg) {
        emitMsg(msg.type, msg.content);
      });
    } else {
      emitMsg(msgs.type, msgs.content);
    }
  });

  insertScript(getPageScriptAsString(), {
    injection_uuid,
    ...contentScriptConfig,
  });
}
