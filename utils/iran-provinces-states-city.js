const getIranProvinces = async () => {
  try {
    const response = await fetch("https://iran-locations-api.ir/api/v1/en/states");
    const provincesData = await response.json();

    if (!response.ok) {
      throw await response.json();
    }

    const provinces = provincesData.map((item) => item.name.toLowerCase());

    return provinces;
  } catch (err) {
    throw err;
  }
};

const getIranStates = async () => {
  try {
    const response = await fetch("https://iran-locations-api.ir/api/v1/en/states");
    const data = await response.json();

    if (!response.ok) {
      throw await response.json();
    }

    const iranStates = data.map((state) => state.name);

    return iranStates;
  } catch (err) {
    throw err;
  }
};

const getCenterOfIranState = async (stateOfiran) => {
  try {
    const state =
      stateOfiran.charAt(0).toUpperCase() + stateOfiran.slice(1).toLowerCase();

    const response = await fetch(
      `https://iran-locations-api.ir/api/v1/en/states?state=${state}`
    );

    const data = await response.json();
    if (!response.ok) {
      throw await response.json();
    }

    return data[0].center;
  } catch (err) {
    throw err;
  }
};

getCenterOfIranState("tehran");

module.exports = { getIranProvinces, getIranStates, getCenterOfIranState };
