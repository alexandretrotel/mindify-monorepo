import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useSession } from "@/providers/SessionProvider";
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";
import { getAvatar } from "@/utils/avatars";
import { Alert } from "react-native";

/**
 * A hook that updates the user's avatar.
 *
 * @returns The avatar, uploading state, and pick image handler.
 */
export default function useUpdateAvatar() {
  const [uploading, setUploading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");

  const { userId, userMetadata } = useSession();

  useEffect(() => {
    if (userMetadata) {
      const avatar = getAvatar(userMetadata);
      if (avatar) {
        setAvatar(avatar);
      }
    }
  }, [userMetadata]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const asset = result?.assets?.[0];
        const uri = asset?.uri;

        if (!uri) {
          console.error("L'objet asset est:", asset);
          throw new Error("Impossible de récupérer l'URI de l'image.");
        }

        setUploading(true);

        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 200, height: 200 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
        );

        const path = manipResult.uri;
        const response = await fetch(path);
        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Blob is empty.");
        }

        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            if (reader.result instanceof ArrayBuffer) {
              resolve(reader.result);
            } else {
              reject(new Error("Failed to read file as ArrayBuffer."));
            }
          };

          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        });

        const fileName = `${userId}/avatar.jpeg`;

        const { error: updateAvatarError } = await supabase.storage
          .from("avatars")
          .upload(fileName, arrayBuffer, {
            cacheControl: "3600",
            upsert: true,
            contentType: "image/jpeg",
          });

        if (updateAvatarError) {
          console.error(updateAvatarError);
          throw new Error("Impossible de télécharger l'avatar.");
        }

        const { data: avatarUrl } = supabase.storage.from("avatars").getPublicUrl(fileName);

        if (!avatarUrl) {
          throw new Error("Impossible d'obtenir l'URL publique de l'avatar.");
        }

        const { error: updateAvatarUrlError } = await supabase.auth.updateUser({
          data: {
            custom_avatar: avatarUrl.publicUrl,
          },
        });

        if (updateAvatarUrlError) {
          console.error(updateAvatarUrlError);
          throw new Error("Impossible de mettre à jour l'URL de l'avatar.");
        }

        setAvatar(avatarUrl.publicUrl);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Une erreur est survenue lors de la mise à jour de l'avatar.");
    } finally {
      setUploading(false);
    }
  };

  return {
    avatar,
    uploading,
    pickImage,
  };
}
