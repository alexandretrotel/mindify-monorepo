import { act, renderHook } from "@testing-library/react-native";
import useUpdateAvatar from "@/hooks/features/account/profile/useUpdateAvatar";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { supabase } from "@/lib/supabase";

jest.mock("@/lib/supabase", () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn(),
    },
    auth: {
      updateUser: jest.fn(),
    },
  },
}));

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: {
    All: "All",
  },
}));

jest.mock("expo-image-manipulator", () => ({
  manipulateAsync: jest.fn(),
  SaveFormat: {
    JPEG: "JPEG",
  },
}));

describe("useUpdateAvatar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() => useUpdateAvatar());

    expect(result.current.uploading).toBe(false);
    expect(result.current.avatar).toBe("");
  });

  it("should pick an image and handle when image picking is canceled", async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({ canceled: true });
    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    expect(result.current.avatar).toBe("");
  });

  it("should pick an image and handle when image is selected", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "mock-manipulated-uri",
    });

    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["mock-blob"], { type: "image/jpeg" })),
    });

    class MockFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      readAsArrayBuffer = jest.fn().mockImplementation((blob) => {
        this.result = new ArrayBuffer(8);
        this.onloadend();
      });
      onloadend = jest.fn();
      onerror = jest.fn();
      result = new ArrayBuffer(8);
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;

    (supabase.storage.from("avatars").upload as jest.Mock).mockResolvedValue({
      error: null,
    });

    (supabase.storage.from("avatars").getPublicUrl as jest.Mock).mockReturnValue({
      data: {
        publicUrl: "mock-public-url",
      },
    });

    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
      data: {
        custom_avatar: "mock-public-url",
      },
    });

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalledWith({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    expect(ImageManipulator.manipulateAsync).toHaveBeenCalledWith(
      "mock-uri",
      [{ resize: { width: 200, height: 200 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
    );
    expect(supabase.storage.from("avatars").upload).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(ArrayBuffer),
      {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      },
    );
    expect(supabase.storage.from("avatars").getPublicUrl).toHaveBeenCalled();
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: {
        custom_avatar: "mock-public-url",
      },
    });
    expect(result.current.avatar).toBe("mock-public-url");
  });

  it("should handle errors when uploading an image", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "mock-manipulated-uri",
    });

    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["mock-blob"], { type: "image/jpeg" })),
    });

    class MockFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      readAsArrayBuffer = jest.fn().mockImplementation((blob) => {
        this.result = new ArrayBuffer(8);
        this.onloadend();
      });
      onloadend = jest.fn();
      onerror = jest.fn();
      result = new ArrayBuffer(8);
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;

    (supabase.storage.from("avatars").upload as jest.Mock).mockResolvedValue({
      error: mockError,
    });

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle errors when updating the user", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "mock-manipulated-uri",
    });

    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["mock-blob"], { type: "image/jpeg" })),
    });

    class MockFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      readAsArrayBuffer = jest.fn().mockImplementation((blob) => {
        this.result = new ArrayBuffer(8);
        this.onloadend();
      });
      onloadend = jest.fn();
      onerror = jest.fn();
      result = new ArrayBuffer(8);
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;

    (supabase.storage.from("avatars").upload as jest.Mock).mockResolvedValue({
      error: null,
    });

    (supabase.auth.updateUser as jest.Mock).mockResolvedValue({
      error: mockError,
    });

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle errors when fetching the image blob", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "mock-manipulated-uri",
    });

    global.fetch = jest.fn().mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle errors when reading the image blob", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockResolvedValue({
      uri: "mock-manipulated-uri",
    });

    global.fetch = jest.fn().mockResolvedValue({
      blob: jest.fn().mockResolvedValue(new Blob(["mock-blob"], { type: "image/jpeg" })),
    });

    class MockFileReader {
      static EMPTY = 0;
      static LOADING = 1;
      static DONE = 2;
      readAsArrayBuffer = jest.fn().mockImplementation((blob) => {
        this.onerror(mockError);
      });
      onloadend = jest.fn();
      onerror = jest.fn();
      result = new ArrayBuffer(8);
    }

    global.FileReader = MockFileReader as unknown as typeof FileReader;

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle errors when manipulating the image", async () => {
    const mockImageResult = {
      canceled: false,
      assets: [{ uri: "mock-uri" }],
    };
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue(mockImageResult);
    (ImageManipulator.manipulateAsync as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });

  it("should handle errors when picking an image", async () => {
    const mockError = new Error("mock-error");

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUpdateAvatar());

    await act(async () => await result.current.pickImage());

    expect(console.error).toHaveBeenCalledWith(mockError);
  });
});
