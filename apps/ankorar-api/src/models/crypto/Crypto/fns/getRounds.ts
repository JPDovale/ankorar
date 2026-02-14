type GetRoundsResponse = number;

export function getRounds(): GetRoundsResponse {
  return process.env.NODE_ENV === "test" ? 1 : 14;
}
