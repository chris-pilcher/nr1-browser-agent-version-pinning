import formatToShortDate from "../date";

describe("formatToShortDate", () => {
  it("formats full ISO date string to short date", () => {
    expect(formatToShortDate("2024-12-16T00:00:00.000Z")).toBe("Dec 16, 2024");
  });
});
