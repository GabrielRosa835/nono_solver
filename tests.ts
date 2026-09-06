import { Hint } from "./Board";
import { CellStatus } from "./Cell";
import { CellSection } from "./CellSection";

async function test(actionName: string, action: (assert: (assertion: boolean, assertionName: string) => void) => void) {
    const assertions: { result: boolean, assertionName: string }[] = [];
    function assert(assertion: boolean, message: string) {
        assertions.push({ result: assertion, assertionName: message });
    }
    action(assert);
    console.log(`${actionName}:`);
    for(let i = 0; i < assertions.length; i++) {
        console.log(`- ${assertions[i].assertionName}: ${String(assertions[i].result)}`)
    }
    console.log();
}