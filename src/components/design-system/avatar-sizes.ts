// The avatar's size ladder, in a plain module rather than Avatar.tsx: that file is a client module, and a
// server page that imports a value from it gets a reference, not the array, so the guide reads it here.
export type AvatarSize = 20 | 24 | 32 | 40 | 48 | 64 | 96;

export const AVATAR_SIZES: readonly AvatarSize[] = [20, 24, 32, 40, 48, 64, 96];
