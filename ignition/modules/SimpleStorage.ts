import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const SimpleStorageModule = buildModule("SimpleStorage", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  const simpleStorage = m.contract("SimpleStorage", []);

  return { simpleStorage };
});

export default SimpleStorageModule;
