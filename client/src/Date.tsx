import moment from 'moment';

// Define a custom component that displays the current date
const CurrentDate = () => {
  // Get the current date using Moment and format it as "dddd, MMMM D"
  const today = moment().format('dddd, MMMM D');

  // Return a JSX element that renders the date
  return <div className='today text nav-text'>{today}</div>;
};

// Export the component
export default CurrentDate;
