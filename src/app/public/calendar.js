var calendar = null;
var events = [];

document.addEventListener('DOMContentLoaded', function() {
      var calendarEl = document.getElementById('calendar');
      calendar = new FullCalendar.Calendar(calendarEl, {
  		googleCalendarApiKey: 'AIzaSyBSI3DVYbn6WY3tV3KTrPIEFBlbL0t0s6o',
		events: {
			googleCalendarId: 'c_3f89c65c96906b0e35da55a80a8ecd7ba5babdd9d54f4fdaddb1da6230766718@group.calendar.google.com',
			className: 'gcal-event' // an option!
		},
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
      calendar.render();
});

function addevent() {
      calendar.addEvent({
         start: '2024-04-23T14:00:00',
         end: '2024-04-23T15:00:00',
         title: 'Test'
      });
}
