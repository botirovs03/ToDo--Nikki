// import { useState } from 'react';
// import Calendar from 'react-calendar';

// // React Calendar with default styling
// import 'react-calendar/dist/Calendar.css';

// // If you want to add your own styling, you can override these classes and add your custom CSS properties.
// import './Calendar.css';

// function CalendarUI() {
//   const [date, setDate] = useState([new Date(), new Date()]);

//   return (
//     <div className='app'>
//       <h1 className='text-center'>React Calendar</h1>
//       <div className='calendar-container'>
//         {/* The initial value passed to the calendar is the present date */}
//         <Calendar
//           onChange={(newValue) => {
//             setDate(newValue)
            
//           }}
//           value={date}
//           selectRange={true}
          
//           onClickDay={(newDate) => console.log('onClick property', `clicked single date is ${newDate}`)}
//         />
//         {/* When a user clicks the calendar, its value will be set to the user’s selection */}
//       </div>
//       <p className='text-center'>
//         <span className='bold'>Selected Date:</span>{' '}
//         {date[0].toDateString()} - {date[1].toDateString()}
//       </p>
//     </div>
//   );
// }

// export default CalendarUI;
