import sanitizer from 'mongo-sanitize';

export const sanitize = (req, res, next) => {
  console.log(req.body)
  if(req.body) {
    /*
    const keys = Object.keys(req.body);
    const newBody = {};

    keys.forEach(key => {
      newBody[key] = sanitizer(req.body[key]);
    })

    console.log(newBody);
    //req.body = newBody;
    */
  }

  next();
}