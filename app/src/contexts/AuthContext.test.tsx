import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthProvider } from "./AuthContext";

describe("AuthContext", () => {
  it("should be false", () => {
    expect(false).toBe(false);
  });

  it("should render the thing", () => {
    render(<AuthProvider>{(value) => <span>{value}</span>}</AuthProvider>);
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
  });
});
