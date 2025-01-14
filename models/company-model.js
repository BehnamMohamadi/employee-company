const { model, Schema } = require("mongoose");
const { isNumeric, isDate } = require("validator");
const {
  getIranStates,
  getCenterOfIranState,
  getIranProvinces,
} = require("../utils/iran-provinces-states-city");

const companySchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "company name must be atleast 3 charector"],
      maxlength: [40, "company name must be maximum 40 charector"],
      trim: true,
      required: [true, "company name is required value"],
    },
    registrationNumber: {
      type: String,
      unique: true,
      minlength: [6, "company registration number must be atleast 6 charector"],
      maxlength: [6, "company registration number must be maximum 6 charector"],
      validate: {
        validator: (value) => isNumeric(value),
        message: "company registration number must be number only",
      },
      trim: true,
      required: [true, "company registration number is required value"],
    },
    state: {
      type: String,
      validate: {
        validator: async (value) => {
          try {
            const state = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            const states = await getIranStates();

            return states.includes(state);
          } catch (error) {
            throw error;
          }
        },
        message: "provide valid state",
      },
      trim: true,
      required: true,
    },
    // city: {
    //   type: String,
    //   validate: {
    //     validator: async function (value) {
    //       const state = this.state;
    //       const formattedState =
    //         state.charAt(0).toUpperCase() + state.slice(1).toLowerCase();
    //       const centerOfState = await getCenterOfIranState(formattedState);
    //       return value === centerOfState;
    //     },
    //   },
    //   trim: true,
    //   required: [true, "name of the city where your company located is required"],
    // },

    city: {
      type: String,
      validate: async (value) => {
        try {
          const provinces = await getIranProvinces();
          return provinces.includes(value);
        } catch (err) {
          throw err;
        }
      },
      trim: true,
      required: [true, "name of the city where your company located is required"],
    },
    registrationDate: {
      type: Date,
      validate: {
        validator: (value) => isDate(value),
        message: "invalid date format",
      },
      required: [true, "registration date is required"],
    },
    telphone: {
      type: String,
      minlength: [11, "telphone must be 11 charectors"],
      maxlength: [11, "telphone must be 11 charectors"],
      validate: {
        validator: (value) => {
          return value.startsWith !== "0";
        },
        message: "telphone must be starts with '0'",

        validator: (value) => isNumeric(value),
        message: "telphone must be number",
      },
      unique: true,
      trim: true,
      required: [true, "telphone is required"],
    },
  },
  { timestamps: true }
);

module.exports = model("Company", companySchema);
