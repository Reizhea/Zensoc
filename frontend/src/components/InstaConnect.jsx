import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import axios from "axios";
import { serverTimestamp } from "firebase/firestore";

const InstagramConnect = () => {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [pageId, setPageId] = useState(null);
  const [pageToken, setPageToken] = useState(null);
  const [instaToken, setInstaToken] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const ref = doc(db, "metaTokens", user.uid);

      const unsubscribeDoc = onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
          setStatus("hidden");
          return;
        }

        const data = snap.data();

        if (!data.fbToken || !data.pageId || !data.pageToken) {
          setStatus("hidden");
          return;
        }

        setPageId(data.pageId);
        setPageToken(data.pageToken);

        if (data.instaToken) {
          setInstaToken(data.instaToken);
          setStatus("connected");
        } else {
          setStatus("ready");
        }
      });

      return () => unsubscribeDoc();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleConnectInstagram = async () => {
    if (!pageId || !pageToken) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/instagram/get-instagram-id`,
        {
          pageId,
          accessToken: pageToken,
        }
      );

      const instagramId = res.data.instagramId;
      setInstaToken(instagramId);
      setStatus("connected");
      setError(null);

      await setDoc(
        doc(db, "metaTokens", auth.currentUser.uid),
        {
          instaToken: instagramId,
          instaConnectedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Instagram Connect Error:", err);
      setStatus("error");
      setError(
        err.response?.data?.error ||
          "No Instagram account is linked to this Facebook Page."
      );
    }
  };

  if (status === "hidden") return null;

  return (
    <div className="bg-gray-800 p-1 rounded-xl flex flex-col items-center w-56 relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/768px-Instagram_logo_2022.svg.png"
        alt="Instagram Logo"
        className="w-24 h-24 rounded-xl mb-4"
      />

      <p className="text-white font-medium text-sm mb-3">Instagram</p>

      <button
        onClick={handleConnectInstagram}
        disabled={status === "connected" || status === "loading"}
        className={`${
          status === "connected"
            ? "bg-green-500"
            : "bg-[#C13584] hover:bg-pink-700"
        } text-white font-bold text-sm px-6 py-2 rounded-full transition`}
      >
        {status === "connected" ? "Connected" : "Connect"}
      </button>

      {error && (
        <p className="text-xs text-red-400 mt-4 px-2 text-center">
          {error}
        </p>
      )}

      {!error && status !== "connected" && (
        <p className="text-xs text-gray-300 text-center mt-4 px-3">
          Make sure your Instagram account is connected to the selected Facebook Page.
        </p>
      )}
    </div>
  );
};

export default InstagramConnect;
