document.addEventListener('DOMContentLoaded', function() {
    const habitType = document.getElementById('habitType');
    const mealForm = document.getElementById('mealForm');
    const sleepForm = document.getElementById('sleepForm');
    const anxietyForm = document.getElementById('anxietyForm');
    const submitButton = document.getElementById('submitHabit');
  
    function updateFormVisibility() {
      mealForm.style.display = 'none';
      sleepForm.style.display = 'none';
      anxietyForm.style.display = 'none';
  
      switch(habitType.value) {
        case 'meal':
          mealForm.style.display = 'block';
          break;
        case 'sleep':
          sleepForm.style.display = 'block';
          break;
        case 'anxiety':
          anxietyForm.style.display = 'block';
          break;
      }
    }
  
    habitType.addEventListener('change', updateFormVisibility);
    updateFormVisibility();
  
    submitButton.addEventListener('click', function() {
      let data = {
        type: habitType.value,
        timestamp: new Date().toISOString()
      };
  
      switch(habitType.value) {
        case 'meal':
          data.description = document.getElementById('mealDescription').value;
          data.time = document.getElementById('mealTime').value;
          data.duration = document.getElementById('mealDuration').value;
          break;
        case 'sleep':
          data.startTime = document.getElementById('sleepStart').value;
          data.endTime = document.getElementById('sleepEnd').value;
          data.duration = document.getElementById('sleepDuration').value;
          break;
        case 'anxiety':
          data.time = document.getElementById('anxietyTime').value;
          data.duration = document.getElementById('anxietyDuration').value;
          data.severity = document.getElementById('anxietySeverity').value;
          data.triggers = document.getElementById('anxietyTriggers').value;
          break;
      }
  
      chrome.storage.local.get({habits: []}, function(result) {
        let habits = result.habits;
        habits.push(data);
        chrome.storage.local.set({habits: habits}, function() {
          console.log('Habit saved');
          // Clear form
          document.querySelectorAll('input').forEach(input => input.value = '');
          document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
          updateFormVisibility();
        });
      });
    });
  });
  
  // Function to sync data with backend
  function syncWithBackend() {
    chrome.storage.local.get({habits: []}, function(result) {
      let habits = result.habits;
      if (habits.length > 0) {
        fetch('http://localhost:5000/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({habits: habits}),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Sync successful', data);
          // Clear synced data from local storage
          chrome.storage.local.set({habits: []});
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }
    });
  }
  
  // Sync every 5 minutes
  setInterval(syncWithBackend, 5 * 60 * 1000);