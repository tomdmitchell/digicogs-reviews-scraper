const counterWrapper = () => {
  let counter = 0;
  const counterInner = () => {
    counter = counter + 1;
    return counter;
  };
  return counterInner;
};

export default counterWrapper;
