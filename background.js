chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('questionReminder', { when: Date.now() + 10000 }); // Set to trigger every 30 minutes
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'questionReminder') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Time for a Question!',
      message: 'Open a new tab to solve an interview question.',
      buttons: [{ title: 'Solve Now' }],
      priority: 0,
    });
  }
});

chrome.notifications.onButtonClicked.addListener(() => {
  chrome.tabs.create({ url: 'index.html' }); // Opens the extension's main page
});
