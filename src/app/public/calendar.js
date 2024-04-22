var calendar = null;

document.addEventListener('DOMContentLoaded', async function () {
    var calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                const response = await fetch('/events'); // Assuming your route is at /events
                const events = await response.json();
                console.log('Fetched events:', events); // Log fetched events
                // Check if events are in the correct format
                if (Array.isArray(events) && events.every(event => event.summary && event.start.date)) {
					addevent(events);
                    successCallback(events);
                } else {
                    console.error('Events fetched are not in the expected format or missing required properties');
                    failureCallback('Events format error');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                failureCallback(error);
            }
        },
        headerToolbar: {
            start: 'dayGridMonth,timeGridWeek,timeGridDay',
            center: 'title',
            end: 'prevYear,prev,next,nextYear',
        },
    });
    calendar.render();
});

function addevent(events) {
	for(let i = 0; i < events.length; i++)
	calendar.addEvent({
	   start: events[i].start.date,
	   end: events[i].end.date,
	   title: events[i].summary
	});
}
