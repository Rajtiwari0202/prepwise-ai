type WithId = {
  _id: unknown;
};

export function idOf(document: WithId) {
  return String(document._id);
}

export function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString() : undefined;
}
