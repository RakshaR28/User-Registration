import React, { useState } from "react";
import { saveUser } from "../services/api";

const alphaRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    },

    permanent: {
      addressLine1: "",
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleAlphaChange = (e) => {
    const { name, value } = e.target;
    if (alphaRegex.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const handleCheckbox = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      sameAddress: checked,
      permanent: checked ? prev.current : prev.permanent
    }));
  };

  const validate = () => {
    let newErrors = {};

    // User validations
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

    // Current address - ALL mandatory
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
    if (!formData.current.postalCode.trim()) {
      newErrors["current.postalCode"] = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      addresses: [
        { ...formData.current, addressType: "CURRENT" },
        { ...formData.permanent, addressType: "PERMANENT" }
      ]
    };

    try {
      await saveUser(payload);
      setMessage("✅ User saved");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        sameAddress: false,
        current: { addressLine1: "", city: "", state: "", countryCode: "IN", postalCode: "" },
        permanent: { addressLine1: "", city: "", state: "", countryCode: "IN", postalCode: "" }
      });

      setErrors({});

      if (onUserSaved) onUserSaved();
    } catch (err) {
      setMessage("Error saving user");
    }
  };

  return (
    <div>
      <h2>User Register</h2>

      <form onSubmit={handleSubmit}>

        {/* USER DETAILS */}
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

        {/* ADDRESS SECTION */}
        <div className="address-container">

          {/* CURRENT ADDRESS */}
          <div className="address-block">
            <h3 className="section-title">Current Address *</h3>

            <input
              name="addressLine1"
              placeholder="Address *"
              value={formData.current.addressLine1}
              onChange={(e) => handleChange(e, "current")}
            />
            {errors["current.addressLine1"] && <p className="error">{errors["current.addressLine1"]}</p>}

            <input
              name="city"
              placeholder="City *"
              value={formData.current.city}
              onChange={(e) => handleChange(e, "current")}
            />
            {errors["current.city"] && <p className="error">{errors["current.city"]}</p>}

            <input
              name="state"
              placeholder="State *"
              value={formData.current.state}
              onChange={(e) => handleChange(e, "current")}
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
            {errors["current.countryCode"] && <p className="error">{errors["current.countryCode"]}</p>}

            <input
              name="postalCode"
              placeholder="Postal Code *"
              value={formData.current.postalCode}
              onChange={(e) => handleChange(e, "current")}
            />
            {errors["current.postalCode"] && <p className="error">{errors["current.postalCode"]}</p>}
          </div>

          {/* PERMANENT ADDRESS */}
          <div className="address-block">
            <h3 className="section-title">Permanent Address</h3>

            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={formData.sameAddress}
                onChange={handleCheckbox}
              />
              <label style={{ margin: 0 }}>Same as current</label>
            </div>

            <input
              name="addressLine1"
              placeholder="Address"
              value={formData.permanent.addressLine1}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.permanent.city}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="state"
              placeholder="State"
              value={formData.permanent.state}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

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
              placeholder="Postal Code"
              value={formData.permanent.postalCode}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />
          </div>

        </div>

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UserForm;