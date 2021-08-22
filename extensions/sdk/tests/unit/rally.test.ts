/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

jest.mock('firebase/app', () => ({
  __esModule: true,
  apps: [],
  initializeApp: jest.fn(),
}))

jest.mock('firebase/auth', () => ({
  __esModule: true,
  apps: [],
  getAuth: jest.fn(() => {
    return {
      currentUser: {
        uid: "testExtension:test123",
        getIdTokenResult: jest.fn(() => {
          return {
            claims: {
              firebaseUid: "test123",
            }
          }
        })
      },
      signOut: jest.fn(),
      onAuthStateChanged: jest.fn(),
    }
  }),
  signInWithCustomToken: jest.fn(),
  onAuthStateChanged: jest.fn(),
  connectAuthEmulator: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  apps: [],
  doc: jest.fn(),
  getDoc: jest.fn(() => {
    return {
      exists: true,
      data: () => {
        return { enrolled: true, uid: "test123", enrolledStudies: { "test-study": { enrolled: true } } }
      }
    }
  }),
  getFirestore: jest.fn(),
  onSnapshot: jest.fn(),
  connectFirestoreEmulator: jest.fn()
}))

interface globalThis {
  [key:string]: any; // Add index signature
}
const chrome = require("sinon-chrome/extensions");
// We need to provide the `browser.runtime.id` for sinon-chrome to
// be happy and play nice with webextension-polyfill. See this issue:
// https://github.com/mozilla/webextension-polyfill/issues/218
chrome.runtime.id = "testid";
global.chrome = chrome;

jest.mock("webextension-polyfill", () => require("sinon-chrome/webextensions"));

import { strict as assert } from 'assert';
import { onAuthStateChanged } from 'firebase/auth'
import { Rally, runStates, authProviders, webMessages } from '../../src/rally';

describe('Rally SDK', function () {
  beforeEach(() => {
    chrome.runtime.sendMessage.flush();
    chrome.runtime.sendMessage.yields();
  });
  afterEach(() => {
    delete global.fetch;
    chrome.flush();
  });

  it('must fail with an invalid callback function', function () {
    assert.throws(
      // @ts-ignore this isn't something that pure Typescript will allow, but there's nothing stopping JS from hitting it at runtime.
      () => new Rally(true, "not-a-function, will fail")
    );
  });

  it('pauses and resumes when receiving messages', async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;

    const rally = new Rally(
      true, // Developer mode.
      (message) => {
        if (message === runStates.PAUSED) {
          pausedCallbackCalled = true;
        } else if (message === runStates.RUNNING) {
          resumeCallbackCalled = true;
        }
      },
      "http://localhost"
    )

    assert.equal(rally._state, runStates.PAUSED);

    rally._resume();
    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(resumeCallbackCalled);

    rally._pause();
    assert.ok(rally._state === runStates.PAUSED);
    assert.ok(pausedCallbackCalled);
  });

  it('handles sign-up message from web and receives credentials', async function () {
    let pausedCallbackCalled = false;
    let resumeCallbackCalled = false;

    const rally = new Rally(
      true, // Developer mode.
      (message) => {
        if (message === runStates.PAUSED) {
          pausedCallbackCalled = true;
        } else if (message === runStates.RUNNING) {
          resumeCallbackCalled = true;
        }
      },
      "http://localhost"
    );

    const rallyToken = "...";
    const message = { type: webMessages.COMPLETE_SIGNUP, data: rallyToken };
    const sender = { url: `http://localhost` };

    const result = await rally._handleWebMessage(message, sender);

    assert.equal(result.type, webMessages.COMPLETE_SIGNUP_RESPONSE);
    console.debug(result);
    assert.equal(result.data.signedUp, true);

    // If the user is authenticated but enrolled in Rally, onboarding should be triggered.
    await rally._authStateChangedCallback({ uid: "test123" });
    assert.ok(!pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);
    // FIXME check that chrome.tabs.create is called with the correct route.

    // If the user is authenticated, enrolled in Rally, and enrolled in a study, the study should start data collection.
    chrome.runtime.id = "test-study";
    pausedCallbackCalled = false;
    resumeCallbackCalled = false;

    await rally._authStateChangedCallback({ uid: "test123" });

    // FIXME need to fully mock onSnapshot to get this to work
    /*
    assert.equal(rally._state, runStates.RUNNING);
    assert.ok(resumeCallbackCalled);
    assert.ok(!pausedCallbackCalled);
    */

    // If the user is authenticated, enrolled in Rally, and not enrolled in a study, the study should pause, and trigger study onboarding.
    chrome.runtime.id = "invalid-study-id";
    // FIXME comment out until onSnapshot is mocked
    // pausedCallbackCalled = false;
    resumeCallbackCalled = false;
    await rally._authStateChangedCallback({ uid: "test123" });
    // FIXME check that chrome.tabs.create is called with the correct route.

    assert.equal(rally._state, runStates.PAUSED);
    // FIXME comment out until onSnapshot is mocked
    // assert.ok(pausedCallbackCalled);
    assert.ok(!resumeCallbackCalled);

  });
});
