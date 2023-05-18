export const handleKeyDown = (e, fn) => {
  console.log('press');
  if (e.key === 'Enter') {
    fn();
  }
};
