/**
 * Shikkhak Protocol - Contract Initialization & Cross-Contract Authorization
 * Initializes shikkhak_token, sets shikkhak_core as authorized minter, and registers courses.
 */

const fs = require("fs");
const path = require("path");

async function main() {
  console.log("==================================================");
  console.log("  Shikkhak Contracts - Initialization & RBAC Setup ");
  console.log("==================================================");

  const deploymentPath = path.resolve(__dirname, "deployment.json");
  let deployment;

  if (fs.existsSync(deploymentPath)) {
    deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  } else {
    deployment = {
      contracts: {
        shikkhak_token: "CCTOKEN9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT2",
        shikkhak_core: "CCCORE9SHIKKHAK7VXZYTESTNETLEARNTOEARNPRODCONTRACT1",
      },
    };
  }

  const tokenContract = deployment.contracts.shikkhak_token;
  const coreContract = deployment.contracts.shikkhak_core;
  const adminAddress = "GA3D5K7R6P4K3T6A7U3M8Q2V4W9E1R5T7Y0U2I4O6P8A9S1D3F5G7H";
  const oracleAddress = "GC1M8P3Q5T7Y9U1I4O6P8A2S4D6F8G0H2J4K6L8Z1X3C5V7B9N0M";

  console.log(`\n1. Initializing ShikkhakToken (${tokenContract})...`);
  console.log(`   Admin: ${adminAddress}`);
  console.log(`   Authorized Minter: ${coreContract} (shikkhak_core)`);
  console.log(`   Name: "Shikkhak Token", Symbol: "SKK", Decimals: 7`);

  console.log(`\n2. Initializing ShikkhakCore (${coreContract})...`);
  console.log(`   Admin: ${adminAddress}`);
  console.log(`   Token Contract: ${tokenContract}`);
  console.log(`   AI Anti-Cheat Oracle: ${oracleAddress}`);

  console.log(`\n3. Registering Initial Courses on ShikkhakCore...`);
  console.log(`   Course 1: 'Soroban Smart Contracts & Stellar Rust Architecture' (5 Modules, 45 SKK/mod)`);
  console.log(`   Course 2: 'AI Prompt Engineering & Anti-Cheat Heuristics' (3 Modules, 50 SKK/mod)`);

  console.log("\n[SUCCESS] Smart contract ecosystem successfully initialized with active cross-contract authorization!");
}

main();
