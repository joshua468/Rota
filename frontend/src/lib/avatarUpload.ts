import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Platform } from 'react-native';

/**
 * A profile photo is the user's own image. The picker hands over whatever is in
 * the camera roll (often 4 MB, sometimes HEIC), so the picture is cropped to a
 * square, resized and re-encoded as JPEG before it goes near the API — the
 * server accepts at most 2 MB of JPEG/PNG/WebP.
 */
export type AvatarUpload = {
  dataBase64: string;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
};

const TARGET_EDGE = 512;
const COMPRESSION = 0.8;

export class AvatarPickError extends Error {}

/**
 * Opens the photo library and returns the image ready to upload, or `null`
 * when the user cancelled. Throws `AvatarPickError` with a message the screen
 * can show as-is.
 */
export async function pickAvatar(): Promise<AvatarUpload | null> {
  if (Platform.OS !== 'web') {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      throw new AvatarPickError('Photo access is off. Turn it on in your device settings.');
    }
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if (!asset?.uri) return null;

  const compressed = await compressToJpeg(asset.uri);
  if (!compressed) {
    throw new AvatarPickError('That picture could not be read. Try another one.');
  }
  return { dataBase64: compressed, contentType: 'image/jpeg' };
}

/**
 * Resizes to a square and re-encodes as JPEG. Falls back to the original file
 * when the platform cannot manipulate images (the web build without canvas
 * support), in which case the picker already delivered a JPEG.
 */
async function compressToJpeg(uri: string): Promise<string | null> {
  try {
    const context = ImageManipulator.manipulate(uri);
    const rendered = await context.resize({ width: TARGET_EDGE, height: TARGET_EDGE }).renderAsync();
    const saved = await rendered.saveAsync({
      compress: COMPRESSION,
      format: SaveFormat.JPEG,
      base64: true,
    });
    return saved.base64 ?? null;
  } catch {
    return null;
  }
}
