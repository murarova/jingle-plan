export interface SerializableUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  metadata?: {
    lastSignInTime?: string;
    creationTime?: string;
  };
}

export const convertToSerializableUser = (
  firebaseUser: any
): SerializableUser => {
  if (!firebaseUser) throw new Error("Cannot convert null user");

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    displayName: firebaseUser.displayName,
    phoneNumber: firebaseUser.phoneNumber,
    photoURL: firebaseUser.photoURL,
    metadata: {
      lastSignInTime: firebaseUser.metadata?.lastSignInTime,
      creationTime: firebaseUser.metadata?.creationTime,
    },
  };
};
