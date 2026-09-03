export const filterByDateRange = (dateString, range) => {
  if (range === 'All Time') return true;
  if (!dateString) return true;
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (range === 'Today') {
    return date.getDate() === now.getDate() && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }
  
  if (range === 'This Week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return date >= startOfWeek && date <= now;
  }
  
  if (range === 'This Month') {
    return date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }
  
  return true;
};
