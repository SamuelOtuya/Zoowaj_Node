export default function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  // Options for formatting the date
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Use 12-hour clock
  };

  return date.toLocaleString('en-US', options);
}
