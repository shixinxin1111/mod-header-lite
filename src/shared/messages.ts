export const SYNC_RULES_MESSAGE = 'extension/sync-rules';

export type SyncReason = 'popup-save' | 'startup' | 'installed';

export type SyncRulesMessage = {
  type: typeof SYNC_RULES_MESSAGE;
  reason: SyncReason;
};

export function isSyncRulesMessage(message: unknown): message is SyncRulesMessage {
  return (
    typeof message === 'object' &&
    message !== null &&
    'type' in message &&
    (message as SyncRulesMessage).type === SYNC_RULES_MESSAGE
  );
}

export async function requestRulesSync(reason: SyncReason) {
  if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
    return;
  }

  await chrome.runtime.sendMessage({
    type: SYNC_RULES_MESSAGE,
    reason,
  } satisfies SyncRulesMessage);
}
