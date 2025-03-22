import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function useRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const noMail = !email || email.length === 0;
    const noPassword = !password || password.length === 0;
    const noName = !name || name.length === 0;
    const noConfirmPassword = !confirmPassword || confirmPassword.length === 0;
    const passwordMatch = password === confirmPassword;

    const disabled = noMail || noPassword || noName || noConfirmPassword || !passwordMatch;

    setDisabled(disabled);
  }, [confirmPassword, email, name, password]);

  const handleSignUp = async () => {
    if (!disabled) {
      setLoading(true);

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: name.split(" ")[0],
              last_name: name.split(" ")[1],
              full_name: `${name.trim()} ${name.trim()}`,
              name: `${name.trim()} ${name.trim()}`,
            },
          },
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
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    disabled,
    loading,
    handleSignUp,
  };
}
