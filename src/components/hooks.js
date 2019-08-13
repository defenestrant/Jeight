import {useEffect, useState, useRef} from "react"


export const useDebounce = (value, delay) => {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(
      () => {
        // Set debouncedValue to value (passed in) after the specified delay
        const handler = setTimeout(() => {
          setDebouncedValue(value)
        }, delay)

        // Return a cleanup function that will be called every time ...
        // ... useEffect is re-called. useEffect will only be re-called ...
        // ... if value changes (see the inputs array below).
        // This is how we prevent debouncedValue from changing if value is ...
        // ... changed within the delay period. Timeout gets cleared and restarted.
        // To put it in context, if the user is typing within our app's ...
        // ... search box, we don't want the debouncedValue to update until ...
        // ... they've stopped typing for more than 500ms.
        return () => {
          clearTimeout(handler)
        }
      },

      // Only re-call effect if value changes
      // You could also add the "delay" var to inputs array if you ...
      // ... need to be able to change that dynamically.
      value
    )

    return debouncedValue
  }



// source : https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
const savedCallback = useRef();

// Remember the latest callback.
useEffect(() => {
    savedCallback.current = callback;
}, [callback]);

// Set up the interval.
useEffect(() => {
    function tick() {
    savedCallback.current();
    }
    if (delay !== null) {
    let id = setInterval(tick, delay);
    return () => clearInterval(id);
    }
}, [delay]);
}