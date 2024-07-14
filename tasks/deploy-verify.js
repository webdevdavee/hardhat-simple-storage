require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

task("deploy-and-verify", "Deploys and verifies the contract").setAction(
  async (taskArgs, hre) => {
    try {
      // Deploy
      console.log("Deploying contract...");
      const SimpleStorage = await hre.ethers.getContractFactory(
        "SimpleStorage"
      );
      const simpleStorage = await SimpleStorage.deploy();
      const contractAddress = await simpleStorage.getAddress();
      console.log("Contract deployed to:", contractAddress);

      // Verify
      if (
        network.config.chainId === 11155111 &&
        process.env.ETHERSCAN_API_KEY
      ) {
        console.log("Waiting for block confirmations...");
        await simpleStorage.waitForDeployment(6); // Wait for 6 confirmations
        console.log("Verifying contract...");
        try {
          await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [], // Add constructor arguments if any
          });
          console.log("Contract successfully verified!");
        } catch (error) {
          if (error.message.toLowerCase().includes("already verified")) {
            console.log("Contract already verified!");
          } else {
            console.error("Error verifying contract:", error);
          }
        }
      }
      console.log("Deployment and verification process completed!");

      const currentValue = await simpleStorage.retrieve();
      console.log(`Current Value is: ${currentValue}`);

      // Update the current value
      const transactionResponse = await simpleStorage.store(7);
      await transactionResponse.wait(1);
      const updatedValue = await simpleStorage.retrieve();
      console.log(`Updated Value is: ${updatedValue}`);
    } catch (error) {
      console.error("Error in deployment or verification:", error);
      process.exit(1);
    }
  }
);

module.exports = {};
