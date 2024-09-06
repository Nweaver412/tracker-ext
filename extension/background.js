chrome.alarms.create("syncData", { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "syncData") {
    chrome.storage.local.get({habits: []}, function(result) {
      let habits = result.habits;
      console.log('Syncing data:', habits);
    // add sql
    });
  }
});