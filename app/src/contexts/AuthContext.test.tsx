import { renderHook, act, waitFor } from "@testing-library/react";
import { useAuth } from "./AuthContext";
import fetchMock from "fetch-mock";

const apiAddress = process.env.REACT_APP_BACKEND_ADDRESS;
const user = {
  id: "1234",
  role: "basic",
  email: "abc@xyz.com",
};
const sessionToken = "test-test";

describe("AuthContext", () => {
  describe("initial render", () => {
    it("should initially return user as null", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.currentUser).toBe(null);
    });

    it("should initially return sessionToken as null", () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.sessionToken).toBe(null);
    });
  });

  describe("login", () => {
    it("should call the correct endpoint when login is called", async () => {
      // unit tests should not call the API for real, so we mock the response
      fetchMock.sandbox().post(`${apiAddress}/api/auth/login`, {
        status: 200,
        body: {
          session: sessionToken,
        },
      });
      const { result } = renderHook(() => useAuth());

      act(() => {
        // call the login function
        result.current.login();
      });
      waitFor(() => {
        // we need to wait for the next tick of the event loop.
        // if you don't wait, this will fail as the API hasn't finished responding
        expect(fetchMock.called()).toBe(true);
      });
    });

    it("should set the sessionToken as returned from API when login is called", async () => {
      fetchMock.sandbox().post(`${apiAddress}/api/auth/login`, {
        status: 200,
        body: {
          session: sessionToken,
        },
      });
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.login();
      });
      waitFor(() => {
        expect(result.current.sessionToken).toEqual(sessionToken);
      });
    });

    it("should set the current user as returned from API when login is called", async () => {
      fetchMock.sandbox().post(`${apiAddress}/api/auth/login`, {
        status: 200,
        body: {
          user,
        },
      });
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.login();
      });
      waitFor(() => {
        expect(result.current.currentUser).toEqual(user);
      });
    });
  });
  describe("logout", () => {
    it("should call the correct endpoint when logout is called", async () => {
      fetchMock.sandbox().post(`${apiAddress}/api/auth/logout`, {
        status: 200,
      });
      const { result } = renderHook(() => useAuth());
      act(() => {
        result.current.logout();
      });
      waitFor(() => {
        expect(fetchMock.called()).toBe(true);
      });
    });

    it("should set the currentUser as null when logout is called", async () => {
      fetchMock.sandbox().post(`${apiAddress}/api/auth/login`, {
        status: 200,
        body: {
          user,
        },
      });
      const { result, rerender } = renderHook(() => useAuth());
      act(() => {
        result.current.login();
      });
      waitFor(() => {
        expect(result.current.currentUser).toEqual(user);
      });

      rerender();

      fetchMock.sandbox().post(`${apiAddress}/api/auth/logout`, {
        status: 200,
      });

      act(() => {
        result.current.logout();
      });
      waitFor(() => {
        expect(result.current.currentUser).toBe(null);
      });
    });

    it("should set the sessionToken as null when logout is called", async () => {
      fetchMock.sandbox().post(`${apiAddress}/api/auth/login`, {
        status: 200,
        body: {
          session: sessionToken,
        },
      });
      const { result, rerender } = renderHook(() => useAuth());
      act(() => {
        result.current.login();
      });
      // we need to make sure we actually have a session token first
      // before we can test that it is set to null
      waitFor(() => {
        expect(result.current.sessionToken).toEqual(sessionToken);
      });

      rerender();

      fetchMock.sandbox().post(`${apiAddress}/api/auth/logout`, {
        status: 200,
      });

      act(() => {
        result.current.logout();
      });
      waitFor(() => {
        expect(result.current.sessionToken).toBe(null);
      });
    });
  });
});
