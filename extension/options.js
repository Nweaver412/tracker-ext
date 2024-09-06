document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportData');
    const habitList = document.getElementById('habitList');
  
    function displayHabits() {
      chrome.storage.local.get({habits: []}, function(result) {
        habitList.innerHTML = '';
        result.habits.forEach(function(habit, index) {
          const habitElement = document.createElement('div');
          habitElement.className = 'habit-item';
          habitElement.textContent = `${habit.type} - ${habit.timestamp}`;
          habitList.appendChild(habitElement);
        });
      });
    }
  
    exportButton.addEventListener('click', function() {
      chrome.storage.local.get({habits: []}, function(result) {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result.habits));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "habits_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    });
  
    displayHabits();
  });