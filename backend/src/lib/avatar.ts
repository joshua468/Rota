import { AVATAR_MAX_BYTES, type AvatarContentType } from '@rota/contract';
import { badRequest } from './errors';

/** Standard base64 (no data: prefix, no URL-safe alphabet). */
const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;

/**
 * Decodes the base64 payload the client uploaded. The string is checked
 * before decoding (Node's decoder silently drops invalid characters) and the
 * decoded size is capped, so a hostile client cannot push megabytes into the
 * database through a JSON body.
 */
export function decodeAvatarBase64(data: string): Buffer {
  if (data.length % 4 !== 0 || !BASE64.test(data)) {
    throw badRequest('That image could not be read. Upload it again.');
  }
  const bytes = Buffer.from(data, 'base64');
  if (bytes.length === 0) throw badRequest('That image could not be read. Upload it again.');
  if (bytes.length > AVATAR_MAX_BYTES) {
    throw badRequest('That image is too large. Use a picture under 2 MB.');
  }
  return bytes;
}

/**
 * Reads the real image type from the file signature. The declared content type
 * is never trusted on its own: a file that claims to be a PNG but starts with
 * HTML would be served to the web client as an image, so the bytes decide.
 */
export function sniffImageType(bytes: Buffer): AvatarContentType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}
