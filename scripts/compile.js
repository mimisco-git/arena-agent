const solc    = require("solc");
const fs      = require("fs");
const path    = require("path");

// ── read source ──
const srcPath  = path.resolve(__dirname, "../contracts/ArenaAgent.sol");
const source   = fs.readFileSync(srcPath, "utf8");

// ── solc input JSON ──
const input = JSON.stringify({
  language: "Solidity",
  sources: {
    "ArenaAgent.sol": { content: source }
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode.object"]
      }
    },
    optimizer: { enabled: true, runs: 200 }
  }
});

// ── compile ──
const outputRaw = solc.compile(input);
const output    = JSON.parse(outputRaw);

// ── check errors ──
if (output.errors) {
  output.errors.forEach(e => {
    if (e.severity === "error") {
      console.error(e.formattedMessage);
      process.exit(1);
    } else {
      console.warn(e.formattedMessage);
    }
  });
}

// ── extract ──
const contract = output.contracts["ArenaAgent.sol"]["ArenaAgent"];
if (!contract) {
  console.error("Contract 'ArenaAgent' not found in output");
  process.exit(1);
}

const compiled = {
  abi:      contract.abi,
  bytecode: contract.evm.bytecode.object
};

// ── write ──
const outPath = path.resolve(__dirname, "../artifacts/ArenaAgent.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(compiled, null, 2));

console.log("✅ Compiled — ABI entries:", compiled.abi.length);
console.log("   Bytecode length:      ", compiled.bytecode.length, "chars");
console.log("   Output:               ", outPath);
