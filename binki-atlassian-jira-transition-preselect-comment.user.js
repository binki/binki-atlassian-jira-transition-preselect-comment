// ==UserScript==
// @name binki-atlassian-jira-transition-preselect-comment
// @homepageURL https://github.com/binki/binki-atlassian-jira-transition-preselect-comment
// @version 1.0.0
// @match https://*.atlassian.net/*
// @require https://github.com/binki/binki-userscript-when-element-changed-async/raw/88cf57674ab8fcaa0e86bdf5209342ec7780739a/binki-userscript-when-element-changed-async.js
// @require https://github.com/binki/binki-userscript-when-element-query-selector-async/raw/0a9c204bdc304a9e82f1c31d090fdfdf7b554930/binki-userscript-when-element-query-selector-async.js
// ==/UserScript==

(async () => {
  while (true) {
    // Wait for the tab contents to appear. If we don’t wait for the form to initialize enough, we end up breaking Ctrl+Enter.
    // It is like Jira’s Ctrl+Enter logic relies on the default tab fully loading initially so it can set some state properly
    // which is only used when submitting the form using Ctrl+Enter. See #1
    await whenElementQuerySelectorAsync(document.body, `[data-testid='issue-transition.ui.issue-transition-modal--body'] [data-testid='issue-field.rich-text.ui.edit.editor']`);

    const replyToCustomerTabSelector = '#issue-transition-comment-editor-container-tabs-1';
    const replyToCustomerTab = await whenElementQuerySelectorAsync(document.body, replyToCustomerTabSelector);

    // Hopefully we have waited enough now to avoid confusing the form.
    replyToCustomerTab.click();

    // Now wait for it to disappear so that the user may manually select “Add internal note” if they so desire and
    // to avoid spamming events when we already clicked on it.
    while (document.body.querySelector(replyToCustomerTabSelector)) {
      await whenElementChangedAsync(document.body);
    }
  }
})();
