function initializeCalendar() {
    document.addEventListener('DOMContentLoaded', function () {
        var calendarEl = document.getElementById('calendar'); var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                start:
                    'dayGridMonth,timeGridWeek,timeGridDay', 
                center: 'title', 
                end:'prevYear,prev,next,nextYear'
            }, 
            footerToolbar: {
                start: 'custom1', 
                center: '', 
                end: 'prev,next'
            },
            customButtons: {
                custom1: {
                    text: 'Schedule an Appointment', 
                    click: function () {
                        alert('clicked custom button 1!'); 
                    } 
                }, 
            }
        }); 
        calendar.render();
    });
  }