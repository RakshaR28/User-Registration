import React, { useState } from "react";
import { saveUser } from "../services/api";

const alphaRegex = /^[A-Za-z\s]*$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const postalRegex = /^\d{0,5}$/; // max 5 digits

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

  // ================= HANDLERS =================

  const handleAlphaChange = (e, type = null) => {
    const { name, value } = e.target;
    if (alphaRegex.test(value)) {
      if (type) {
        setFormData((prev) => ({
          ...prev,
          [type]: { ...prev[type], [name]: value }
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
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
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
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

  // ================= VALIDATION =================

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

    // Current address
    if (!formData.current.addressLine1.trim()) {
      newErrors["current.addressLine1"] = "Address is required";
    }
    if (!formData.current.city.trim()) {
      newErrors["current.city"] = "City is required";
    }
    if (!formData.current.state.trim()) {
      newErrors["current.state"] = "State is required";
    }
    if (!formData.current.postalCode.match(/^\d{5}$/)) {
      newErrors["current.postalCode"] = "Postal code must be 5 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const addresses = [
      { ...formData.current, addressType: "CURRENT" }
    ];

    // Add permanent only if valid
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
      console.log("Payload:", payload);

      await saveUser(payload);
      setMessage("✅ User saved");

      setFormData({
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

      setErrors({});

      if (onUserSaved) onUserSaved();
    } catch (err) {
      setMessage("Error saving user");
    }
  };

  // ================= UI =================

  return (
    <div>
      <h2>User Register</h2>

      <form onSubmit={handleSubmit}>

        {/* USER */}
        <input
          name="firstName"
          placeholder="First Name *"
          value={formData.firstName}
          onChange={(e) => handleAlphaChange(e)}
        />
        {errors.firstName && <p className="error">{errors.firstName}</p>}

        <input
          name="lastName"
          placeholder="Last Name *"
          value={formData.lastName}
          onChange={(e) => handleAlphaChange(e)}
        />
        {errors.lastName && <p className="error">{errors.lastName}</p>}

        <input
          name="email"
          placeholder="Email *"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* CURRENT ADDRESS */}
        <h3>Current Address *</h3>

        <input
          name="addressLine1"
          placeholder="Address *"
          value={formData.current.addressLine1}
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

        {/* PERMANENT */}
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

        <button type="submit">Submit</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UserForm;
