const { Schema, model } = require("mongoose");
const { isDate, isNumeric, isMobilePhone } = require("validator");
const employeeSchema = new Schema(
  {
    // systemاستان سکونت، نقش کارمند در شرکت(مدیر - کارمند)، تاریخ ثبت نام کارمند در

    firstname: {
      type: String,
      required: [true, "firstname is required"],
      minlength: [3, "firstname must be atleast 3 charector"],
      maxlength: [30, "firstname must be maximum 30 charector"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "lastname is required"],
      minlength: [3, "lastname must be atleast 3 charector"],
      maxlength: [30, "lastname must be maximum 30 charector"],
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      enum: {
        values: ["male", "female", "not-set"],
        message: "gender is eather male or female",
      },
      default: "not-set",
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "date of birthday is required"],
      validate: {
        validator: (value) => {
          return isDate(value, {
            format: "YYYY/MM/DD",
            strictMode: true,
            delimiters: ["-"],
          });
        },
      },

      phoneNumber: {
        type: [String],
        required: [true, "phonenumber is required"],
        unique: true,
        validate: {
          validator: (value) => {
            if (value.length) return false;
            return value.every((phone) => isMobilePhone(phone, "fa-IR"));
          },
          message: "provide valid phone number and at least one phone number",
        },
      },
      nationalId: {
        type: String,
        required: true,
        unique: true,
        minlength: [10, "nationalId must be atleast 10 number"],
        maxlength: [10, "nationalId must be maximum 10 number"],
        validate: {
          validator: (value) => isNumeric(value),
          message: "national id must be numbers only",
        },
        trim: true,
      },
      province: {
        type: String,
        default: "not-set",
        validate: async (value) => {
          try {
            const provinces = await getProvinces();
            return provinces.includes(value);
          } catch (err) {
            throw err;
          }
        },
        trim: true,
      },
      role: {
        type: String,
        enum: {
          values: ["manager", "employee"],
          message: "role must be eather manager or employee",
        },
        default: "employee",
        trim: true,
        lowercase: true,
      },
      company: {
        type: String,
        required: [true, "company is required."],
        minlength: [2, "company must be atleast 3 characters"],
        maxlength: [40, "company must be maximum 30 characters"],
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Employee", employeeSchema);
