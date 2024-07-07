// import { useEffect, useState } from 'react';

// const HomePage = () => {
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:3002/personal_manager/users/register')
//       .then((response) => response.json())
//       .then((data) => setMessage(data.message));
//   }, []);

//   return (
//     <div>
//       <h1>Message from the Backend:</h1>
//       <p>{message}</p>
//     </div>
//   );
// };

// export default HomePage;