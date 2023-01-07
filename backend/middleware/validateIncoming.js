
const validIncoming = {

  validateURL: (value, helpers) => {
    if (validator.isURL(value)) {
      return value;
    }
    return helpers.error('string.uri');
  }

  // validateHead: ()
}