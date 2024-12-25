import { useEffect } from 'react';

// Custom hook to handle clicks outside of an element
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    // Define the function to handle the outside click
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(); // Invoke the handler if the click was outside
      }
    };

    // Attach the event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove the event listener when the component is unmounted or dependencies change
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]); // Re-run effect when ref or handler changes
};

export default useClickOutside;
