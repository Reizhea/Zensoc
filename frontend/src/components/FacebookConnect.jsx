import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import axios from "axios";
import { serverTimestamp } from "firebase/firestore";

const FacebookConnect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPageName, setSelectedPageName] = useState("");
  const [pages, setPages] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;
      const ref = doc(db, "facebookTokens", user.uid);
      const snap = await getDoc(ref);
      setIsConnected(snap.exists() && snap.data().accessToken);

      if (snap.exists()) {
        const data = snap.data();
        setIsConnected(!!data.accessToken);
        if (data.pageName) setSelectedPageName(data.pageName);
      }
    
    };
    checkConnection();
  }, [user]);

  const handleConnect = () => {
    if (!window.FB || !user) return;

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          (async () => {
            try {
              const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/facebook/long-token`,
                { accessToken }
              );

              const longLivedToken = res.data.longLivedToken;

              await setDoc(doc(db, "facebookTokens", user.uid), {
                accessToken: longLivedToken,
                createdAt: serverTimestamp(),
              });

              setIsConnected(true);

              await fetchPages(longLivedToken);
              setShowDialog(true);
            } catch (err) {
              console.error("Failed to save access token:", err);
            }
          })();
        } else {
          console.error("User cancelled login or did not authorize.");
        }
      },
      {
        scope: "pages_show_list,pages_read_engagement,pages_messaging",
      }
    );
  };

  const fetchPages = async (token) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/facebook/get-pages`,
        { accessToken: token }
      );
      setPages(res.data.pages || []);
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    }
  };

  const handlePageSelection = async (page) => {
    if (!user) return;
    try {
      await setDoc(doc(db, "facebookTokens", user.uid), {
        pageaccessToken: page.accessToken,
        pageId: page.pageId,
        pageName: page.name,
      }, { merge: true });
      setSelectedPageName(page.name);
      setShowDialog(false);
    } catch (err) {
      console.error("Failed to set selected page:", err);
    }
  };

  const handleSelectClick = async () => {
    const ref = doc(db, "facebookTokens", user.uid);
    const snap = await getDoc(ref);
    const token = snap.data().accessToken;
    await fetchPages(token);
    setShowDialog(true);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl flex flex-col items-center w-64 relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/900px-Facebook_logo_%28square%29.png"
        alt="Facebook Logo"
        className="w-24 h-24 rounded-xl mb-4"
      />
      <p className="text-white font-medium text-sm mb-3">Facebook</p>
      <button
        onClick={handleConnect}
        disabled={isConnected}
        className={`${
          isConnected ? "bg-green-500" : "bg-[#1877F2] hover:bg-blue-600"
        } text-white font-bold text-sm px-6 py-2 rounded-full transition`}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>

      {isConnected && (
          <button
            onClick={handleSelectClick}
            className="mt-4 bg-gray-700 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded-md"
          >
            {selectedPageName || "Select Page"}
          </button>
        )}

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg shadow-lg w-80 max-h-[60vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-lg">Select a Page</h2>
              <button onClick={() => setShowDialog(false)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>
            <ul>
              {pages.map((page) => (
                <li
                  key={page.pageId}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                  onClick={() => handlePageSelection(page)}
                >
                  {page.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookConnect;