exports.emailValidation = (email) => {
  const check = String(email)
    .toLocaleLowerCase()
    .match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

  return check;
};

exports.passwordValidation = (password) => {
  if (password.length < 8) {
    return false;
  } else {
    return true;
  }
};

exports.dateValidation = (date) => {
  let UserDate = new Date(date).getTime();
  let current = new Date().getTime();
  return UserDate < current;
};

exports.isDate = (date) => {
  let userDate = new Date(date);
  return !isNaN(userDate.getTime());
};
