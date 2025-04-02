import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Box, Typography, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import ArtWork from "../../assets/artwork.png";

const Confirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-300 to-blue-900 relative px-4">
      {/* Login Button */}
      <div className="absolute top-8 right-8">
        <Link
          to="/login"
          className="bg-white text-blue-600 rounded-full px-4 py-2 text-lg sm:text-xl font-medium flex items-center space-x-2 hover:bg-blue-50 transition duration-300 shadow-md"
        >
          <PersonIcon className="text-blue-600" />
          <span>Login</span>
        </Link>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-4">
        <CheckCircleIcon className="text-white text-3xl sm:text-4xl" />
        <div className="w-10 h-1 bg-white mx-2"></div>
        <CheckCircleIcon className="text-white text-3xl sm:text-4xl" />
        <div className="w-10 h-1 bg-white mx-2"></div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl font-bold text-blue-900">
          3
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-blue-400/10 inset-shadow-sm inset-shadow-indigo-400 rounded-3xl p-6 max-w-md text-center backdrop-blur-md w-full">
        <div className="flex justify-center items-center mb-8">
          <img src={ArtWork} alt="Art Work" className="w-32 sm:w-40 md:w-56" />
        </div>

        {/* Text Content */}
        <Typography variant="h4" className="text-white font-bold mb-2">
          All done!
        </Typography>
        <Typography className="text-blue-200 mb-4">
          Zensoc is a Social-Media-driven platform focused on fostering
          integration of social media inboxes in a single space.
        </Typography>

        {/* Continue Button */}
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            borderRadius: "50px",
            backgroundColor: "white",
            color: "#0891B2",
            textTransform: "none",
            px: 3,
            py: 1.5,
          }}
          onClick={() => navigate("/home")} 
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
