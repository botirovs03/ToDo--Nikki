// import React, { useState } from "react";
// import SelectElement from "./Select";

// const Form = () => {
//   // Initialize the state variables for the form fields
//   const [name, setName] = useState("");
//   const [selectValue, setSelectValue] = useState("");

//   // Define the handler functions for the form fields
//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setName(e.target.value);
//   };

//   const handleSelectChange = (value: string) => {
//     setSelectValue(value);
//   };

//   // Define the handler function for the form submission
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(`Name: ${name}, Select Value: ${selectValue}`);
//   };

//   // Return the JSX element for the form
//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="name">Name</label>
//       <input
//         type="text"
//         id="name"
//         value={name}
//         onChange={handleNameChange}
//       />
//       <label htmlFor="select">Select</label>
//       <SelectElement
//         options={["Ordinary", "Important", "Critical"]}
//         value={selectValue}
//         onChange={handleSelectChange}
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default Form;
