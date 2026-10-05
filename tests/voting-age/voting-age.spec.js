import { test, expect } from "@playwright/test";

function validVoteAge(number) {
  if (number >= 18) {
    return "Ви можете голосувати.";
  } else {
    return "Ви ще не можете голосувати.";
  }
}

const enoughAge = "Ви можете голосувати.";
const notEnoughAge = "Ви ще не можете голосувати.";

test("V001 - voting-age-validation-under-age", () => {
  expect(validVoteAge(10)).toBe(notEnoughAge);
});

test("V002 - voting-age-validation-not-enough-age", () => {
  expect(validVoteAge(17)).toBe(notEnoughAge);
});

test("V003 - voting-age-validation-minimum-enough-age", () => {
  expect(validVoteAge(18)).toBe(enoughAge);
});

test("V004 - voting-age-validation-valid-age", () => {
  expect(validVoteAge(19)).toBe(enoughAge);
});

test("V005 - voting-age-validation-sufficient-age", () => {
  expect(validVoteAge(30)).toBe(enoughAge);
});
