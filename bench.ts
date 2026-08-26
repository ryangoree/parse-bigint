const strings = Array.from({ length: 100 }).map((_, i) =>
  String(Math.random() > 0.5 ? -i : i),
);

export function at() {
  return strings.map((s) => [s.at(0), s.slice(1)]);
}

export function index() {
  return strings.map((s) => [s[0], s.slice(1)]);
}
