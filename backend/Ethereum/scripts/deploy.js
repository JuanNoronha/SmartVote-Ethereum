async function main() {
  await ethers.deployContract("ElectionFact");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });