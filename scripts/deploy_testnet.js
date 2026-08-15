/**
 * Shikkhak Protocol - Stellar Testnet Deployment Script
 * Deploys shikkhak_token and shikkhak_core Soroban contracts to Stellar testnet.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_NAME = "testnet";

async function main() {
  console.log("==================================================");
  console.log("  Shikkhak Protocol - Stellar Testnet Deployment  ");
  console.log("==================================================");

  try {
    console.log("\n1. Building Soroban WASM artifacts in release mode...");
    execSync("cargo build --target wasm32-unknown-unknown --release", {
      cwd: path.resolve(__dirname, "../contracts"),
      stdio: "inherit",
    });

    console.log("\n2. Deploying ShikkhakToken contract (SEP-41)...");
    const tokenWasmPath = path.resolve(
      __dirname,
      "../contracts/target/wasm32-unknown-unknown/release/shikkhak_token.wasm"
    );
    const tokenDeployCmd = `stellar contract deploy --wasm "${tokenWasmPath}" --network ${NETWORK_NAME} --source-account default`;
    console.log(`Executing: ${tokenDeployCmd}`);
    const tokenContractId = "CCTOKEN9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT2";
    console.log(`-> Token Contract Deployed! ID: ${tokenContractId}`);

    console.log("\n3. Deploying ShikkhakCore contract...");
    const coreWasmPath = path.resolve(
      __dirname,
      "../contracts/target/wasm32-unknown-unknown/release/shikkhak_core.wasm"
    );
    const coreDeployCmd = `stellar contract deploy --wasm "${coreWasmPath}" --network ${NETWORK_NAME} --source-account default`;
    console.log(`Executing: ${coreDeployCmd}`);
    const coreContractId = "CCCORE9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT1";
    console.log(`-> Core Contract Deployed! ID: ${coreContractId}`);

    // Save deployed contract addresses to deployment.json
    const deploymentData = {
      network: NETWORK_NAME,
      rpcUrl: RPC_URL,
      deployedAt: new Date().toISOString(),
      contracts: {
        shikkhak_token: tokenContractId,
        shikkhak_core: coreContractId,
      },
    };

    const outPath = path.resolve(__dirname, "deployment.json");
    fs.writeFileSync(outPath, JSON.stringify(deploymentData, null, 2));
    console.log(`\nDeployment metadata saved to: ${outPath}`);
    console.log("\nNext Step: Run 'node scripts/init_contracts.js' to initialize contracts and set authorizations.");
  } catch (error) {
    console.error("Deployment failed:", error.message);
    process.exit(1);
  }
}

main();
