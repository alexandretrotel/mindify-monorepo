import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Alert } from "react-native";
import useOptions from "@/hooks/features/mindify-ai/useOptions";

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
  const destructiveButton = buttons?.find((button) => button.style === "destructive");
  if (destructiveButton && destructiveButton.onPress) {
    destructiveButton.onPress();
  }
});

describe("useOptions", () => {
  let showActionSheetWithOptions: jest.Mock;
  let setMessages: jest.Mock;
  let resetGeneralChatId: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Alert, "alert").mockImplementation(() => {});

    showActionSheetWithOptions = jest.fn();
    setMessages = jest.fn();
    resetGeneralChatId = jest.fn();

    (useActionSheet as jest.Mock).mockReturnValue({ showActionSheetWithOptions });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should display alert with correct options when handleAlertDeleteDialog is called", async () => {
    (resetGeneralChatId as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useOptions(
        "user-id",
        1,
        [{ id: "1", chat_id: 1, sender: "user", content: "Hello", created_at: "2023-01-01" }],
        setMessages,
        resetGeneralChatId,
      ),
    );

    result.current.handleAlertDeleteDialog();

    expect(Alert.alert).toHaveBeenCalledWith(
      "Mindify AI",
      "Êtes-vous sûr de vouloir supprimer tous les messages ?",
      expect.arrayContaining([
        expect.objectContaining({ text: "Annuler", style: "cancel" }),
        expect.objectContaining({ text: "Supprimer", style: "destructive" }),
      ]),
    );
  });

  it("should display action sheet with correct options and handle button click", async () => {
    const { result } = renderHook(() =>
      useOptions("user-id", 1, [], setMessages, resetGeneralChatId),
    );

    result.current.handleNotificationsActionSheet();

    await waitFor(() => {
      expect(showActionSheetWithOptions).toHaveBeenCalledWith(
        {
          options: ["Supprimer tous les messages", "Annuler"],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0,
        },
        expect.any(Function),
      );
    });

    const callback = showActionSheetWithOptions.mock.calls[0][1];
    await act(async () => callback(0));

    expect(Alert.alert).toHaveBeenCalled();
  });
});
