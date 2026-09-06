import { Hint } from "./Board";
import { CellStatus } from "./Cell";
import { CellSection } from "./CellSection";
import { extractMinimalPosition } from "./solver";

async function test(actionName: string, action: (assert: (assertion: boolean, message: string) => void) => void) {
    const assertions: { result: boolean, message: string }[] = [];
    function assert(assertion: boolean, message: string) {
        assertions.push({ result: assertion, message });
    }
    action(assert);
    console.log(`${actionName}:`);
    for(let i = 0; i < assertions.length; i++) {
        console.log(`- ${assertions[i].message}: ${String(assertions[i].result)}`)
    }
    console.log();
}