import { useSession } from "@/providers/SessionProvider";
import { useEffect, useState } from "react";

export default function useMissingName(setFriendsModalVisible?: (value: boolean) => void) {
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const { handleAddName } = useSession();

  useEffect(() => {
    if (name.length > 3) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name]);

  const handleAddMissingName = async () => {
    setLoading(true);
    try {
      await handleAddName(name);

      if (setFriendsModalVisible) {
        setFriendsModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    disabled,
    loading,
    handleAddMissingName,
  };
}
