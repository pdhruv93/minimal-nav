export function formatDistance(meters: number) {
  if (meters < 1000) {
    return `${meters} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

export function formatDuration(seconds: number) {
  if (seconds < 60) {
    return `${seconds} sec`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
