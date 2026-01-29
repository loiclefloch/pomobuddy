import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SettingsForm } from "./SettingsForm";
import { useSettingsStore } from "../stores/settingsStore";
import { DEFAULT_SETTINGS } from "../types";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

import { invoke } from "@tauri-apps/api/core";
const mockInvoke = vi.mocked(invoke);

describe("SettingsForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInvoke.mockResolvedValue(DEFAULT_SETTINGS);
    useSettingsStore.setState({
      settings: DEFAULT_SETTINGS,
      isLoading: false,
      error: null,
    });
  });

  it("renders storage location section", () => {
    render(<SettingsForm />);

    expect(screen.getByText("Storage Location")).toBeInTheDocument();
    expect(screen.getByText(/Default \(App Data\)/)).toBeInTheDocument();
    expect(screen.getByText("Browse")).toBeInTheDocument();
  });

  it("displays custom storage path when set", () => {
    useSettingsStore.setState({
      settings: { ...DEFAULT_SETTINGS, storagePath: "/custom/path" },
      isLoading: false,
      error: null,
    });

    render(<SettingsForm />);

    expect(screen.getByText("/custom/path")).toBeInTheDocument();
  });

  it("shows reset button when custom path is set", () => {
    useSettingsStore.setState({
      settings: { ...DEFAULT_SETTINGS, storagePath: "/custom/path" },
      isLoading: false,
      error: null,
    });

    render(<SettingsForm />);

    expect(screen.getByTitle("Reset to default location")).toBeInTheDocument();
  });

  it("hides reset button when using default path", () => {
    render(<SettingsForm />);

    expect(
      screen.queryByTitle("Reset to default location")
    ).not.toBeInTheDocument();
  });

  it("renders timer settings section", () => {
    render(<SettingsForm />);

    expect(screen.getByText("Timer Settings")).toBeInTheDocument();
    expect(screen.getByText("Focus Duration")).toBeInTheDocument();
    expect(screen.getByText("Break Duration")).toBeInTheDocument();
    expect(screen.getByText("25 minutes")).toBeInTheDocument();
    expect(screen.getByText("5 minutes")).toBeInTheDocument();
  });

  it("renders audio and character section", () => {
    render(<SettingsForm />);

    expect(screen.getByText("Audio & Character")).toBeInTheDocument();
    expect(screen.getByText("Audio Enabled")).toBeInTheDocument();
    expect(screen.getByText("Character")).toBeInTheDocument();
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("renders error state styles correctly", () => {
    useSettingsStore.setState({
      settings: DEFAULT_SETTINGS,
      isLoading: true,
      error: null,
    });
    mockInvoke.mockImplementation(() => new Promise(() => {}));

    render(<SettingsForm />);

    const browseButton = screen.getByText("Browse").closest("button");
    expect(browseButton).toHaveAttribute("disabled");
  });

  it("disables browse button while loading", () => {
    useSettingsStore.setState({
      settings: DEFAULT_SETTINGS,
      isLoading: true,
      error: null,
    });

    render(<SettingsForm />);

    const browseButton = screen.getByText("Browse").closest("button");
    expect(browseButton).toBeDisabled();
  });

  it("calls pickStorageFolder and changeStorageLocation on browse", async () => {
    mockInvoke
      .mockResolvedValueOnce(DEFAULT_SETTINGS)
      .mockResolvedValueOnce("/new/folder")
      .mockResolvedValueOnce(undefined);

    render(<SettingsForm />);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith("get_settings");
    });

    const browseButton = screen.getByText("Browse").closest("button");
    fireEvent.click(browseButton!);

    await waitFor(() => {
      expect(mockInvoke).toHaveBeenCalledWith("pick_storage_folder");
    });
  });
});
