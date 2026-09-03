export const filterByDateRange = (dateString, range, customStart, customEnd) => {
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

  if (range === 'Custom') {
    if (!customStart && !customEnd) return true;
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return date >= start && date <= end;
    }
    if (customStart) {
      return date >= new Date(customStart);
    }
    if (customEnd) {
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      return date <= end;
    }
  }
  
  return true;
};
