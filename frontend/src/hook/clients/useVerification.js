import { useEffect, useCallback } from "react";
import { toast } from "react-toastify";

export const useVerification = (candidateID, onVerifyComplete) => {
  const handleExtensionMessage = useCallback(
    (request, sender, sendResponse) => {
      // Listen cho NANO_TASK_COMPLETED message từ extension
      if (request.action === "NANO_TASK_COMPLETED") {
        const { candidateID: extCandidateID, status, result } = request;

        // Kiểm tra xem response này có phải cho candidate hiện tại không
        if (extCandidateID === candidateID) {
          if (status === "success" && result) {
            // Call callback với dữ liệu verification từ extension
            onVerifyComplete(null, result);
            sendResponse({ received: true });
          } else if (status === "failed") {
            const error = result?.error || "Extension không thể kiểm chứng";
            console.error("Extension verification failed:", error);
            onVerifyComplete(error, null);
            sendResponse({ received: true });
          }
        }
      }

      // Listen cho NANO_TASK_ERROR message
      if (request.action === "NANO_TASK_ERROR") {
        const { candidateID: extCandidateID, error } = request;

        if (extCandidateID === candidateID) {
          console.error("Extension task error:", error);
          onVerifyComplete(error, null);
          sendResponse({ received: true });
        }
      }
    },
    [candidateID, onVerifyComplete],
  );

  useEffect(() => {
    // Đăng ký listener cho extension messages
    chrome.runtime.onMessage.addListener(handleExtensionMessage);

    // Cleanup listener khi component unmount
    return () => {
      chrome.runtime.onMessage.removeListener(handleExtensionMessage);
    };
  }, [handleExtensionMessage]);
};
