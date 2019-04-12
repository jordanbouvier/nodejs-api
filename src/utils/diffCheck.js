export const isDifferent = (object, values) => {
  let result = false;
  for(const prop in values) {
    if(typeof(object[prop]) !== 'undefined' && typeof(values[prop]) !== 'undefined') {
      if(object[prop] !== values[prop]) {
        object[prop] = values[prop];
        result = object;
      }
    }    
  }
  return result;
};