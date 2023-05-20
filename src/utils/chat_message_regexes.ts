export const isDeathMessage = /\x1b\[0m\x1b\[97m\x1b\[36m[a-zA-Z0-9_]{3,16} \x1b\[35m.+/;
export const isPlayerMessage = /^<([a-zA-Z0-9_]{3,16})>/;
export const isBridgeMessage = /\[.+#[0-9]+].+/

