import authReducer, {
  hydrateAuth,
  setUser,
  clearUser,
  setAuthError,
  setAuthLoading,
} from "../../store/authReducer";
import type { SerializableUser } from "../../types/user";

const user: SerializableUser = {
  uid: "uid-1",
  email: "a@b.com",
  emailVerified: true,
  displayName: "Anna",
  phoneNumber: null,
  photoURL: null,
};

const initialState = authReducer(undefined, { type: "@@INIT" });

describe("authReducer", () => {
  it("returns the initial state", () => {
    expect(initialState).toEqual({
      currentUser: null,
      userUid: null,
      isLoggedIn: false,
      status: "idle",
      error: null,
    });
  });

  it("hydrates with a user", () => {
    const state = authReducer(initialState, hydrateAuth(user));
    expect(state.currentUser).toEqual(user);
    expect(state.userUid).toBe("uid-1");
    expect(state.isLoggedIn).toBe(true);
    expect(state.status).toBe("succeeded");
  });

  it("hydrates with null (logged out)", () => {
    const state = authReducer(initialState, hydrateAuth(null));
    expect(state.currentUser).toBeNull();
    expect(state.userUid).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.status).toBe("succeeded");
  });

  it("sets the user and marks logged in", () => {
    const state = authReducer(initialState, setUser(user));
    expect(state.currentUser).toEqual(user);
    expect(state.userUid).toBe("uid-1");
    expect(state.isLoggedIn).toBe(true);
    expect(state.status).toBe("succeeded");
    expect(state.error).toBeNull();
  });

  it("clears the user", () => {
    const loggedIn = authReducer(initialState, setUser(user));
    const state = authReducer(loggedIn, clearUser());
    expect(state.currentUser).toBeNull();
    expect(state.userUid).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.status).toBe("idle");
  });

  it("records an auth error", () => {
    const state = authReducer(initialState, setAuthError("bad password"));
    expect(state.error).toBe("bad password");
    expect(state.status).toBe("failed");
  });

  it("marks auth as pending and clears errors", () => {
    const errored = authReducer(initialState, setAuthError("x"));
    const state = authReducer(errored, setAuthLoading());
    expect(state.status).toBe("pending");
    expect(state.error).toBeNull();
  });
});
