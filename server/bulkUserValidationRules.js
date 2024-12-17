const { check } = require("express-validator");

const bulkUserValidationRules = [
  check("*.emailR")
    .isEmail()
    .withMessage("Each user must have a valid email."),
  check("*.firstName")
    .matches(/^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*)$/)
    .withMessage("First name must contain only alphabets and valid characters."),
  check("*.lastName")
    .matches(/^([a-zA-Z',.-]+( [a-zA-Z',.-]+)*)$/)
    .withMessage("Last name must contain only alphabets and valid characters."),
  check("*.role")
    .isIn(["ADMIN", "USER"])
    .withMessage("Role must be either 'ADMIN' or 'USER'."),
  check("*.password")
    .matches(/^(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?])(?=.*[0-9]).*$/)
    .withMessage(
      "Password must contain at least one special character and one numeric digit."
    ),
  check("*.repassword")
    .custom((value, { req, path }) => {
      const index = path.match(/\d+/)?.[0];
      if (req.body[index]?.password !== value) {
        throw new Error("Password and confirm password must match.");
      }
      return true;
    })
    .withMessage("Password confirmation does not match password."),
];

module.exports = bulkUserValidationRules;