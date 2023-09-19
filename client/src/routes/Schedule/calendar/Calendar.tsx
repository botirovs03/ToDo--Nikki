import { useState } from "react";
import Calendar from "react-calendar";
import "./Calendar.css";

interface CalendarProps {
  getDates: (dates: any) => void;
  events: any
}

function CalendarUI({ getDates, events }: CalendarProps) {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;


  // Function to check if a date is in the markedDates array
  const isDateMarked = (date:any) =>
  events.some((d:any) => new Date(d).toDateString() === date.toDateString());

  // Function to render custom content for marked dates
  const tileContent = ({ date, view }:any) => {
    if (view === "month" && isDateMarked(date)) {
      return <div className="mark"></div>;
      
    }
    return null;
  };

  return (
    <div className="app-calendar">
      <div className="calendar-container">
        <Calendar
          locale="ja"
          onChange={(newValue:any) => {
            setDateRange(newValue);
            getDates(newValue);
          }}
          value={[dateRange[0], dateRange[1]]}
          selectRange={true}
          tileContent={tileContent} // Apply custom content to marked dates
        />
      </div>
      <div className="date-inputs">
        <div>
          <label>開始日:</label>
          <input
            className="formSelect"
            type="date"
            value={startDate.toLocaleDateString('en-CA', {timeZone: 'Asia/Tokyo'})}
            onChange={(e) => {
              const newStartDate = new Date(e.target.value);
              setDateRange([newStartDate, endDate]);
            }}
          />
        </div>

        <div>
          <label>終了日:</label>
          <input
            className="formSelect"
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => {
              const newEndDate = new Date(e.target.value);
              setDateRange([startDate, newEndDate]);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarUI;
