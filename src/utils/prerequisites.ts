import * as cp from 'child_process';
import * as util from 'util';

const exec = util.promisify(cp.exec);

export interface PrerequisiteCheckResult {
    node: boolean;
    npm: boolean;
    angularCli: boolean;
    nodeVersion?: string;
    npmVersion?: string;
    angularVersion?: string;
}

export async function checkPrerequisites(): Promise<PrerequisiteCheckResult> {
    const result: PrerequisiteCheckResult = {
        node: false,
        npm: false,
        angularCli: false
    };

    try {
        const { stdout: nodeOut } = await exec('node --version');
        result.node = true;
        result.nodeVersion = nodeOut.trim();
    } catch {
        // ignore
    }

    try {
        const { stdout: npmOut } = await exec('npm --version');
        result.npm = true;
        result.npmVersion = npmOut.trim();
    } catch {
        // ignore
    }

    try {
        const { stdout: ngOut } = await exec('ng version');
        result.angularCli = true;
        // extracting version from ng version output is complex, keeping simple
        result.angularVersion = "detected";
    } catch {
        // ignore
    }

    return result;
}
