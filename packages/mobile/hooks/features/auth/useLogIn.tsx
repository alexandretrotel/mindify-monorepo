import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function useLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const disabled = !email || !password || email.length === 0 || password.length === 0;

    setDisabled(disabled);
  }, [email, password]);

  const handleSignIn = async () => {
    if (!disabled) {
      setLoading(true);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Erreur",
          "Veuillez vérifier vos identifiants et réessayer. Si le problème persiste, veuillez contacter le support.",
        );
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Erreur", "Veuillez remplir tous les champs pour vous connecter.");
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    disabled,
    loading,
    handleSignIn,
  };
}
