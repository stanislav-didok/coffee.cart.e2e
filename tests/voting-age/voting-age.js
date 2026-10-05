function votingAcceptance(age) {
  if (age >= 18) {
    return "Ви можете голосувати.";
  } else {
    return "Ви не можете голосувати.";
  }
}
console.log(votingAcceptance(17));
