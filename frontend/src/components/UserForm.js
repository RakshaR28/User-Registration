import React, { useState } from "react";
import { saveUser } from "../services/api";

const alphaRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalRegex = /^\d{0,5}$/;

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
      addressLine2: "", // ✅ ADDED
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    },

    permanent: {
      addressLine1: "",
      addressLine2: "", // ✅ ADDED
      city: "",
      state: "",
      countryCode: "IN",
      postalCode: ""
    }
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // ✅ FIXED for nested fields
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
    if (!/^\d{5}$/.test(formData.current.postalCode)) {
      newErrors["current.postalCode"] = "Postal code must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const addresses = [
      { ...formData.current, addressType: "CURRENT" }
    ];

    if (
      formData.permanent.addressLine1 &&
      formData.permanent.city &&
      formData.permanent.state &&
      /^\d{5}$/.test(formData.permanent.postalCode)
    ) {
      addresses.push({
        ...formData.permanent,
        addressType: "PERMANENT"
      });
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

        <input
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={handleAlphaChange}
        />

        <input
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={(e) => handleChange(e)}
        />

        {/* ADDRESS SECTION */}
        <div className="address-container">

          {/* CURRENT */}
          <div className="address-block">
            <h3>Current Address *</h3>

            <input
              name="addressLine1"
              placeholder="Address *"
              value={formData.current.addressLine1}
              onChange={(e) => handleChange(e, "current")}
            />

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

            <input
              name="state"
              placeholder="State *"
              value={formData.current.state}
              onChange={(e) => handleAlphaChange(e, "current")}
            />

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
          </div>

          {/* PERMANENT */}
          <div className="address-block">
            <h3>Permanent Address</h3>

            <input
              type="checkbox"
              checked={formData.sameAddress}
              onChange={handleCheckbox}
            /> Same as current

            <input
              name="addressLine1"
              placeholder="Address"
              value={formData.permanent.addressLine1}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="addressLine2"
              placeholder="Address Line 2"
              value={formData.permanent.addressLine2}
              onChange={(e) => handleChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.permanent.city}
              onChange={(e) => handleAlphaChange(e, "permanent")}
              disabled={formData.sameAddress}
            />

            <input
              name="state"
              placeholder="State"
              value={formData.permanent.state}
              onChange={(e) => handleAlphaChange(e, "permanent")}
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
              onChange={(e) => handlePostalChange(e, "permanent")}
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
