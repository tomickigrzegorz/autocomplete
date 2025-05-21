/**
 * Key codes interface
 */
export interface KeyCodes {
  ESC: number;
  ENTER: number;
  UP: number;
  DOWN: number;
  TAB: number;
}

/** Key codes constant */
declare const KEY_CODES: Readonly<KeyCodes>;

export default KEY_CODES;
