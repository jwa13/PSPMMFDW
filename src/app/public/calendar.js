import processes from '../controllers/dataController';

var calendar = null;

document.addEventListener('DOMContentLoaded', function () {
	var calendarEl = document.getElementById('calendar');
	calendar = new FullCalendar.Calendar(calendarEl, {
		googleCalendarApiKey: 'AIzaSyBSI3DVYbn6WY3tV3KTrPIEFBlbL0t0s6o',
		events: {
			googleCalendarId:
				'c_3f89c65c96906b0e35da55a80a8ecd7ba5babdd9d54f4fdaddb1da6230766718@group.calendar.google.com',
			className: 'gcal-event', // an option!
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
		eventContent: function (arg) {
			// Check if the event's title is "Test"
			if (arg.event.title === "Test") {
				// Return the default content for events with the title "Test"
				return { html: arg.event.title };
			} else {
				// Prevent rendering of events not matching the title "Test"
				return null; // Or you could return false
			}
		},
	});
	calendar.render();
});
