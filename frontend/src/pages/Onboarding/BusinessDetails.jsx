import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db, storage } from "../../firebase/firebase";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import PersonIcon from "@mui/icons-material/Person";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const BusinessDetails = () => {
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [businessImage, setBusinessImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setBusinessImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async () => {
    if (!businessName || !category) {
      alert("Please fill in all required fields");
      return;
    }
    if (!user) {
      alert("You must be logged in to set up a business.");
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = null;

      if (businessImage) {
        const storageRef = ref(
          storage,
          `business-images/${Date.now()}-${businessImage.name}`
        );
        await uploadBytes(storageRef, businessImage);
        uploadedImageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "businesses"), {
        userId: user.uid,
        name: businessName,
        category,
        imageUrl: uploadedImageUrl,
        createdAt: new Date(),
      });

      console.log("Business setup successful!");
      navigate("/onboarding/confirmation");
    } catch (error) {
      console.error("Error setting up business:", error);
      alert("There was an error setting up your business. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-blue-300 via-blue-500 to-blue-700 p-4">
      <div className="absolute top-4 right-4">
        <Link
          to="/login"
          className="bg-white text-blue-600 rounded-full px-6 py-2 text-lg sm:text-xl font-medium flex items-center space-x-2 hover:bg-blue-50 transition duration-300 shadow-md"
        >
          <PersonIcon className="text-blue-600" />
          <span>Login</span>
        </Link>
      </div>
      <div className="flex items-center justify-center w-full max-w-md mb-8 mt-8">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center border-2 border-white">
            <CheckIcon className="text-blue-500" />
          </div>
          <div className="w-16 h-0.5 bg-white"></div>
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-lg font-bold text-blue-500 border-2 border-white">
            2
          </div>
          <div className="w-16 h-0.5 bg-white"></div>
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-40 flex items-center justify-center text-lg font-bold text-white">
            3
          </div>
        </div>
      </div>
      <div className="w-full max-w-md bg-blue-400/10 inset-shadow-sm rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Setup my Business
        </h1>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white bg-opacity-40 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Business"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <StorefrontIcon
                  className="text-blue-300"
                  style={{ fontSize: 48 }}
                />
              )}
            </div>
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md"
            >
              <AddIcon className="text-blue-500" style={{ fontSize: 16 }} />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
        <p className="text-white text-center text-sm mb-6">Upload image</p>
        <div className="mb-4">
          <label className="block text-white mb-2">Business name</label>
          <input
            type="text"
            placeholder="ex: Royalz Store"
            className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 focus:outline-none"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        <div className="mb-8">
          <label className="block text-white mb-2">Category</label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-90 focus:outline-none appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="retail">Retail</option>
              <option value="restaurant">Restaurant</option>
              <option value="services">Services</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <KeyboardArrowDownIcon className="text-gray-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex-grow py-3 px-4 bg-white text-blue-500 rounded-lg font-medium flex items-center justify-center"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"}
            <ArrowForwardIcon className="ml-2" />
          </button>
        </div>
        <div className="flex items-center">
          <Link
            to="/home"
            className="text-white hover:text-blue-300 transition duration-300 flex-grow py-3 px-4 hover:bg-white rounded-lg font-medium flex items-center justify-center mt-4"
          >
            Skip
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;