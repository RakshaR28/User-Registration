import React, { useState } from "react";
import { saveUser } from "../services/api";

const alphaRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalRegex = /^\d{0,6}$/;

const countries = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" }
];

const UserForm = ({ onUserSaved }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sameAddress: false,

    current: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    },

    permanent: {
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [backendEmailError, setBackendEmailError] = useState(""); 

  const handleAlphaChange = (e, type = null) => {
    const { name, value } = e.target;

    if (alphaRegex.test(value)) {
      if (type) {
        setFormData((prev) => ({
          ...prev,
          [type]: {
            ...prev[type],
            [name]: value
          }
        }));
        setErrors((prev) => ({ ...prev, [`${type}.${name}`]: "" }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleChange = (e, type = null) => {
    const { name, value } = e.target;

    if (type) {
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [name]: value
        }
      }));
      setErrors((prev) => ({ ...prev, [`${type}.${name}`]: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePostalChange = (e, type) => {
    const { name, value } = e.target;

    if (postalRegex.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [name]: value
        }
      }));
      setErrors((prev) => ({ ...prev, [`${type}.${name}`]: "" }));
    }
  };

  const handleCheckbox = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      sameAddress: checked,
      permanent: checked ? { ...prev.current } : prev.permanent
    }));
  };
  const isValidPostalCode = (postalCode, countryCode) => {
  if (countryCode === "IN") {
    return /^\d{6}$/.test(postalCode); // India → 6 digits
  }
  if (countryCode === "US") {
    return /^\d{5}$/.test(postalCode); // US → 5 digits
  }
  return false;
};
  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.current.addressLine1.trim()) {
      newErrors["current.addressLine1"] = "Address is required";
    }
    if (!formData.current.city.trim()) {
      newErrors["current.city"] = "City is required";
    }
    if (!formData.current.state.trim()) {
      newErrors["current.state"] = "State is required";
    }
    if (!formData.current.countryCode) {
      newErrors["current.countryCode"] = "Country is required";
    }
   if (!isValidPostalCode(formData.current.postalCode, formData.current.countryCode)) {
  newErrors["current.postalCode"] =
    formData.current.countryCode === "IN"
      ? "Postal code must be 6 digits"
      : "Postal code must be 5 digits";
}

    // ✅ FIX: respect sameAddress
    if (!formData.sameAddress) {
      
      // ✅ Permanent behaves exactly like current when unchecked
if (!formData.sameAddress) {
  if (!formData.permanent.addressLine1.trim()) {
    newErrors["permanent.addressLine1"] = "Address is required";
  }
  if (!formData.permanent.city.trim()) {
    newErrors["permanent.city"] = "City is required";
  }
  if (!formData.permanent.state.trim()) {
    newErrors["permanent.state"] = "State is required";
  }
  if (!formData.permanent.countryCode) {
    newErrors["permanent.countryCode"] = "Country is required";
  }
  if (!isValidPostalCode(formData.permanent.postalCode, formData.permanent.countryCode)) {
  newErrors["permanent.postalCode"] =
    formData.permanent.countryCode === "IN"
      ? "Postal code must be 6 digits"
      : "Postal code must be 5 digits";
}
}
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setMessage("Please enter the mandatory fields");
      return;
    }

    const addresses = [
      { ...formData.current, addressType: "CURRENT" }
    ];

    // ✅ FIX: handle sameAddress correctly
    if (formData.sameAddress) {
      addresses.push({
        ...formData.current,
        addressType: "PERMANENT"
      });
    } else {
      const isPermanentComplete =
        formData.permanent.addressLine1 &&
        formData.permanent.city &&
        formData.permanent.state &&
        /^\d{5}$/.test(formData.permanent.postalCode);

      if (isPermanentComplete) {
        addresses.push({
          ...formData.permanent,
          addressType: "PERMANENT"
        });
      }
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      addresses: addresses
    };

    try {
      await saveUser(payload);
      setMessage("✅ User saved");
       setBackendEmailError("");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        sameAddress: false,
        current: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          countryCode: "IN",
          postalCode: ""
        },
        permanent: {
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          countryCode: "IN",
          postalCode: ""
        }
      });

      setErrors({});
      if (onUserSaved) onUserSaved();
    } catch (err) {
      setBackendEmailError(err.message || "Error saving user");
    }
  };

  return (
    <div>
      <h2>User Registeration</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={handleAlphaChange}
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleAlphaChange}
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <input
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />
        {errors.email && <p className="error">{errors.email}</p>}
        {backendEmailError && <p className="error">{backendEmailError}</p>}

        <div className="address-container">

          <div className="address-block">
            <h3>Current Address *</h3>

            <input
              name="addressLine1"
              placeholder="Address Line 1*"
              value={formData.current.addressLine1}
              onChange={(e) => handleChange(e, "current")}
            />
            {errors["current.addressLine1"] && <p className="error">{errors["current.addressLine1"]}</p>}

            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.current.addressLine2}
              onChange={(e) => handleChange(e, "current")}
            />

            <input
              name="city"
              placeholder="City *"
              value={formData.current.city}
              onChange={(e) => handleAlphaChange(e, "current")}
            />
            {errors["current.city"] && <p className="error">{errors["current.city"]}</p>}

            <input
              name="state"
              placeholder="State *"
              value={formData.current.state}
              onChange={(e) => handleAlphaChange(e, "current")}
            />
            {errors["current.state"] && <p className="error">{errors["current.state"]}</p>}

            <select
              name="countryCode"
              value={formData.current.countryCode}
              onChange={(e) => handleChange(e, "current")}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="postalCode"
              placeholder="Postal Code *"
              value={formData.current.postalCode}
              onChange={(e) => handlePostalChange(e, "current")}
            />
            {errors["current.postalCode"] && <p className="error">{errors["current.postalCode"]}</p>}
          </div>

          <div className="address-block">
            <h3>Permanent Address</h3>

            <div className="checkbox-row">
         <input
           type="checkbox"
           checked={formData.sameAddress}
           onChange={handleCheckbox}
           />
          <label>Same as current</label>
          </div>

            <input
              name="addressLine1"
              placeholder="Address Line 1*"
              value={formData.permanent.addressLine1}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />
              {errors["permanent.addressLine1"] && 
             <p className="error">{errors["permanent.addressLine1"]}</p>}

            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.permanent.addressLine2}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="city"
              placeholder="City*"
              value={formData.permanent.city}
              onChange={(e) => handleAlphaChange(e, "permanent")}
              disabled={formData.sameAddress}
            />
              {errors["permanent.city"] && 
             <p className="error">{errors["permanent.city"]}</p>}

            <input
              name="state"
              placeholder="State*"
              value={formData.permanent.state}
              onChange={(e) => handleAlphaChange(e, "permanent")}
              disabled={formData.sameAddress}
            />
              {errors["permanent.state"] && 
            <p className="error">{errors["permanent.state"]}</p>}

            <select
              name="countryCode"
              value={formData.permanent.countryCode}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              name="postalCode"
              placeholder="Postal Code*"
              value={formData.permanent.postalCode}
              onChange={(e) => handlePostalChange(e, "permanent")}
              disabled={formData.sameAddress}
            />
              {errors["permanent.postalCode"] && 
            <p className="error">{errors["permanent.postalCode"]}</p>}
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UserForm;
