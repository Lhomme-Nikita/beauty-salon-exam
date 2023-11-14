import moment from 'moment';

const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validate = (group, name, value) => {
  switch (group) {
    case "signup":
    case "login":
      switch (name) {
        case "email":
          if (!value) return "This field is required";
          if (!isValidEmail(value)) return "Please enter valid email address";
          return null;
        case "password":
          if (!value) return "This field is required";
          if (value.length < 4) return "Password should be at least 4 chars long";
          return null;
        case "name":
          if (!value) return "This field is required";
          return null;
        default:
          return null;
      }
    
    case "appointment":
      switch (name) {
        case "name":
          if (!value) return "Name is required";
          if (value.length < 2) return "Name should be at least 2 characters long";
          return null;
        case "surname":
          if (!value) return "Surname is required";
          if (value.length < 2) return "Surname should be at least 2 characters long";
          return null;
        case "date":
          if (!value) return "Date is required";
          if (!moment(value, "YYYY-MM-DD", true).isValid()) return "Invalid date format";
          if (moment(value).isBefore(moment(), 'day')) return "Date must be in the future";
          return null;
        case "time":
          if (!value) return "Time is required";
          const openingTime = moment('09:00', 'HH:mm');
          const closingTime = moment('18:00', 'HH:mm');
          const appointmentTime = moment(value, 'HH:mm');
          if (!appointmentTime.isValid()) return "Invalid time format";
          if (!appointmentTime.isBetween(openingTime, closingTime, 'minutes', '[]')) return "Time must be within operating hours (09:00 - 18:00)";
          return null;
        case "email":
          if (!value) return "Email is required";
          if (!isValidEmail(value)) return "Invalid email format";
          return null;
        default:
          return null; 
      }

    default:
      return null;
  }
};

const validateManyFields = (group, list) => {
  const errors = [];
  for (const field in list) {
    const err = validate(group, field, list[field]);
    if (err) errors.push({ field, err });
  }
  return errors;
}

export default validateManyFields;
