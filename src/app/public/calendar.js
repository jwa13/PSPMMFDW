var calendar = null;
var events = [];

document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
      calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
			start: 'dayGridMonth,timeGridWeek,timeGridDay',
			center: 'title',
			end: 'prevYear,prev,next,nextYear',
		},
		footerToolbar: {
			start: 'custom1',
			center: '',
			end: 'prev,next',
		},
		customButtons: {
			custom1: {
				text: 'Schedule an Appointment',
				click: function () {
					alert('clicked custom button 1!');
				},
			},
		},
      }); 
	  addevent();
      calendar.render();
});

function addevent() {
      calendar.addEvent({
         start: '2024-04-23T14:00:00',
         end: '2024-04-23T15:00:00',
         title: 'Test'
      });
}
