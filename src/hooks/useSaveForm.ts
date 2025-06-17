import { useCallback } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path as needed


const baseUrl = import.meta.env.VITE_API_BASE_URL;

/**
 * useSaveForm - A hook to save any dashboard form for a given subject and item.
 * 
 * @param {string} subject - The form type (e.g., 'characterCreator', 'voiceSettings')
 * @param {string} itemId - The unique identifier for the sub-item (e.g., 'character-1')
 * @param {string} basePath - The base path for API: 'client' or 'admin' (default 'client')
 * @returns {function} - A save function to call with your form data
 */
const useSaveForm = (subject, itemId, basePath = "client") => {
  const { token } = useAuth(); // assumes AuthContext exposes the token

  const save = useCallback(
    async (formData) => {
      try {
        const response = await fetch(
          `${baseUrl}/${basePath}/save/${subject}/${itemId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: formData }),
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error?.message || "Failed to save form");
        }

        return await response.json();
      } catch (err) {
        console.error("❌ Save failed:", err);
        return { success: false, error: err.message };
      }
    },
    [subject, itemId, token, basePath]
  );

  return save;
};

export default useSaveForm;
